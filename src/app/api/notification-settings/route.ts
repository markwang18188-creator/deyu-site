import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import {
  readNotificationSettings,
  validateSettings,
  writeNotificationSettings,
} from '@/lib/notifications/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sameSecret(left: string, right: string | undefined): boolean {
  if (!right) return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function bearerToken(req: NextRequest): string {
  const value = req.headers.get('authorization') ?? '';
  return value.startsWith('Bearer ') ? value.slice(7) : '';
}

function authorization(req: NextRequest): 'admin' | 'monitor' | null {
  const token = bearerToken(req);
  if (sameSecret(token, process.env.NOTIFICATION_SETTINGS_PASSWORD)) return 'admin';
  if (sameSecret(token, process.env.NOTIFICATION_MONITOR_TOKEN)) return 'monitor';
  return null;
}

const responseHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
};

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorization(req)) {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: responseHeaders });
  }
  try {
    return Response.json(await readNotificationSettings(), { headers: responseHeaders });
  } catch (error) {
    console.error('[notification-settings] read failed', error);
    return Response.json({ error: 'settings_unavailable' }, { status: 503, headers: responseHeaders });
  }
}

export async function PUT(req: NextRequest): Promise<Response> {
  if (authorization(req) !== 'admin') {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: responseHeaders });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400, headers: responseHeaders });
  }
  const settings = validateSettings((body as { settings?: unknown })?.settings);
  if (!settings) {
    return Response.json({ error: 'invalid_settings' }, { status: 400, headers: responseHeaders });
  }
  try {
    return Response.json(await writeNotificationSettings(settings), { headers: responseHeaders });
  } catch (error) {
    console.error('[notification-settings] write failed', error);
    return Response.json({ error: 'save_failed' }, { status: 503, headers: responseHeaders });
  }
}
