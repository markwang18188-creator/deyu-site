'use server';

import { z } from 'zod';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { notifyFeishu } from '@/lib/chatbot/feishu';
import { notifyEmail } from '@/lib/chatbot/email-notify';

const ChatbotLeadSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().min(5),
  company: z.string().optional(),
  country: z.string().min(2),
  materials: z.array(z.string()).min(1),
  colors: z.number().int().min(1).max(4),
  mold_config: z.string().optional(),
  product_category: z.string().min(1),
  tonnage_recommendation: z.string().optional(),
  recommended_models: z.array(z.string()).min(1),
  upgrades_discussed: z.array(z.string()).optional(),
  cooling_preference: z.string().optional(),
  port: z.string().optional(),
  payment_preference: z.string().optional(),
  full_summary: z.string().min(10),
  session_id: z.string().uuid().optional(),
  language: z.string().optional(),
  source_page: z.string().optional(),
});

export type ChatbotLeadData = z.infer<typeof ChatbotLeadSchema>;

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function submitChatbotLead(
  data: ChatbotLeadData
): Promise<{
  success: boolean;
  error?: string;
  id?: string;
  notification?: {
    ok: boolean;
    channels: Array<{ channel: string; ok: boolean; skipped?: boolean; error?: string }>;
  };
}> {
  const parsed = ChatbotLeadSchema.safeParse(data);
  if (!parsed.success) {
    console.error('[submit-chatbot-lead] validation failed:', parsed.error.flatten());
    return { success: false, error: 'invalid_data' };
  }

  const d = parsed.data;
  const supabase = serviceClient();

  const { data: inserted, error } = await supabase
    .from('leads')
    .insert({
      name: d.customer_name,
      email: d.customer_email,
      phone: d.customer_phone,
      company: d.company,
      country: d.country,
      message: d.full_summary,
      source: 'website_chatbot',
      source_page: d.source_page,
      language: d.language,
      session_id: d.session_id,
      materials: d.materials,
      colors: d.colors,
      mold_config: d.mold_config,
      product_category: d.product_category,
      tonnage_recommendation: d.tonnage_recommendation,
      recommended_models: d.recommended_models,
      upgrades_discussed: d.upgrades_discussed,
      cooling_preference: d.cooling_preference,
      port: d.port,
      payment_preference: d.payment_preference,
      full_summary: d.full_summary,
      machine_interest: (d.recommended_models || []).join(', '),
    })
    .select('id')
    .single();

  if (error) {
    console.error('[submit-chatbot-lead] supabase error:', error.message);
    return { success: false, error: 'server_error' };
  }

  if (d.session_id) {
    await supabase
      .from('chatbot_sessions')
      .update({ lead_captured: true, last_activity_at: new Date().toISOString() })
      .eq('id', d.session_id);
  }

  // 双通道通知:飞书机器人(主) + 邮件备份(兜底)。这里要等待结果,
  // 否则客户侧显示成功,但销售团队可能完全没收到提醒。
  const notificationResults = await Promise.all([
    notifyFeishu({ ...d, id: inserted?.id }),
    notifyEmail({ ...d, id: inserted?.id }),
  ]);
  const notificationOk = notificationResults.some((r) => r.ok);

  if (!notificationOk) {
    console.error('[submit-chatbot-lead] lead saved but all notifications failed/skipped', {
      leadId: inserted?.id,
      notificationResults,
    });
  }

  return {
    success: true,
    id: inserted?.id,
    notification: {
      ok: notificationOk,
      channels: notificationResults,
    },
  };
}
