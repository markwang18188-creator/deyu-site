import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import {
  readSharedKnowledge,
  validateSharedKnowledge,
  writeSharedKnowledge,
} from '@/lib/chatbot/shared-knowledge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const responseHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
};

function sameSecret(left: string, right: string | undefined): boolean {
  if (!right) return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function authorized(req: NextRequest): boolean {
  const value = req.headers.get('authorization') ?? '';
  const token = value.startsWith('Bearer ') ? value.slice(7) : '';
  return sameSecret(token, process.env.KNOWLEDGE_SYNC_TOKEN);
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorized(req)) {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: responseHeaders });
  }
  try {
    const document = await readSharedKnowledge();
    return Response.json(document, { headers: responseHeaders });
  } catch (error) {
    console.error('[knowledge-sync] read failed', error);
    return Response.json({ error: 'knowledge_unavailable' }, { status: 503, headers: responseHeaders });
  }
}

export async function PUT(req: NextRequest): Promise<Response> {
  if (!authorized(req)) {
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: responseHeaders });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400, headers: responseHeaders });
  }
  const document = validateSharedKnowledge(body);
  if (!document) {
    return Response.json({ error: 'invalid_knowledge' }, { status: 400, headers: responseHeaders });
  }
  try {
    const saved = await writeSharedKnowledge(document);
    return Response.json({ ok: true, revision: saved.revision, updatedAt: saved.updatedAt, count: saved.entries.length }, { headers: responseHeaders });
  } catch (error) {
    console.error('[knowledge-sync] write failed', error);
    return Response.json({ error: 'save_failed' }, { status: 503, headers: responseHeaders });
  }
}
