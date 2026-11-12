'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { notifyFeishu } from '@/lib/chatbot/feishu';
import { notifyEmail } from '@/lib/chatbot/email-notify';

const LeadSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  machine_interest: z.string().optional(),
  message: z.string().min(5),
  source: z.string().optional(),
  source_page: z.string().optional(),
  language: z.string().optional(),
});

export type LeadFormData = z.infer<typeof LeadSchema>;

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function submitLead(
  data: LeadFormData
): Promise<{ success: boolean; error?: string }> {
  const parsed = LeadSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'invalid_data' };
  }

  const headersList = await headers();
  const countryIso = headersList.get('cf-ipcountry') ?? undefined;

  const supabase = serviceClient();
  const { data: inserted, error } = await supabase
    .from('leads')
    .insert({
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      machine_interest: parsed.data.machine_interest,
      message: parsed.data.message,
      source: parsed.data.source ?? 'website-contact',
      source_page: parsed.data.source_page,
      language: parsed.data.language,
      country_iso: countryIso,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[submit-lead]', error.message);
    return { success: false, error: 'server_error' };
  }

  const machineInterest = parsed.data.machine_interest?.trim() || 'Not specified';
  const notificationPayload = {
    customer_name: parsed.data.name,
    customer_email: parsed.data.email,
    customer_phone: parsed.data.phone || '',
    company: parsed.data.company,
    country: parsed.data.country || countryIso || 'Unknown',
    materials: [machineInterest],
    colors: 1,
    product_category: machineInterest,
    recommended_models: parsed.data.machine_interest ? [parsed.data.machine_interest] : ['Not specified'],
    full_summary: parsed.data.message,
    language: parsed.data.language,
    source_page: parsed.data.source_page,
    id: inserted?.id,
  };

  // Every website enquiry must alert sales immediately. Keep email as a
  // fallback so a Feishu outage never leaves a saved lead unnoticed.
  const notificationResults = await Promise.all([
    notifyFeishu(notificationPayload),
    notifyEmail(notificationPayload),
  ]);

  if (!notificationResults.some((result) => result.ok)) {
    console.error('[submit-lead] lead saved but all notifications failed/skipped', {
      leadId: inserted?.id,
      notificationResults,
    });
  }

  return { success: true };
}
