'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { trackLeadSubmit } from '@/lib/analytics';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  toolNames?: string[];
}

const SESSION_KEY = 'deyu_chat_session_id';
const HISTORY_KEY = 'deyu_chat_history';
const HISTORY_LIMIT = 20;

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionIdRef.current = localStorage.getItem(SESSION_KEY);
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Persist history
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const trimmed = messages.slice(-HISTORY_LIMIT);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  }, [messages]);

  const send = useCallback(
    async (text: string, referrerPage?: string) => {
      if (!text.trim() || streaming) return;
      setError(null);

      const userMsg: ChatMessage = { role: 'user', content: text };
      const baseHistory = messages;
      setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '' }]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            message: text,
            history: baseHistory.slice(-HISTORY_LIMIT).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            referrerPage,
          }),
        });

        if (!res.ok || !res.body) {
          let msg = 'Sorry, the AI advisor is offline. Try WhatsApp instead.';
          try {
            const body = await res.json();
            if (body?.message) msg = body.message;
          } catch {
            /* ignore */
          }
          setError(msg);
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: 'assistant', content: msg };
            return next;
          });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        const toolNames: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx;
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const chunk = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            const event = parseSseChunk(chunk);
            if (!event) continue;

            if (event.event === 'session' && event.data?.sessionId) {
              sessionIdRef.current = event.data.sessionId;
              localStorage.setItem(SESSION_KEY, event.data.sessionId);
            } else if (event.event === 'delta' && event.data?.text) {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                next[next.length - 1] = {
                  ...last,
                  content: last.content + event.data.text,
                };
                return next;
              });
            } else if (event.event === 'tool_use' && event.data?.name) {
              toolNames.push(event.data.name);
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { ...next[next.length - 1], toolNames: [...toolNames] };
                return next;
              });
              // Conversion event — when the bot calls `capture_lead` the lead
              // was saved server-side (the SSE stream only carries name+id,
              // not the call arguments, but the bot only invokes this tool
              // after all required fields are collected so it's a reliable
              // proxy for "lead created").
              if (event.data.name === 'capture_lead') {
                trackLeadSubmit({ source: 'website_chatbot' });
              }
            } else if (event.event === 'error') {
              const msg = event.data?.message || 'Something went wrong.';
              setError(msg);
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (!last.content) next[next.length - 1] = { role: 'assistant', content: msg };
                return next;
              });
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('[useChatStream]', err);
        setError('Connection lost. Please try again.');
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    sessionIdRef.current = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  return { messages, streaming, error, send, reset };
}

function parseSseChunk(chunk: string): { event: string; data: { [key: string]: any } } | null {
  const lines = chunk.split('\n');
  let event = 'message';
  let dataStr = '';
  for (const line of lines) {
    if (line.startsWith('event: ')) event = line.slice(7).trim();
    else if (line.startsWith('data: ')) dataStr += line.slice(6);
  }
  if (!dataStr) return null;
  try {
    return { event, data: JSON.parse(dataStr) };
  } catch {
    return null;
  }
}
