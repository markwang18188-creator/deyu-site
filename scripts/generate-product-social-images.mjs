#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import os from 'node:os';
import sharp from 'sharp';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'og', 'products');
const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(value, maxLength = 29, maxLines = 4) {
  const words = value.replaceAll('—', ' — ').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;

  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = `${visible[maxLines - 1].replace(/[.,;:—-]+$/, '')}...`;
  return visible;
}

async function loadProducts() {
  const sourcePath = path.join(ROOT, 'src', 'data', 'products.ts');
  const source = await readFile(sourcePath, 'utf8');
  // The generator only needs the canonical catalogue. Exclude the later
  // localisation imports so this standalone script has no JSON-module setup.
  const canonicalSource = source.split('export const productsByCategory')[0];
  const transpiled = ts.transpileModule(canonicalSource, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const tempPath = path.join(os.tmpdir(), `deyu-products-${Date.now()}.mjs`);
  await writeFile(tempPath, transpiled);
  const catalogue = await import(`${pathToFileURL(tempPath).href}?v=${Date.now()}`);
  return catalogue.products;
}

async function makeLogoAssets() {
  const source = path.join(ROOT, 'branding', 'youtube-avatar-final.png');
  const trimmed = await sharp(source)
    .trim({ background: '#ffffff', threshold: 8 })
    .png()
    .toBuffer();

  await sharp(trimmed)
    .extend({ top: 24, bottom: 24, left: 28, right: 28, background: '#ffffff' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ROOT, 'public', 'deyu-logo-v2.png'));

  return trimmed;
}

async function renderCard({ model, name, mainImage }, destination, logo) {
  const machinePath = path.join(ROOT, 'public', mainImage.replace(/^\//, ''));
  const machine = await sharp(machinePath)
    .resize(620, 500, { fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer();
  const fittedLogo = await sharp(logo)
    .resize(340, 150, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();
  const modelLines = wrapText(model, 22, 2);
  const modelText = modelLines
    .map((line, index) => `<text x="760" y="${242 + index * 34}" class="model">${escapeXml(line)}</text>`)
    .join('');
  const titleLines = wrapText(name, 29, 5);
  const title = titleLines
    .map((line, index) => `<text x="760" y="${342 + index * 35}" class="title">${escapeXml(line)}</text>`)
    .join('');

  const background = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f4f7fb"/>
      <rect width="1200" height="12" fill="#1e3a8a"/>
      <rect x="34" y="48" width="670" height="534" rx="8" fill="#ffffff" stroke="#dbe3ee" stroke-width="2"/>
      <rect x="733" y="48" width="433" height="534" rx="8" fill="#ffffff" stroke="#dbe3ee" stroke-width="2"/>
      <rect x="760" y="298" width="72" height="6" fill="#ea580c"/>
      <style>
        .model { font: 700 28px Arial, sans-serif; fill: #1e3a8a; }
        .title { font: 700 27px Arial, sans-serif; fill: #0f172a; }
        .label { font: 700 15px Arial, sans-serif; fill: #64748b; }
        .url { font: 700 20px Arial, sans-serif; fill: #ea580c; }
      </style>
      ${modelText}
      ${title}
      <text x="760" y="538" class="label">WENZHOU DEYU MACHINERY CO., LTD.</text>
      <text x="760" y="566" class="url">deyusolemachine.com</text>
    </svg>`);

  await sharp(background)
    .composite([
      { input: machine, left: 59, top: 64 },
      { input: fittedLogo, left: 777, top: 72 },
    ])
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(destination);
}

await mkdir(OUTPUT_DIR, { recursive: true });
const products = await loadProducts();
const logo = await makeLogoAssets();

for (const product of products) {
  await renderCard(
    product,
    path.join(OUTPUT_DIR, `${product.slug}-v2.jpg`),
    logo
  );
}

await renderCard(
  {
    model: 'DEYU MACHINERY',
    name: 'Shoe Sole Injection Moulding Machines',
    mainImage: '/products/dy-1120.jpg',
  },
  path.join(ROOT, 'public', 'og-image-v2.jpg'),
  logo
);

console.log(`Generated ${products.length} product cards and the default social image.`);
