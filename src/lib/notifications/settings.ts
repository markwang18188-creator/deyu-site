import { createAdminClient } from '@/lib/supabase/admin';

export const NOTIFICATION_KEYS = [
  'daily_world_news',
  'boc_usd_rate',
  'google_calendar_today',
  'service_renewal_reminders',
  'company_buyback',
  'insider_increase',
  'fund_self_purchase',
  'fund_low_monitor_024749',
  'major_state_funds',
  'domestic_monetary_policy',
  'fiscal_politburo_policy',
  'capital_market_rules',
  'domestic_macro_turning_points',
  'global_policy_geopolitical',
  'systemic_risk',
  'etf_bottom_radar',
  'system_failure_alerts',
] as const;

export type NotificationKey = (typeof NOTIFICATION_KEYS)[number];

export interface NotificationSettingsDocument {
  version: 1;
  settings: Record<NotificationKey, boolean>;
  updatedAt: string;
}

const BUCKET = 'deyu-system-config';
const OBJECT_PATH = 'notification-settings.json';

export function defaultNotificationSettings(): NotificationSettingsDocument {
  return {
    version: 1,
    settings: {
      daily_world_news: true,
      boc_usd_rate: true,
      google_calendar_today: true,
      service_renewal_reminders: true,
      company_buyback: true,
      insider_increase: true,
      fund_self_purchase: true,
      fund_low_monitor_024749: true,
      major_state_funds: true,
      domestic_monetary_policy: true,
      fiscal_politburo_policy: true,
      capital_market_rules: true,
      domestic_macro_turning_points: true,
      global_policy_geopolitical: true,
      systemic_risk: true,
      etf_bottom_radar: true,
      system_failure_alerts: true,
    },
    updatedAt: new Date().toISOString(),
  };
}

function normalizeDocument(value: unknown): NotificationSettingsDocument {
  const defaults = defaultNotificationSettings();
  if (!value || typeof value !== 'object') return defaults;
  const input = value as { settings?: Record<string, unknown>; updatedAt?: unknown };
  for (const key of NOTIFICATION_KEYS) {
    if (typeof input.settings?.[key] === 'boolean') {
      defaults.settings[key] = input.settings[key] as boolean;
    }
  }
  if (typeof input.updatedAt === 'string') defaults.updatedAt = input.updatedAt;
  return defaults;
}

async function ensureBucket() {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: 64 * 1024,
    allowedMimeTypes: ['application/json'],
  });
  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw new Error(`Unable to create settings storage: ${error.message}`);
  }
}

export async function readNotificationSettings(): Promise<NotificationSettingsDocument> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).download(OBJECT_PATH);
  if (!error && data) {
    return normalizeDocument(JSON.parse(await data.text()));
  }

  await ensureBucket();
  const defaults = defaultNotificationSettings();
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(
    OBJECT_PATH,
    JSON.stringify(defaults, null, 2),
    { contentType: 'application/json', upsert: true },
  );
  if (uploadError) {
    throw new Error(`Unable to initialize notification settings: ${uploadError.message}`);
  }
  return defaults;
}

export async function writeNotificationSettings(
  settings: Record<NotificationKey, boolean>,
): Promise<NotificationSettingsDocument> {
  await ensureBucket();
  const document: NotificationSettingsDocument = {
    version: 1,
    settings,
    updatedAt: new Date().toISOString(),
  };
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(
    OBJECT_PATH,
    JSON.stringify(document, null, 2),
    { contentType: 'application/json', upsert: true },
  );
  if (error) throw new Error(`Unable to save notification settings: ${error.message}`);
  return document;
}

export function validateSettings(value: unknown): Record<NotificationKey, boolean> | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Record<string, unknown>;
  const result = {} as Record<NotificationKey, boolean>;
  for (const key of NOTIFICATION_KEYS) {
    if (typeof input[key] !== 'boolean') return null;
    result[key] = input[key] as boolean;
  }
  return result;
}
