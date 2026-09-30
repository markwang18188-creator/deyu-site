#!/usr/bin/env node
/**
 * Publish one existing blog draft through the protected production endpoint.
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
const secret = env.CONTENT_CRON_SECRET || env.CRON_SECRET || process.env.CONTENT_CRON_SECRET || process.env.CRON_SECRET;
const siteUrl = (process.argv[4] || 'https://deyusolemachine.com').replace(/\/$/, '');
if (!secret) {
  console.error('CONTENT_CRON_SECRET or CRON_SECRET is missing.');
  process.exit(1);
}

const response = await fetch(`${siteUrl}/api/content/publish`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ slug, language }),
});

if (!response.ok) {
  console.error(`Publish failed (${response.status}): ${await response.text()}`);
  process.exit(1);
}

const result = await response.json();
console.log(`Published: ${result.published.slug} (${result.published.language}) at ${result.published.published_at}`);
