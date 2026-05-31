#!/usr/bin/env node
/**
 * One-shot Spanish translation backfill.
 *
 * For every PUBLISHED English blog post that doesn't yet have a Spanish row,
 * call the /api/content/translate endpoint to create a Spanish draft. Mark
 * then reviews & publishes via /admin/content.
 *
 *   node scripts/backfill-spanish-blog.mjs
 *   node scripts/backfill-spanish-blog.mjs --base=https://deyusolemachine.com
 *   node scripts/backfill-spanish-blog.mjs --base=http://localhost:3000 --limit=3
 *
 * Reads creds from .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * CRON_SECRET (or CONTENT_CRON_SECRET).
 *
 * Hits the live API rather than calling translate.ts directly because the TS
 * module depends on Next runtime aliases (@/lib/...). Cleaner to use the same
 * code path the admin button uses.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  const env = {};
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
  })
);

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const secret =
  env.CRON_SECRET ||
  env.CONTENT_CRON_SECRET ||
  process.env.CRON_SECRET ||
  process.env.CONTENT_CRON_SECRET;

if (!supabaseUrl || !serviceKey || !secret) {
  console.error('! Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or CRON_SECRET in .env.local');
  process.exit(1);
}

const base = (args.base || 'http://localhost:3000').replace(/\/$/, '');
const limit = args.limit ? Number(args.limit) : Infinity;

// 1) Query Supabase REST directly for the work list.
async function supabaseGet(table, query) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!res.ok) throw new Error(`supabase ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

const enPosts = await supabaseGet(
  'blog_posts',
  `select=id,slug,title,published_at&language=eq.en&status=eq.published&order=published_at.desc`
);
const esRows = await supabaseGet('blog_posts', `select=slug&language=eq.es`);
const slugsWithEs = new Set(esRows.map((r) => r.slug));

const pending = enPosts.filter((p) => !slugsWithEs.has(p.slug)).slice(0, limit);
console.log(
  `[backfill] ${enPosts.length} English published · ${esRows.length} Spanish already · ${pending.length} pending`
);

if (pending.length === 0) {
  console.log('[backfill] Nothing to do. 🎉');
  process.exit(0);
}

// 2) For each, call /api/content/translate.
let ok = 0;
let fail = 0;
for (const p of pending) {
  process.stdout.write(`  → ${p.slug.padEnd(40)} `);
  const t0 = Date.now();
  try {
    const res = await fetch(`${base}/api/content/translate?secret=${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: p.id }),
    });
    const json = await res.json();
    const ms = Date.now() - t0;
    if (json.ok) {
      console.log(`✓ ${json.cached ? 'cached' : 'translated'} (${ms}ms)`);
      ok++;
    } else {
      console.log(`✗ ${json.message ?? 'unknown'} (${ms}ms)`);
      fail++;
    }
  } catch (err) {
    console.log(`✗ ${err.message}`);
    fail++;
  }
}

console.log(`\n[backfill] Done: ${ok} ok / ${fail} failed.`);
console.log(`Review drafts at: ${base}/admin/content?key=${secret.slice(0, 4)}…`);
