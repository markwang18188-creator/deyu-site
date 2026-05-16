export type ProductCategory =
  | 'single-color'
  | 'dual-color'
  | 'multi-color'
  | 'air-blowing'
  | 'industrial';

export interface Product {
  slug: string;
  modelSlug: string;
  model: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  mainImage: string;
  gallery: string[];
  videoUrl?: string;
  brochurePdfUrl?: string;
}

export const products: Product[] = [
  // ── 单色机 ──────────────────────────────────────────
  {
    slug: 'pvc-single-color-rotary-machine',
    modelSlug: 'dy-1120a',
    model: 'DY-1120A',
    name: 'Full Automatic Rotary Disc Single Color PVC Rubber Sole Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      'High-output 20-station rotary sole machine for PVC, TPR and TPU single-color soles. 180+ pairs/hour with servo energy-saving system.',
    features: [
      '20 stations rotary disc',
      'Production: 180+ pairs/hour',
      'Materials: PVC / TPR / TPU',
      'Servo motor energy saving 30%',
      'Water-cooling mould system',
      'CE & ISO9001 certified',
    ],
    specifications: {
      'Model': 'DY-1120A',
      'Stations': '20',
      'Production Capacity': '180+ pairs/hour',
      'Material': 'PVC / TPR / TPU',
      'Injection Weight': '≤400g',
      'Screw Diameter': '50mm',
      'Power': '≈22kW',
      'Machine Weight': '≈5,500kg',
    },
    applications: ['Sports shoes', 'Casual shoes', 'Safety shoes', 'Sandals'],
    mainImage: '/images/products/dy-1120a.jpg',
    gallery: [],
  },
  {
    slug: 'tpu-single-color-vertical-machine',
    modelSlug: 'dy-1106tr-tpu',
    model: 'DY-1106TR/TPU',
    name: 'Full Automatic Vertical 6-Station Water-Cooling Single Color TR/TPU Sole Injection Machine',
    category: 'single-color',
    shortDescription:
      'Vertical 6-station machine designed for TR and TPU materials. Water-cooling system ensures stable mould temperature and consistent quality.',
    features: [
      '6 stations vertical layout',
      'Optimised for TR / TPU materials',
      'Water-cooling mould system',
      'Compact footprint',
      'Servo energy-saving drive',
      'CE & ISO9001 certified',
    ],
    specifications: {
      'Model': 'DY-1106TR/TPU',
      'Stations': '6',
      'Material': 'TR / TPU',
      'Layout': 'Vertical',
      'Cooling': 'Water-cooling',
    },
    applications: ['Sports shoe soles', 'Running shoe soles', 'Outdoor footwear'],
    mainImage: '/images/products/dy-1106tr-tpu.jpg',
    gallery: [],
  },
  {
    slug: 'pvc-six-station-rotary-machine',
    modelSlug: 'dy-1106',
    model: 'DY-1106',
    name: 'Full Automatic 6-Station Water-Cooling Rotary PVC Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      '6-station water-cooled rotary machine for PVC, TPR and TPU. Ideal for small-batch production and mould trials.',
    features: [
      '6 stations rotary disc',
      'Water-cooling system',
      'Materials: PVC / TPR / TPU',
      'Quick mould change',
      'Compact design',
    ],
    specifications: {
      'Model': 'DY-1106',
      'Stations': '6',
      'Material': 'PVC / TPR / TPU',
      'Cooling': 'Water-cooling',
    },
    applications: ['Sample making', 'Small-batch production', 'Mould trial'],
    mainImage: '/images/products/dy-1106.jpg',
    gallery: [],
  },
  {
    slug: 'automatic-mold-opening-sole-machine',
    modelSlug: 'dy-1102h',
    model: 'DY-1102H',
    name: 'Full Automatic Two-Station V-Type Slide Plastic Sole Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      'Two-station V-type slide machine with automatic mould opening. High efficiency for single-color PVC/TPR/TPU soles.',
    features: [
      '2 stations V-type slide design',
      'Automatic mould opening',
      'Materials: PVC / TPR / TPU',
      'High injection precision',
      'Low maintenance',
    ],
    specifications: {
      'Model': 'DY-1102H',
      'Stations': '2',
      'Layout': 'V-type slide',
      'Material': 'PVC / TPR / TPU',
    },
    applications: ['Flat sole shoes', 'Casual footwear', 'House slippers'],
    mainImage: '/images/products/dy-1102h.jpg',
    gallery: [],
  },
  {
    slug: 'two-station-slide-sole-machine',
    modelSlug: 'dy-1102',
    model: 'DY-1102',
    name: 'Full Automatic Two-Station Slide Plastic Rubber Sole Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      'Entry-level 2-station slide machine for PVC, TPR and TPU. Simple, reliable and low-cost operation.',
    features: [
      '2 stations slide design',
      'Simple operation',
      'Materials: PVC / TPR / TPU',
      'Low energy consumption',
      'Easy maintenance',
    ],
    specifications: {
      'Model': 'DY-1102',
      'Stations': '2',
      'Material': 'PVC / TPR / TPU',
    },
    applications: ['Flat soles', 'Economy footwear', 'OEM production'],
    mainImage: '/images/products/dy-1102.jpg',
    gallery: [],
  },
  {
    slug: 'tr-tpu-water-cooling-sole-machine',
    modelSlug: 'dy-1112tr-tpu',
    model: 'DY-1112TR/TPU',
    name: 'Full Automatic TR/TPU Water-Cooling 4–12 Station Single Color Sole Machine',
    category: 'single-color',
    shortDescription:
      'Flexible 4–12 station configuration for TR/TPU single-color soles. Water-cooling system for stable high-speed production.',
    features: [
      '4–12 stations configurable',
      'Water-cooling system',
      'Materials: TR / TPU',
      'Servo energy saving',
      'Modular design',
    ],
    specifications: {
      'Model': 'DY-1112TR/TPU',
      'Stations': '4–12 (configurable)',
      'Material': 'TR / TPU',
      'Cooling': 'Water-cooling',
    },
    applications: ['Sports soles', 'Athletic footwear', 'High-volume production'],
    mainImage: '/images/products/dy-1112tr-tpu.jpg',
    gallery: [],
  },

  // ── 双色机 ──────────────────────────────────────────
  {
    slug: 'tpu-dual-color-injection-machine',
    modelSlug: 'dy-2216tr-tpu',
    model: 'DY-2216TR/TPU',
    name: 'Full Automatic Rotary Type Two Color TPU Sole Injection Moulding Machine',
    category: 'dual-color',
    shortDescription:
      'Premium 16-station rotary machine for dual-color TPU soles. Replace rubber with TPU for superior performance and 60–80 pairs/hour output.',
    features: [
      '16 stations rotary disc',
      'Production: 60–80 pairs/hour',
      'Dual color TPU / TR capability',
      'Servo energy saving 30%',
      'Water-cooling system',
      'CE & ISO9001 certified',
    ],
    specifications: {
      'Model': 'DY-2216TR/TPU',
      'Stations': '16',
      'Production Capacity': '60–80 pairs/hour',
      'Material': 'TPU / TR',
      'Colors': '2',
      'Injection Units': '2',
      'Power': '≈35kW',
      'Machine Weight': '≈8,000kg',
    },
    applications: [
      'Sports shoe soles',
      'Running shoes',
      'Basketball shoes',
      'Two-tone fashion soles',
    ],
    mainImage: '/images/products/dy-2216tr-tpu.jpg',
    gallery: [],
  },
  {
    slug: 'dual-color-rotary-sole-machine',
    modelSlug: 'dy-2220a',
    model: 'DY-2220A',
    name: 'Full Automatic Rotary Disc Dual Color PVC Rubber Sole Injection Moulding Machine',
    category: 'dual-color',
    shortDescription:
      '20-station rotary machine for dual-color PVC/TPR/TPU soles. High output with stable color separation.',
    features: [
      '20 stations rotary disc',
      'Dual color injection',
      'Materials: PVC / TPR / TPU',
      'Stable color separation',
      'Servo energy saving',
    ],
    specifications: {
      'Model': 'DY-2220A',
      'Stations': '20',
      'Material': 'PVC / TPR / TPU',
      'Colors': '2',
    },
    applications: ['Fashion soles', 'Athletic shoes', 'Casual footwear'],
    mainImage: '/images/products/dy-2220a.jpg',
    gallery: [],
  },
  {
    slug: 'tpu-tr-dual-color-12-station',
    modelSlug: 'dy-2212tpu-tr',
    model: 'DY-2212TPU/TR',
    name: 'Full Automatic Rotary Disc TPU/TR Dual Color Sole Injection Moulding Machine',
    category: 'dual-color',
    shortDescription:
      '12-station rotary machine optimised for TPU/TR dual-color soles. Compact and high-efficiency.',
    features: [
      '12 stations rotary disc',
      'Dual color TPU / TR',
      'Compact design',
      'Water-cooling',
      'Servo drive',
    ],
    specifications: {
      'Model': 'DY-2212TPU/TR',
      'Stations': '12',
      'Material': 'TPU / TR',
      'Colors': '2',
    },
    applications: ['Running shoes', 'Trail shoes', 'Technical soles'],
    mainImage: '/images/products/dy-2212tpu-tr.jpg',
    gallery: [],
  },

  // ── 多色机 ──────────────────────────────────────────
  {
    slug: 'multi-color-rotary-machine',
    modelSlug: 'dy-3220c',
    model: 'DY-3220C',
    name: 'Full Automatic Rotary Disc Two-Head Three Color PVC Sole Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      '12/20-station three-color rotary machine with two injection heads. Create complex multi-color designs for premium footwear.',
    features: [
      '12 or 20 stations',
      'Three colors, two injection heads',
      'Materials: PVC / TPR / TPU',
      'Complex pattern capability',
      'High color accuracy',
    ],
    specifications: {
      'Model': 'DY-3220C',
      'Stations': '12 / 20',
      'Colors': '3',
      'Injection Heads': '2',
      'Material': 'PVC / TPR / TPU',
    },
    applications: ['Premium fashion soles', 'Designer footwear', 'Multi-color sport soles'],
    mainImage: '/images/products/dy-3220c.jpg',
    gallery: [],
  },
  {
    slug: 'four-color-rotary-sole-machine',
    modelSlug: 'dy-4212c',
    model: 'DY-4212C',
    name: 'Full Automatic Rotary Disc Two-Head Four Color PVC Sole Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      '12-station four-color rotary machine. The most versatile option for complex multi-color sole designs.',
    features: [
      '12 stations',
      'Four colors, two injection heads',
      'Materials: PVC / TPR / TPU',
      'Maximum design flexibility',
      'Servo energy saving',
    ],
    specifications: {
      'Model': 'DY-4212C',
      'Stations': '12',
      'Colors': '4',
      'Injection Heads': '2',
      'Material': 'PVC / TPR / TPU',
    },
    applications: ['High-end fashion soles', 'Complex pattern soles', 'Brand footwear OEM'],
    mainImage: '/images/products/dy-4212c.jpg',
    gallery: [],
  },
  {
    slug: 'three-color-12-20-station-machine',
    modelSlug: 'dy-3212b',
    model: 'DY-3212B',
    name: 'Full Automatic Rotary Disc Two-Head Three Color PVC Sole Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      '12/16/20-station three-color machine. Flexible station count for different production scales.',
    features: [
      '12 / 16 / 20 stations',
      'Three colors',
      'Two injection heads',
      'Materials: PVC / TPR / TPU',
      'Flexible configuration',
    ],
    specifications: {
      'Model': 'DY-3212B',
      'Stations': '12 / 16 / 20',
      'Colors': '3',
      'Injection Heads': '2',
      'Material': 'PVC / TPR / TPU',
    },
    applications: ['Sports soles', 'Fashion footwear', 'Multi-color casual soles'],
    mainImage: '/images/products/dy-3212b.jpg',
    gallery: [],
  },
  {
    slug: 'tpu-tr-vertical-injection-machine',
    modelSlug: 'dy-150',
    model: 'DY-150',
    name: 'Full Automatic Vertical TR/TPU Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      'Vertical standalone TR/TPU injection machine. Supports single and dual color production in a compact vertical layout.',
    features: [
      'Vertical layout',
      'Single or dual color',
      'TR / TPU materials',
      'Compact footprint',
      'Easy operation',
    ],
    specifications: {
      'Model': 'DY-150',
      'Layout': 'Vertical',
      'Colors': '1–2',
      'Material': 'TR / TPU',
    },
    applications: ['TR soles', 'TPU soles', 'Small production runs'],
    mainImage: '/images/products/dy-150.jpg',
    gallery: [],
  },

  // ── 吹气类 ──────────────────────────────────────────
  {
    slug: 'air-blowing-injection-machine',
    modelSlug: 'dy-1124b',
    model: 'DY-1124B',
    name: 'Full Automatic Rotary Disc Single Color Air-Blowing Injection Moulding Machine',
    category: 'air-blowing',
    shortDescription:
      '24-station air-blowing machine for lightweight slipper and sandal soles. Low material cost, high output.',
    features: [
      '24 stations',
      'Air-blowing injection',
      'Lightweight sole production',
      'Low material consumption',
      'High output rate',
    ],
    specifications: {
      'Model': 'DY-1124B',
      'Stations': '24',
      'Type': 'Air-blowing',
      'Colors': '1',
    },
    applications: ['Slippers', 'Sandals', 'Lightweight casual footwear'],
    mainImage: '/images/products/dy-1124b.jpg',
    gallery: [],
  },
  {
    slug: 'dual-color-air-blowing-machine',
    modelSlug: 'dy-2224b',
    model: 'DY-2224B',
    name: 'Full Automatic Rotary Disc Two-Head Dual Color Air-Blowing Injection Machine',
    category: 'air-blowing',
    shortDescription:
      '20/24-station dual-color air-blowing machine for fashion slippers and sandals.',
    features: [
      '20 / 24 stations',
      'Dual color air-blowing',
      'Two injection heads',
      'Fashion slipper production',
    ],
    specifications: {
      'Model': 'DY-2224B',
      'Stations': '20 / 24',
      'Type': 'Air-blowing',
      'Colors': '2',
    },
    applications: ['Fashion slippers', 'Dual-color sandals', 'Beach footwear'],
    mainImage: '/images/products/dy-2224b.jpg',
    gallery: [],
  },
  {
    slug: 'three-color-mixed-air-blowing-machine',
    modelSlug: 'dy-3124c',
    model: 'DY-3124C',
    name: 'Full Automatic Rotary Disc Single-Head Three Color Mixed Air-Blowing Injection Machine',
    category: 'air-blowing',
    shortDescription:
      '20/24-station three-color mixed air-blowing machine. Creates unique mixed-color effects for premium slippers.',
    features: [
      '20 / 24 stations',
      'Three color mixed injection',
      'Unique color swirl effect',
      'Air-blowing technique',
    ],
    specifications: {
      'Model': 'DY-3124C',
      'Stations': '20 / 24',
      'Type': 'Air-blowing',
      'Colors': '3 (mixed)',
    },
    applications: ['Premium slippers', 'Swirl-pattern sandals', 'Fashion footwear'],
    mainImage: '/images/products/dy-3124c.jpg',
    gallery: [],
  },

  // ── 工业件 ──────────────────────────────────────────
  {
    slug: 'industrial-parts-six-station-machine',
    modelSlug: 'dy-1106-s',
    model: 'DY-1106-S',
    name: '6-Station Rotary Injection Machine for Dumbbells, Weight Plates & Car Seat Cushions',
    category: 'industrial',
    shortDescription:
      'Adapted from our 6-station sole machine for industrial part production. Ideal for dumbbells, weight plates and automotive seat cushions.',
    features: [
      '6 stations rotary disc',
      'Heavy-duty mould clamping',
      'Multi-application design',
      'PVC / TPR / TPU / rubber',
      'CE certified',
    ],
    specifications: {
      'Model': 'DY-1106-S',
      'Stations': '6',
      'Applications': 'Dumbbells / Weight plates / Car seat cushions',
      'Material': 'PVC / TPR / TPU',
    },
    applications: ['Dumbbells', 'Barbell weight plates', 'Automotive seat cushions'],
    mainImage: '/images/products/dy-1106-s.jpg',
    gallery: [],
  },
  {
    slug: 'industrial-parts-two-station-machine',
    modelSlug: 'dy-1102-s',
    model: 'DY-1102-S',
    name: '2-Station Slide Injection Machine for Dumbbells, Weight Plates & Car Seat Cushions',
    category: 'industrial',
    shortDescription:
      '2-station slide machine repurposed for industrial part production including fitness equipment and automotive components.',
    features: [
      '2 stations slide design',
      'Industrial part production',
      'Flexible mould compatibility',
      'Low maintenance',
    ],
    specifications: {
      'Model': 'DY-1102-S',
      'Stations': '2',
      'Applications': 'Dumbbells / Weight plates / Car seat cushions',
      'Material': 'PVC / TPR / TPU',
    },
    applications: ['Dumbbells', 'Barbell plates', 'Car seat cushions'],
    mainImage: '/images/products/dy-1102-s.jpg',
    gallery: [],
  },
];

export const productsByCategory = (category: ProductCategory) =>
  products.filter((p) => p.category === category);

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug || p.modelSlug === slug);

export const categoryLabels: Record<ProductCategory, string> = {
  'single-color': 'Single Color Machines',
  'dual-color': 'Dual Color Machines',
  'multi-color': 'Multi Color Machines',
  'air-blowing': 'Air Blowing Machines',
  'industrial': 'Industrial Parts Machines',
};
