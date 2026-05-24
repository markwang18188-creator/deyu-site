/**
 * 图片素材清单 (manifest)
 * ============================================================
 * 这是网站上所有非产品图(展会/客户/车间/发货)的唯一真实来源。
 *
 * 想增加 / 删除 / 替换 / 修改某张图? 来这里改:
 *   - 加图: 把图传到 Supabase 后,在下面 push 一条新 entry
 *   - 删图: 删掉对应 entry,或把 `published: false` 隐藏不删
 *   - 改图: 同 id 上传新文件覆盖,或改 filename 指向新文件
 *   - 改文案: 直接改 caption / location 字段
 *
 * 每条 entry 的 `id` 永久不变,方便对话中精确指代 — 比如
 *   "把 tradeshow-04 那张换成新的","customer-pink-shirt 这张去掉"
 *
 * 分类:
 *   - tradeshow      展会/展台
 *   - customer       客户现场/客户操作
 *   - workshop       自家车间/生产线 (与 About 页 Our Factory 区分:
 *                    About 用专门的厂房3图; 这里是补充/细节)
 *   - shipment       发货/集装箱
 *   - product        产品成品/样品
 */

// Local public/exhibitions/ — instant load + Vercel edge delivery.
// Backup originals in Supabase Storage (product-images/exhibitions).
const BUCKET = '/exhibitions';

export type GalleryCategory =
  | 'tradeshow'
  | 'customer'
  | 'workshop'
  | 'shipment'
  | 'product';

export interface GalleryImage {
  id: string;          // 永久稳定的对话指代名
  filename: string;    // Supabase 上的文件名(在 exhibitions/ 目录下)
  category: GalleryCategory;
  caption: string;     // 网站上显示的简短说明(英文,显示在 hover/lightbox)
  location?: string;   // 可选: 展会名/城市/国家
  year?: number;       // 可选: 拍摄年份
  published?: boolean; // 默认 true; 设为 false 临时隐藏
}

export const gallery: GalleryImage[] = [
  // ── Trade Shows / 展会展台 ────────────────────────────────
  {
    id: 'tradeshow-deyu-2220a-booth',
    filename: 'exhibition-01.jpg',
    category: 'tradeshow',
    caption: 'DEYU Booth featuring DY-2220A',
  },
  {
    id: 'tradeshow-deyu-shoes-machine',
    filename: 'exhibition-06.jpg',
    category: 'tradeshow',
    caption: 'DEYU Trade Show Booth',
  },
  {
    id: 'tradeshow-wide-booth',
    filename: 'exhibition-11.jpg',
    category: 'tradeshow',
    caption: 'Wenzhou DEYU Exhibition Stand',
  },
  {
    id: 'tradeshow-orange-booth',
    filename: 'exhibition-12.jpg',
    category: 'tradeshow',
    caption: 'Live Machine Demonstration at Trade Show',
  },
  {
    id: 'tradeshow-banner-booth',
    filename: 'exhibition-13.jpg',
    category: 'tradeshow',
    caption: 'Trade Show Booth with Reception Area',
  },
  {
    id: 'tradeshow-3d-display',
    filename: 'exhibition-14.jpg',
    category: 'tradeshow',
    caption: 'Booth with 3D Machine Visualization Display',
  },

  // ── Customer / 客户现场 ───────────────────────────────────
  {
    id: 'customer-pink-shirt-mold',
    filename: 'exhibition-07.jpg',
    category: 'customer',
    caption: 'Customer Operating Sole Mold',
  },
  {
    id: 'customer-on-site-operation',
    filename: 'exhibition-17.jpg',
    category: 'customer',
    caption: 'On-Site Machine Operation',
  },

  // ── Workshop / 车间细节 ───────────────────────────────────
  {
    id: 'workshop-line-overview',
    filename: 'exhibition-02.jpg',
    category: 'workshop',
    caption: 'Production Line — Rotary Disc Machines',
  },
  {
    id: 'workshop-operator-station',
    filename: 'exhibition-03.jpg',
    category: 'workshop',
    caption: 'Operator at Rotary Sole Machine',
  },
  {
    id: 'workshop-operator-station-2',
    filename: 'exhibition-04.jpg',
    category: 'workshop',
    caption: 'Workshop — Single Color Rotary Line',
  },
  {
    id: 'workshop-rotary-topdown',
    filename: 'exhibition-08.jpg',
    category: 'workshop',
    caption: 'Rotary Disc — Top View',
  },
  {
    id: 'workshop-hopper-area',
    filename: 'exhibition-09.jpg',
    category: 'workshop',
    caption: 'Material Hopper & Injection Unit',
  },
  {
    id: 'workshop-floor-wide',
    filename: 'exhibition-10.jpg',
    category: 'workshop',
    caption: 'Production Floor Overview',
  },
  {
    id: 'workshop-multi-machines',
    filename: 'exhibition-15.jpg',
    category: 'workshop',
    caption: 'Multiple Production Units in Operation',
  },
  {
    id: 'workshop-hopper-detail',
    filename: 'exhibition-16.jpg',
    category: 'workshop',
    caption: 'Hopper & Feed System Close-Up',
  },
  {
    id: 'workshop-green-floor',
    filename: 'exhibition-19.jpg',
    category: 'workshop',
    caption: 'Newly Installed Production Line',
  },

  // ── Product / 成品样品 ────────────────────────────────────
  {
    id: 'product-soccer-cleat-soles',
    filename: 'exhibition-05.jpg',
    category: 'product',
    caption: 'Soccer Cleat Soles — Produced on DEYU Machines',
  },

  // ── Shipment / 发货 ──────────────────────────────────────
  {
    id: 'shipment-container-load',
    filename: 'exhibition-18.jpg',
    category: 'shipment',
    caption: 'Machine Loaded for Overseas Shipment',
  },
];

export const galleryByCategory = (cat: GalleryCategory) =>
  gallery.filter((g) => g.published !== false && g.category === cat);

export const imageUrl = (g: GalleryImage) => `${BUCKET}/${g.filename}`;
