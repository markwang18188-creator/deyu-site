/**
 * 选型矩阵 — 把销售剧本里的"吨位 + 材料 + 模配置"逻辑
 * 映射到 products.ts 里的具体 DEYU 型号。
 *
 * 这是给 AI 客服用的查找表。当客户走完销售剧本 Step 2-4
 * (材料 + 颜色 + 一模一只/一模一双 + 鞋类),
 * AI 调用 recommendModels() 拿到 1-3 个具体的 DEYU 型号 slug,
 * 再去 products.ts 拉规格 + 图片 + slug URL 回答客户。
 *
 * 来源:
 *   - 销售剧本: src/data/chatbot/sales_playbook.xml
 *   - 产品库: src/data/products.ts
 *   - 维护人: Mark + Claude (有新型号上市要在这里加一条)
 */

import type { Product } from '../products';

export type Material = 'PVC' | 'TPR' | 'TPU' | 'TR' | 'EVA' | 'rubber';
export type ColorCount = 1 | 2 | 3 | 4;
export type MoldConfig = '1-piece-per-mold' | '1-pair-per-mold' | 'flat-sheet';
export type ProductCategory =
  | 'sole-only'           // 纯鞋底
  | 'one-piece-slipper'   // 一体成型拖鞋
  | 'complete-shoe'       // 完整鞋(含跟/带)
  | 'slipper-sandal'      // 拖鞋/凉鞋(吹气类)
  | 'industrial-part';    // 工业件(哑铃/座垫)

export interface SelectionCriteria {
  materials: Material[];
  colors: ColorCount;
  moldConfig?: MoldConfig;
  productCategory?: ProductCategory;
}

export interface SelectionResult {
  /** 推荐机型 slug (对应 products.ts), 按推荐度排序 */
  productSlugs: string[];
  /** 计算得出的吨位 */
  tonnage: number;
  /** 推荐的模具高度 (mm) */
  moldHeight: number;
  /** 销售备注 (AI 可以转述给客户) */
  notes: string[];
  /** 应该提示的可选升级 (AI 不暴露具体价格,只说"可选升级") */
  upgrades: ('triangle-mold' | 'spacer-plates' | 'air-cooling' | 'water-cooling' | 'auto-open' | 'external-robot')[];
}

/**
 * 主选型函数 — AI 调用入口
 */
export function recommendModels(criteria: SelectionCriteria): SelectionResult {
  const { materials, colors, moldConfig, productCategory } = criteria;

  // ── 1. 计算吨位 (Materials_and_Tonnage 规则) ──────────────
  const needsHighClamping = materials.some((m) => m === 'TR' || m === 'TPU');
  let tonnage: number;
  if (needsHighClamping) {
    tonnage = moldConfig === '1-piece-per-mold' ? 100 : 150;
  } else {
    tonnage = moldConfig === '1-piece-per-mold' ? 55 : 80;
  }

  // ── 2. 计算模高 (Mold_Heights_and_Structures 规则) ────────
  let moldHeight = 180;
  if (productCategory === 'one-piece-slipper') moldHeight = 220;
  if (productCategory === 'complete-shoe') moldHeight = 350;

  // ── 3. 推荐机型 ────────────────────────────────────────
  const productSlugs: string[] = [];

  // 工业件 — 独立分类,优先匹配
  if (productCategory === 'industrial-part') {
    productSlugs.push('industrial-parts-six-station-machine', 'industrial-parts-two-station-machine');
  }
  // 吹气类 (拖鞋/凉鞋)
  else if (productCategory === 'slipper-sandal') {
    if (colors === 1) productSlugs.push('air-blowing-injection-machine');
    else if (colors === 2) productSlugs.push('dual-color-air-blowing-machine');
    else productSlugs.push('three-color-mixed-air-blowing-machine');
  }
  // 单色机
  else if (colors === 1) {
    if (needsHighClamping) {
      // TR/TPU 单色
      if (moldConfig === '1-pair-per-mold' || productCategory === 'complete-shoe') {
        productSlugs.push('tr-tpu-water-cooling-sole-machine', 'tpu-tr-vertical-injection-machine');
      } else {
        productSlugs.push('tpu-single-color-vertical-machine', 'tr-tpu-water-cooling-sole-machine');
      }
    } else {
      // PVC/TPR 单色
      if (moldConfig === '1-pair-per-mold') {
        productSlugs.push('pvc-single-color-rotary-machine'); // DY-1120A (20 工位高产)
      } else {
        productSlugs.push('pvc-six-station-rotary-machine', 'automatic-mold-opening-sole-machine', 'two-station-slide-sole-machine');
      }
    }
  }
  // 双色机
  else if (colors === 2) {
    if (needsHighClamping) {
      productSlugs.push('tpu-dual-color-injection-machine', 'tpu-tr-dual-color-12-station');
    } else {
      productSlugs.push('dual-color-rotary-sole-machine'); // DY-2220A
    }
  }
  // 三色及以上
  else {
    if (colors === 3) {
      productSlugs.push('multi-color-rotary-machine', 'three-color-12-20-station-machine');
    } else {
      productSlugs.push('four-color-rotary-sole-machine'); // DY-4212C
    }
  }

  // ── 4. 生成销售备注 ────────────────────────────────────
  const notes: string[] = [];
  notes.push(`Recommended clamping force: ${tonnage} tons`);
  notes.push(`Recommended mold height: ${moldHeight}mm`);
  if (needsHighClamping) {
    notes.push('TR/TPU requires higher clamping force — premium machines selected.');
  }

  // ── 5. 升级建议 (不带价格) ────────────────────────────
  const upgrades: SelectionResult['upgrades'] = [];
  if (productCategory === 'complete-shoe') upgrades.push('triangle-mold');
  if (productCategory === 'sole-only' && moldHeight !== 180) upgrades.push('spacer-plates');
  upgrades.push('air-cooling', 'water-cooling'); // 让 AI 询问客户偏好
  if (productCategory === 'sole-only' && moldConfig === 'flat-sheet') upgrades.push('auto-open');

  return { productSlugs, tonnage, moldHeight, notes, upgrades };
}

/**
 * 升级项的话术 (AI 解释给客户用 — 不含具体价格)
 */
export const upgradeDescriptions = {
  'triangle-mold':
    'Triangle Mold modification — for complete shoes / sandals with straps and heels. Prevents flash/burrs at mold edges.',
  'spacer-plates':
    'Spacer Plates — recommended if you plan to run both shoes (tall molds) and pure soles (short molds) on one machine. Reduces cycle time when switching.',
  'air-cooling':
    'Air Cooling — plug-and-play, compact, low setup cost. Note: blows heat into workshop (not ideal for hot climates).',
  'water-cooling':
    'Water Cooling Tower — more stable, no workshop heat emission, longer-lasting. Requires plumbing infrastructure to install.',
  'auto-open':
    'Built-in Auto-Open mechanism — perfect for flat soles. Simple and reliable mechanical sequence.',
  'external-robot':
    'External Full Robot system — for large factories with dedicated maintenance teams. Handles all mold types. Significant added complexity.',
} as const;

/**
 * 帮 AI 把推荐结果转成给客户看的消息 (英文,AI 会自己翻译到客户语言)
 */
export function formatRecommendationForCustomer(
  result: SelectionResult,
  products: Product[]
): string {
  const recommended = result.productSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const lines: string[] = [];
  lines.push(`Based on your requirements, here are the best-fit machines:`);
  lines.push('');
  recommended.forEach((p, i) => {
    lines.push(`${i + 1}. **${p.model}** — ${p.name}`);
    lines.push(`   ${p.shortDescription}`);
    lines.push(`   View: https://deyusolemachine.com/products/${p.slug}`);
    lines.push('');
  });
  lines.push(`Technical specs: ~${result.tonnage}T clamping, ${result.moldHeight}mm mold height.`);
  return lines.join('\n');
}
