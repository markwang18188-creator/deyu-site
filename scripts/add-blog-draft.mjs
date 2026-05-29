#!/usr/bin/env node
/**
 * Insert a blog post DRAFT into Supabase from a local JSON + MDX file.
 * Used for human-authored posts (e.g. troubleshooting cases) that bypass the
 * auto-generation pipeline. The draft is reviewed/published at /admin/content.
 *
 *   node scripts/add-blog-draft.mjs path/to/case.json
 *
 * case.json shape:
 * {
 *   "slug": "main-cylinder-pressure-loss",
 *   "title": "...",
 *   "description": "meta description ~150 chars",
 *   "language": "en",
 *   "keywords": ["Troubleshooting", "clamping cylinder pressure loss"],
 *   "product_refs": ["dual-color-rotary-sole-machine"],
 *   "featured_image_url": "/troubleshooting/main-cylinder-pressure-loss-1.jpg",
 *   "body_path": "drafts/main-cylinder-pressure-loss.mdx"
 * }
 *
 * Reads SUPABASE creds from .env.local (no Next runtime here).
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// --- minimal .env.local loader ---
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

const jsonArg = process.argv[2];
if (!jsonArg) {
  console.error('Usage: node scripts/add-blog-draft.mjs path/to/case.json');
  process.exit(1);
}

const metaPath = path.resolve(jsonArg);
const meta = JSON.parse(readFileSync(metaPath, 'utf8'));

for (const required of ['slug', 'title', 'body_path']) {
  if (!meta[required]) {
    console.error(`! missing required field: ${required}`);
    process.exit(1);
  }
}

const bodyPath = path.resolve(path.dirname(metaPath), meta.body_path);
if (!existsSync(bodyPath)) {
  console.error(`! body file not found: ${bodyPath}`);
  process.exit(1);
}
const body_mdx = readFileSync(bodyPath, 'utf8');

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('! NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env.local');
  process.exit(1);
}

const row = {
  slug: meta.slug,
  language: meta.language || 'en',
  title: meta.title,
  description: meta.description ?? null,
  body_mdx,
  featured_image_url: meta.featured_image_url ?? null,
  keywords: meta.keywords ?? [],
  product_refs: meta.product_refs ?? [],
  status: 'draft',
};

// Call PostgREST directly (avoids supabase-js needing WebSocket on Node < 22).
const res = await fetch(`${url}/rest/v1/blog_posts`, {
  method: 'POST',
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  },
  body: JSON.stringify(row),
});

if (!res.ok) {
  console.error(`! insert failed (${res.status}): ${await res.text()}`);
  process.exit(1);
}

const [created] = await res.json();
console.log(`✓ draft created: ${created.slug} (id ${created.id})`);
console.log('  Review at /admin/content?key=<CONTENT_CRON_SECRET>');
