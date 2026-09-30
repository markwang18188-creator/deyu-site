#!/usr/bin/env node
/**
 * Publish one existing blog draft by exact slug and language.
 *
 *   node scripts/publish-blog-draft.mjs pp-midsole-vs-cardboard-insole-board en
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  const env = {};
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const slug = process.argv[2];
const language = process.argv[3] || 'en';
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: node scripts/publish-blog-draft.mjs <slug> [language]');
  process.exit(1);
}
if (!/^[a-z]{2}$/.test(language)) {
  console.error('Language must be a two-letter code.');
  process.exit(1);
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};
const now = new Date().toISOString();
const query = new URLSearchParams({
  slug: `eq.${slug}`,
  language: `eq.${language}`,
  status: 'eq.draft',
});

const publishResponse = await fetch(`${url}/rest/v1/blog_posts?${query}`, {
  method: 'PATCH',
  headers: { ...headers, Prefer: 'return=representation' },
  body: JSON.stringify({
    status: 'published',
    published_at: now,
    updated_at: now,
  }),
});

if (!publishResponse.ok) {
  console.error(`Publish failed (${publishResponse.status}): ${await publishResponse.text()}`);
  process.exit(1);
}

const published = await publishResponse.json();
if (published.length !== 1) {
  console.error(`Expected one matching draft, found ${published.length}. Nothing was published.`);
  process.exit(1);
}

const topicQuery = new URLSearchParams({ blog_post_id: `eq.${published[0].id}` });
const topicResponse = await fetch(`${url}/rest/v1/content_topics?${topicQuery}`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({ status: 'published', updated_at: now }),
});
if (!topicResponse.ok) {
  console.warn(`Article published, but topic status update failed (${topicResponse.status}).`);
}

console.log(`Published: ${slug} (${language}) at ${now}`);
