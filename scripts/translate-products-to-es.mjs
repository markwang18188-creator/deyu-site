#!/usr/bin/env node
/**
 * One-shot: translate the marketing copy of every product in
 * `src/data/products.ts` to Spanish and merge into
 * `src/data/translations/products.es.json`.
 *
 *   node scripts/translate-products-to-es.mjs              # skip slugs already present
 *   node scripts/translate-products-to-es.mjs --force      # retranslate all
 *   node scripts/translate-products-to-es.mjs --slug=dy-1106  # one product only
 *   node scripts/translate-products-to-es.mjs --limit=3    # do 3 then stop
 *
 * Reads DEEPSEEK_API_KEY from .env.local. Writes JSON file directly.
 *
 * What gets translated:
 *   name, shortDescription, features[], applications[], spec label keys
 * What stays English:
 *   slug, model, category, specification VALUES (numbers/units), image paths
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
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
const apiKey = env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
const baseUrl = env.DEEPSEEK_BASE_URL || process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const model = env.DEEPSEEK_MODEL || process.env.DEEPSEEK_MODEL || 'deepseek-chat';
if (!apiKey) {
  console.error('! DEEPSEEK_API_KEY missing from .env.local');
  process.exit(1);
}

// ── Parse products.ts ────────────────────────────────────────────────────
// Rather than transpile TS, we extract the products array via dynamic import
// after writing a tiny shim that re-exports it. Simpler: parse the JS-ish
// literals from products.ts with a regex-pluck for each product object.
// Tradeoff: brittle if the file shape changes a lot. Acceptable for a script.

const productsTsPath = path.join(ROOT, 'src/data/products.ts');
const productsTsSrc = readFileSync(productsTsPath, 'utf8');

// Walk balanced braces starting after `export const products: Product[] = [`
const startIdx = productsTsSrc.indexOf('export const products: Product[] = [');
if (startIdx < 0) {
  console.error('! Could not locate `export const products: Product[] = [` in products.ts');
  process.exit(1);
}
// startIdx points at "export const products...". The array opens at the final
// `[` of "Product[] = [". indexOf('= [', startIdx) skips past the type's `[]`.
const arrayStart = productsTsSrc.indexOf('= [', startIdx) + 2;
let depth = 0;
let arrayEnd = -1;
for (let i = arrayStart; i < productsTsSrc.length; i++) {
  if (productsTsSrc[i] === '[') depth++;
  else if (productsTsSrc[i] === ']') {
    depth--;
    if (depth === 0) {
      arrayEnd = i;
      break;
    }
  }
}
if (arrayEnd < 0) {
  console.error('! Could not balance the products array');
  process.exit(1);
}

// Extract each top-level `{ ... }` block inside the array.
const arrayBody = productsTsSrc.slice(arrayStart + 1, arrayEnd);
const objects = [];
{
  let d = 0;
  let s = -1;
  for (let i = 0; i < arrayBody.length; i++) {
    const c = arrayBody[i];
    if (c === '{') {
      if (d === 0) s = i;
      d++;
    } else if (c === '}') {
      d--;
      if (d === 0 && s >= 0) {
        objects.push(arrayBody.slice(s, i + 1));
        s = -1;
      }
    }
  }
}

// Pull out the few fields we need via regex (model + slug we use for keying;
// the rest we pass to the model verbatim as a JSON-like string).
function pluckString(blob, key) {
  const m = blob.match(new RegExp(`${key}:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`));
  return m ? m[2] : '';
}
function pluckStringArray(blob, key) {
  const m = blob.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)].map((mm) => mm[2]);
}
function pluckSpecKeys(blob) {
  const m = blob.match(/specifications:\s*\{([\s\S]*?)\}/);
  if (!m) return [];
  return [...m[1].matchAll(/(['"`])((?:\\.|(?!\1).)*)\1\s*:/g)].map((mm) => mm[2]);
}

const products = objects
  .map((blob) => ({
    slug: pluckString(blob, 'slug'),
    modelSlug: pluckString(blob, 'modelSlug'),
    model: pluckString(blob, 'model'),
    category: pluckString(blob, 'category'),
    name: pluckString(blob, 'name'),
    shortDescription: pluckString(blob, 'shortDescription'),
    features: pluckStringArray(blob, 'features'),
    applications: pluckStringArray(blob, 'applications'),
    specLabels: pluckSpecKeys(blob),
  }))
  .filter((p) => p.slug);

console.log(`[products-translate] parsed ${products.length} products`);

// ── Load existing translations + decide work list ────────────────────────
const outPath = path.join(ROOT, 'src/data/translations/products.es.json');
const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : {};
const force = !!args.force;
const onlySlug = args.slug;
const limit = args.limit ? Number(args.limit) : Infinity;

const pending = products
  .filter((p) => (onlySlug ? p.slug === onlySlug : true))
  .filter((p) => force || !existing[p.slug])
  .slice(0, limit);

console.log(`[products-translate] ${pending.length} pending (${force ? 'force' : 'skip existing'})`);
if (pending.length === 0) process.exit(0);

// ── Per-product prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `You translate B2B industrial product marketing copy from English to neutral Latin-American Spanish.

RULES:
- Target audience: footwear factory owners and machinery buyers in Mexico, Colombia, Argentina, Chile, Brazil-LATAM region. Use neutral B2B "ustedes" register.
- Translate naturally — match meaning and rhythm, not word order.
- Use standard industry terminology: clamping force = fuerza de cierre; mould = molde; rotary disc = disco rotatorio; stations = estaciones; tonnage = tonelaje. Material codes (PVC, TPU, TPR, TR) stay English. Model numbers (DY-1106, DY-2216TR) stay English.
- For specification labels: translate the LABEL only (e.g. "Clamping Force" → "Fuerza de cierre"). The values stay English in the data layer — don't return them here.
- Preserve list lengths. If the source has 5 features, return 5 features. Don't merge or split.
- Don't invent claims. Translate what's given.

Return ONLY a JSON object with:
{
  "name": "translated product name",
  "shortDescription": "translated short description, same length-ish",
  "features": ["...", "..."],   // same number of items as source
  "applications": ["...", "..."], // same number of items as source
  "specLabels": { "OriginalEnglishLabel": "TranslatedSpanishLabel", ... }
}`;

async function translateProduct(p) {
  const userPrompt = `PRODUCT: ${p.model} (${p.category})

ENGLISH SOURCE:
name: ${p.name}
shortDescription: ${p.shortDescription}
features:
${p.features.map((f) => `  - ${f}`).join('\n')}
applications:
${p.applications.map((a) => `  - ${a}`).join('\n')}
specLabels:
${p.specLabels.map((s) => `  - ${s}`).join('\n')}

Translate to Spanish and return the JSON.`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const raw = json.choices?.[0]?.message?.content ?? '';
  return JSON.parse(raw);
}

let ok = 0;
let fail = 0;
for (const p of pending) {
  process.stdout.write(`  → ${p.slug.padEnd(40)} `);
  const t0 = Date.now();
  try {
    const out = await translateProduct(p);
    existing[p.slug] = out;
    writeFileSync(outPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
    console.log(`✓ (${Date.now() - t0}ms)`);
    ok++;
  } catch (err) {
    console.log(`✗ ${err.message}`);
    fail++;
  }
}

console.log(`\n[products-translate] Done: ${ok} ok / ${fail} failed.`);
console.log(`Wrote: ${path.relative(ROOT, outPath)}`);
