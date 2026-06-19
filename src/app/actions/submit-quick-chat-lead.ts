'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { notifyFeishu } from '@/lib/chatbot/feishu';
import { notifyEmail } from '@/lib/chatbot/email-notify';

const QuickChatLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  country: z.string().optional(),
  message: z.string().optional(),
  source_page: z.string().optional(),
  language: z.string().optional(),
});

export type QuickChatLeadData = z.infer<typeof QuickChatLeadSchema>;

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function submitQuickChatLead(
  data: QuickChatLeadData
): Promise<{ success: boolean; error?: string }> {
  const parsed = QuickChatLeadSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'invalid_data' };
  }

  const d = parsed.data;
  const headersList = await headers();
  const countryIso = headersList.get('cf-ipcountry') ?? undefined;
  const summary = [
    'Quick callback request from AI chat.',
    d.message ? `Customer note: ${d.message}` : 'Customer skipped the full machine questionnaire.',
  ].join('\n');

  const supabase = serviceClient();
  const { data: inserted, error } = await supabase
    .from('leads')
    .insert({
      name: d.name,
      email: d.email,
      phone: d.phone,
      country: d.country,
      message: summary,
      source: 'website_chat_quick_contact',
      source_page: d.source_page,
      language: d.language,
      country_iso: countryIso,
      machine_interest: 'quick-callback',
      full_summary: summary,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[submit-quick-chat-lead]', error.message);
    return { success: false, error: 'server_error' };
  }

  const notificationPayload = {
    customer_name: d.name,
    customer_email: d.email,
    customer_phone: d.phone,
    country: d.country || 'Unknown',
    materials: ['Not collected'],
    colors: 1,
    product_category: 'quick-callback',
    recommended_models: ['Not collected'],
    full_summary: summary,
    language: d.language,
    source_page: d.source_page,
    id: inserted?.id,
  };

  const results = await Promise.all([
    notifyFeishu(notificationPayload),
    notifyEmail(notificationPayload),
  ]);

  if (!results.some((r) => r.ok)) {
    console.error('[submit-quick-chat-lead] lead saved but notification failed', {
      leadId: inserted?.id,
      results,
    });
  }

  return { success: true };
}
