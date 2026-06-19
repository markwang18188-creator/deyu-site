import OpenAI from 'openai';
import { headers } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { buildSystemPrompt } from '@/lib/chatbot/system-prompt';
import { chatbotTools, executeTool, type ToolContext } from '@/lib/chatbot/tools';
import { createDeepSeek, DEEPSEEK_MODEL } from '@/lib/deepseek';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = DEEPSEEK_MODEL;
const MAX_TOKENS = 1024;
const MAX_TOOL_ROUNDS = 5;

interface ChatRequest {
  sessionId?: string;
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  referrerPage?: string;
  locale?: string;
}

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: Request) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'chatbot_unavailable',
        message: 'AI advisor is being configured. Please use the contact form or WhatsApp button.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = (await req.json()) as ChatRequest;
  const { message, history = [], referrerPage, locale } = body;
  let { sessionId } = body;

  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'invalid_message' }), { status: 400 });
  }

  const hdrs = await headers();
  const visitorCountry = hdrs.get('cf-ipcountry') || hdrs.get('x-vercel-ip-country') || undefined;
  const visitorIp =
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || hdrs.get('x-real-ip') || undefined;
  const userAgent = hdrs.get('user-agent') || undefined;

  const supabase = serviceClient();

  if (!sessionId) {
    const { data: session, error } = await supabase
      .from('chatbot_sessions')
      .insert({
        visitor_ip: visitorIp,
        visitor_country: visitorCountry,
        referrer_page: referrerPage,
        user_agent: userAgent,
        language: locale,
      })
      .select('id')
      .single();
    if (error) {
      console.error('[api/chat] session insert failed:', error.message);
    } else {
      sessionId = session.id as string;
    }
  } else {
    supabase
      .from('chatbot_sessions')
      .update({ last_activity_at: new Date().toISOString(), language: locale })
      .eq('id', sessionId)
      .then(({ error }) => {
        if (error) console.error('[api/chat] session update failed:', error.message);
      });
  }

  if (sessionId) {
    supabase
      .from('chatbot_messages')
      .insert({ session_id: sessionId, role: 'user', content: message })
      .then(({ error }) => {
        if (error) console.error('[api/chat] user msg insert failed:', error.message);
      });
  }

  const client = createDeepSeek();

  const systemPrompt = buildSystemPrompt();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: message },
  ];

  const toolCtx: ToolContext = {
    sessionId: sessionId || '',
    visitorCountry,
    language: locale,
    referrerPage,
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        if (sessionId) send('session', { sessionId });

        let finalAssistantText = '';
        const toolCallLog: Array<{ name: string; input: unknown; output: string }> = [];

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const completion = await client.chat.completions.create({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            messages,
            tools: chatbotTools,
            stream: true,
          });

          let roundText = '';
          // toolCallId -> { id, name, argsBuffer }
          const pendingCalls = new Map<number, { id: string; name: string; args: string }>();
          let finishReason: string | null = null;

          for await (const chunk of completion) {
            const choice = chunk.choices[0];
            if (!choice) continue;
            const delta = choice.delta;

            if (delta?.content) {
              roundText += delta.content;
              send('delta', { text: delta.content });
            }

            if (delta?.tool_calls) {
              for (const tcDelta of delta.tool_calls) {
                const idx = tcDelta.index ?? 0;
                if (!pendingCalls.has(idx)) {
                  pendingCalls.set(idx, {
                    id: tcDelta.id || `call_${idx}`,
                    name: tcDelta.function?.name || '',
                    args: tcDelta.function?.arguments || '',
                  });
                } else {
                  const existing = pendingCalls.get(idx)!;
                  if (tcDelta.id) existing.id = tcDelta.id;
                  if (tcDelta.function?.name) existing.name = tcDelta.function.name;
                  if (tcDelta.function?.arguments) existing.args += tcDelta.function.arguments;
                }
              }
            }

            if (choice.finish_reason) {
              finishReason = choice.finish_reason;
            }
          }

          finalAssistantText += roundText;

          if (finishReason !== 'tool_calls' || pendingCalls.size === 0) {
            break;
          }

          // Build assistant message with tool_calls
          const toolCallsArr = Array.from(pendingCalls.values()).map((c) => ({
            id: c.id,
            type: 'function' as const,
            function: { name: c.name, arguments: c.args },
          }));

          messages.push({
            role: 'assistant',
            content: roundText || null,
            tool_calls: toolCallsArr,
          });

          // Execute each tool and push tool message
          for (const call of toolCallsArr) {
            send('tool_use', { name: call.function.name, id: call.id });
            let parsedArgs: Record<string, unknown> = {};
            try {
              parsedArgs = JSON.parse(call.function.arguments || '{}');
            } catch (err) {
              console.error('[api/chat] bad tool args JSON:', call.function.arguments, err);
            }
            const output = await executeTool(call.function.name, parsedArgs, toolCtx);
            toolCallLog.push({ name: call.function.name, input: parsedArgs, output });
            let parsedOutput: unknown = output;
            try {
              parsedOutput = JSON.parse(output);
            } catch {
              // Keep raw output when a tool intentionally returns plain text.
            }
            send('tool_result', {
              name: call.function.name,
              id: call.id,
              output: parsedOutput,
            });
            messages.push({
              role: 'tool',
              tool_call_id: call.id,
              content: output,
            });
          }
        }

        send('done', { text: finalAssistantText });

        if (sessionId && finalAssistantText) {
          supabase
            .from('chatbot_messages')
            .insert({
              session_id: sessionId,
              role: 'assistant',
              content: finalAssistantText,
              tool_calls: toolCallLog.length > 0 ? toolCallLog : null,
            })
            .then(({ error }) => {
              if (error) console.error('[api/chat] assistant msg insert failed:', error.message);
            });
        }
      } catch (err) {
        console.error('[api/chat] stream error:', err);
        send('error', {
          message: 'Sorry, I hit a snag. Please try again, or message us on WhatsApp.',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
