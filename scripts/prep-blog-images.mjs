#!/usr/bin/env node
/**
 * Prepare blog/troubleshooting photos for the web.
 *
 *   node scripts/prep-blog-images.mjs --slug <case-slug> <img1> <img2> ...
 *
 * For each input image:
 *   - HEIC/HEIF → converted to JPG via macOS `sips` (sharp can't read HEIC)
 *   - then sharp.rotate() bakes EXIF orientation into pixels + strips EXIF
 *     (avoids the "sideways photo" bug), resizes to max 1600px wide, q=82
 *   - written to public/troubleshooting/<slug>-N.jpg
 *
 * Prints ready-to-paste Markdown image tags for the MDX body.
 *
 * Requires: sharp (already a dependency), and `sips` (macOS, for HEIC).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'troubleshooting');

function parseArgs(argv) {
  const args = argv.slice(2);
  let slug = null;
  const images = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug') {
      slug = args[++i];
    } else {
      images.push(args[i]);
    }
  }
  return { slug, images };
}

const { slug, images } = parseArgs(process.argv);

if (!slug || images.length === 0) {
  console.error('Usage: node scripts/prep-blog-images.mjs --slug <case-slug> <img1> <img2> ...');
  process.exit(1);
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const mdLines = [];

for (let i = 0; i < images.length; i++) {
  const input = path.resolve(images[i]);
  if (!existsSync(input)) {
    console.error(`! skip (not found): ${input}`);
    continue;
  }

  const n = i + 1;
  const outName = `${slug}-${n}.jpg`;
  const outPath = path.join(OUT_DIR, outName);
  const ext = path.extname(input).toLowerCase();

  let source = input;
  let tmp = null;

  // HEIC/HEIF must be decoded by sips first (sharp lacks libheif here).
  if (ext === '.heic' || ext === '.heif') {
    tmp = path.join(os.tmpdir(), `prep_${Date.now()}_${n}.jpg`);
    try {
      execFileSync('sips', ['-s', 'format', 'jpeg', input, '--out', tmp], {
        stdio: 'ignore',
      });
      source = tmp;
    } catch (e) {
      console.error(`! sips failed for ${input}: ${e.message}`);
      continue;
    }
  }

  try {
    await sharp(source)
      .rotate() // auto-orient from EXIF, bake into pixels
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toFile(outPath);
    mdLines.push(`![${slug} photo ${n}](/troubleshooting/${outName})`);
    console.error(`✓ ${outName}`);
  } catch (e) {
    console.error(`! sharp failed for ${input}: ${e.message}`);
  } finally {
    if (tmp && existsSync(tmp)) rmSync(tmp, { force: true });
  }
}

console.error('\n--- paste into MDX body ---\n');
console.log(mdLines.join('\n'));
