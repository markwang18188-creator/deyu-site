import type { NextRequest } from 'next/server';
import { generateOneArticle } from '@/lib/content/generate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Article generation can take 30-60s. Requires a plan that allows >10s functions.
export const maxDuration = 60;

/**
 * Secret-protected. Triggered by Vercel Cron (see vercel.json) and manual curl.
 * Vercel auto-sends `Authorization: Bearer ${CRON_SECRET}` for cron jobs, so we
 * accept CRON_SECRET (Vercel-native) or CONTENT_CRON_SECRET, via header or ?secret=.
 * Fails closed: no secret configured => 401.
 */
function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET || process.env.CONTENT_CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get('authorization') === `Bearer ${secret}`) return true;
  return new URL(req.url).searchParams.get('secret') === secret;
}

async function handle(req: NextRequest): Promise<Response> {
  if (!authorized(req)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  const result = await generateOneArticle();
  return Response.json(result, { status: result.ok ? 200 : 422 });
}

export const GET = handle;
export const POST = handle;
