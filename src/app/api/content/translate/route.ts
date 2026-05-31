import type { NextRequest } from 'next/server';
import { translateBlogPostToSpanish } from '@/lib/content/translate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// DeepSeek translation tends to take 15-30s for a 2000-word article.
export const maxDuration = 60;

/**
 * Trigger a Spanish translation of a specific English blog post. Same auth
 * model as /api/content/generate: bearer secret (Vercel cron auto-attaches
 * CRON_SECRET) or ?secret= query.
 *
 * Usage:
 *   POST /api/content/translate?secret=...&postId=<uuid>
 *   POST /api/content/translate  (body: { postId: "..." })  with Authorization
 *
 * Idempotent — repeated calls with the same postId return the existing ES row.
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

  let postId = new URL(req.url).searchParams.get('postId') ?? '';
  if (!postId && req.method === 'POST') {
    try {
      const body = (await req.json()) as { postId?: string };
      postId = body?.postId ?? '';
    } catch {
      /* no body */
    }
  }

  if (!postId) {
    return Response.json({ error: 'postId required' }, { status: 400 });
  }

  const result = await translateBlogPostToSpanish(postId);
  return Response.json(result, { status: result.ok ? 200 : 422 });
}

export const GET = handle;
export const POST = handle;
