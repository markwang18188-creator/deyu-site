/**
 * DEYU 选型矩阵 — 给 AI 客服用的决策表
 *
 * 知识来源:
 *   - sales_playbook.xml: 9 步销售剧本(Gemini + Mark 共同设计)
 *   - products.ts: 19 个标准型号(目录配置, 可定制)
 *   - Mark 口授知识: 工位数规则、机头结构、TPU 重定位、南美偏好等
 *
 * 维护: 有新型号/新规则,在这里改 mapping + recommendModels() 逻辑
 *
 * ───── 核心认知(AI 系统 prompt 必须知道的)──────────────────
 * 1. 型号末 2 位 = 工位数 → 推断模具配置:
 *      02/04/06/08/12 → 一般"一模一双"
 *      16/20/24       → 一般"一模一只"
 *
 * 2. 机头结构 → 决定合模压力上限:
 *      鹅头(C 字型)   → ≤ 100 吨
 *      立柱式(3/4 柱) → > 100 吨 (TR/TPU 必须立柱)
 *
 * 3. 头数 / 颜色 / 工位 是 3 个独立维度:
 *      头数 → 决定叠层数 (每层一个头)
 *      颜色 → 每层最多几种颜色
 *      工位 → 决定产量
 *
 * 4. 双色机吨位 = 副头 + 主头 分别配置 (如 55T/55T、55T/80T、80T/80T)
 *
 * 5. ⚠ 3+ 色机器没有"一模一双"配置, 只有"一模一只"
 *
 * 6. 目录是标准配置, 非标的吨位/工位可以定制 (走 Mark 报价)
 *
 * 7. 区域偏好:
 *      南美 (委内瑞拉、哥伦比亚): 偏好一模一双
 *      南美整体: 用铝模(便宜快但只能做哑光)
 */

import type { Product } from '../products';

export type Material = 'PVC' | 'TPR' | 'TPU' | 'TR' | 'EVA' | 'rubber';
export type ColorCount = 1 | 2 | 3 | 4;
export type MoldConfig = '1-piece-per-mold' | '1-pair-per-mold' | 'flat-sheet';
export type ProductCategory =
  | 'sole-only'           // 纯鞋底
  | 'outsole'             // 大底(高强度需求,如足球鞋底)
  | 'one-piece-slipper'   // 一体成型拖鞋
  | 'complete-shoe'       // 完整鞋(含跟/带)
  | 'slipper-sandal'      // 拖鞋/凉鞋(吹气类)
  | 'industrial-part';    // 工业件(哑铃/座垫)

export interface SelectionCriteria {
  materials: Material[];
  colors: ColorCount;
  moldConfig?: MoldConfig;
  productCategory?: ProductCategory;
  /** 客户描述提示 — 用于触发特殊推荐(如 "football cleats" → DY-2212T) */
  hint?: string;
  /** 客户预算偏好 — 影响 fallback 选择 */
  budgetTier?: 'tight' | 'standard' | 'premium';
}

export interface SelectionResult {
  /** 推荐机型 slug (对应 products.ts), 按推荐度排序 */
  productSlugs: string[];
  /** 计算得出的吨位 (副头/主头若是双色) */
  tonnage: number | string;
  /** 推荐的模具高度 (mm) */
  moldHeight: number;
  /** 机头结构 */
  headStructure: 'gooseneck' | 'column';
  /** 销售备注 (AI 可以转述给客户) */
  notes: string[];
  /** 应该提示的可选升级 */
  upgrades: ('triangle-mold' | 'spacer-plates' | 'air-cooling' | 'water-cooling' | 'auto-open' | 'external-robot')[];
}

/**
 * 主选型函数 — AI 调用入口
 */
export function recommendModels(criteria: SelectionCriteria): SelectionResult {
  const { materials, colors, moldConfig, productCategory, hint = '', budgetTier = 'standard' } = criteria;
  const hintLower = hint.toLowerCase();

  const isTPUorTR = materials.some((m) => m === 'TR' || m === 'TPU');
  const isOutsole = productCategory === 'outsole' || /football|cleat|outsole|大底|足球/.test(hintLower);

  // ── 头部结构判断 (TR/TPU 100T+ 必须立柱式) ──
  const headStructure: SelectionResult['headStructure'] =
    isTPUorTR && (moldConfig === '1-pair-per-mold' || isOutsole) ? 'column' : 'gooseneck';

  // ── 吨位计算 ──
  let tonnage: number | string;
  if (colors === 2 && !isTPUorTR) {
    // 双色 PVC/TPR — 副头/主头分档
    tonnage = budgetTier === 'tight' ? '55T/55T' : budgetTier === 'premium' ? '80T/80T' : '55T/80T';
  } else if (isTPUorTR) {
    tonnage = isOutsole ? 150 : 100;
  } else {
    tonnage = moldConfig === '1-piece-per-mold' ? 55 : 80;
  }

  // ── 模高 ──
  let moldHeight = 180;
  if (productCategory === 'one-piece-slipper') moldHeight = 220;
  if (productCategory === 'complete-shoe') moldHeight = 350;

  // ── 推荐机型 ──
  const productSlugs: string[] = [];

  // 规则 1: 工业件
  if (productCategory === 'industrial-part') {
    productSlugs.push('industrial-parts-six-station-machine', 'industrial-parts-two-station-machine');
  }
  // 规则 2: 吹气类拖鞋/凉鞋
  else if (productCategory === 'slipper-sandal') {
    if (colors === 1) productSlugs.push('air-blowing-injection-machine');
    else if (colors === 2) productSlugs.push('dual-color-air-blowing-machine');
    else productSlugs.push('three-color-mixed-air-blowing-machine');
  }
  // 规则 3: 单色
  else if (colors === 1) {
    if (isTPUorTR) {
      // TR/TPU 单色
      if (budgetTier === 'tight' || /sample|prototype|small.batch|试水|入门/.test(hintLower)) {
        productSlugs.push('two-station-slide-sole-machine'); // DY-1102 (入门 TPU)
      }
      // TR/TPU 单色 = 150T 水冷转盘机 (含 DY-1106TR/TPU 与 DY-1112TR/TPU 配置)
      productSlugs.push('tr-tpu-150t-water-cooling-rotary-machine');
    } else {
      // PVC/TPR 单色
      const wantsAirBlow = /air.blow|吹气/.test(hintLower);
      const isFlatSole = productCategory === 'sole-only' && /flat|片底|薄底/.test(hintLower);

      if (moldConfig === '1-piece-per-mold') {
        if (wantsAirBlow) {
          productSlugs.push('air-blowing-injection-machine'); // DY-1124B (兼顾吹气)
        } else {
          productSlugs.push('pvc-single-color-rotary-machine'); // DY-1120A (20 工位 180 pair/h)
        }
      } else if (isFlatSole) {
        // 片底, 一模一双, 需要自动开模
        productSlugs.push('pvc-six-station-rotary-machine'); // DY-1106/1108/1112 (80-100T 系列)
      } else {
        // 一模一双普通鞋底
        productSlugs.push('pvc-six-station-rotary-machine'); // DY-1106/1108/1112 (80-100T 系列)
      }
    }
  }
  // 规则 4: 双色
  else if (colors === 2) {
    if (isTPUorTR) {
      // 双色 TR/TPU 转盘家族 (含 DY-2112 单头 110T · DY-2212 立柱 150T · DY-2216 16 工位 150T)
      productSlugs.push('tpu-dual-color-injection-machine');
      if (!isOutsole) {
        productSlugs.push('dual-color-rotary-sole-machine'); // DY-2220A (高产量备选)
      }
    } else {
      // PVC/TPR 双色
      if (moldConfig === '1-pair-per-mold') {
        productSlugs.push('tpu-dual-color-injection-machine'); // 双色家族 12 工位配置
      } else {
        productSlugs.push('dual-color-rotary-sole-machine'); // DY-2220A 20 工位高产
      }
    }
  }
  // 规则 5: 多色 (3+ 永远一模一只)
  else if (colors === 3) {
    const wantsFlexibility = /flexible|multi|variety|various|不同款|多种/.test(hintLower);
    if (wantsFlexibility) {
      productSlugs.push('three-color-three-head-flexible-machine'); // DY-3324A (3 头灵活之王)
    } else if (budgetTier === 'tight' || /small|compact|入门|小批量/.test(hintLower)) {
      productSlugs.push('three-color-three-head-flexible-machine'); // DY-3208 (合并到 3208/3324 系列产品)
    } else if (budgetTier === 'premium' || isTPUorTR) {
      productSlugs.push('three-color-12-20-station-machine'); // DY-3212B 立柱高规
    } else {
      productSlugs.push('multi-color-rotary-machine'); // DY-3220C 走量型(220 pair/h)
    }
  }
  else if (colors === 4) {
    productSlugs.push('four-color-rotary-sole-machine'); // DY-4212C
  }

  // ── 销售备注 ──
  const notes: string[] = [];
  notes.push(`Recommended clamping force: ${tonnage}T`);
  notes.push(`Recommended mold height: ${moldHeight}mm`);
  notes.push(`Machine head type: ${headStructure === 'column' ? 'column-type (>100T)' : 'gooseneck (≤100T)'}`);
  if (colors >= 3) notes.push('Note: 3+ color machines only support 1-piece-per-mold configuration.');
  if (isTPUorTR && isOutsole) notes.push('TPU outsoles require water-cooling + 150T (premium config).');

  // ── 升级建议 ──
  const upgrades: SelectionResult['upgrades'] = [];
  if (productCategory === 'complete-shoe') upgrades.push('triangle-mold');
  if (productCategory === 'sole-only' && moldHeight !== 180) upgrades.push('spacer-plates');
  upgrades.push('air-cooling', 'water-cooling');
  if (productCategory === 'sole-only' && moldConfig === 'flat-sheet') upgrades.push('auto-open');

  return { productSlugs, tonnage, moldHeight, headStructure, notes, upgrades };
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
  lines.push(`Technical specs: ~${result.tonnage}T clamping, ${result.moldHeight}mm mold height, ${result.headStructure} head.`);
  return lines.join('\n');
}
