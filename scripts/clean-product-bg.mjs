#!/usr/bin/env node
/**
 * 把产品样品照的背景洗成纯白:
 *   - 输入图(白布 + 阴影 + 部分地面)→ 任何低饱和度像素强制变 #FFFFFF
 *   - 高饱和度像素(鞋底彩色 / 哑铃黑色 / 杠铃片 / 等)原样保留
 *   - 可选 --rotate=90/-90/180 顺手转向
 *
 * 用法:
 *   node scripts/clean-product-bg.mjs <input.jpg> <output.jpg> [--rotate=-90] [--sat=0.18] [--lightness=0.45]
 *
 * 阈值默认值很保守,适合白布 + 鲜艳鞋底的场景。如果鞋底是浅色调
 * (米白、浅米黄)被误判,把 --sat 调低到 0.10 试试。
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), true];
  })
);

const posArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const [inputPath, outputPath] = posArgs;
if (!inputPath || !outputPath) {
  console.error('Usage: node clean-product-bg.mjs <input> <output> [--rotate=-90]');
  process.exit(1);
}

const rotateAngle = args.rotate ? Number(args.rotate) : 0;
const SAT_THRESHOLD = args.sat ? Number(args.sat) : 0.18;
const LIGHT_THRESHOLD = args.lightness ? Number(args.lightness) : 0.45;

// 把 RGB(0-255) 转 HSL 的轻量实现,够这个用例了
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    case b: h = (r - g) / d + 4; break;
  }
  h /= 6;
  return { h, s, l };
}

(async () => {
  let img = sharp(inputPath).rotate();  // 先依 EXIF orientation 自动转正
  if (rotateAngle !== 0) img = img.rotate(rotateAngle);

  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`[clean-bg] ${width}x${height} · channels=${channels} · sat<${SAT_THRESHOLD} OR light>${LIGHT_THRESHOLD} → white`);

  let replaced = 0;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const { s, l } = rgbToHsl(r, g, b);
    // 把"接近灰"或"很亮"的像素全部染成纯白 — 这覆盖白布、阴影、地面
    if (s < SAT_THRESHOLD || l > LIGHT_THRESHOLD) {
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
      replaced++;
    }
  }
  console.log(`[clean-bg] ${(replaced / (width * height) * 100).toFixed(1)}% pixels whitened`);

  await sharp(data, { raw: { width, height, channels } })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outputPath);

  console.log(`[clean-bg] → ${path.relative(process.cwd(), outputPath)}`);
})();
