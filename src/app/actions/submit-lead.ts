'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

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

export async function submitLead(
  data: LeadFormData
): Promise<{ success: boolean; error?: string }> {
  const parsed = LeadSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'invalid_data' };
  }

  const headersList = await headers();
  const countryIso = headersList.get('cf-ipcountry') ?? undefined;

  const supabase = createClient();
  const { error } = await supabase.from('leads').insert({
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
  });

  if (error) {
    console.error('[submit-lead]', error.message);
    return { success: false, error: 'server_error' };
  }

  return { success: true };
}
