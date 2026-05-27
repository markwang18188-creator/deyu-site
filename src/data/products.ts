// Product images live in public/products/ — instant local dev + free Vercel edge delivery.
// Originals are also backed up in Supabase Storage (product-images bucket).
// When you replace an image, just overwrite the file in public/products/.
const img = (name: string) => `/products/${name}`;

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
  /** YouTube video ID (11-char), e.g. "dQw4w9WgXcQ" — horizontal/regular video. */
  youtubeId?: string;
  /** YouTube Shorts ID (11-char). Vertical 9:16 video. Rendered as 'Quick Demo' rail. */
  youtubeShortsId?: string;
  /** Optional caption shown above the Shorts player. Defaults to "60-Second <Model> in Action". */
  shortsCaption?: string;
  /** Optional video upload date (ISO), e.g. "2026-05-25". Used for VideoObject schema. */
  videoUploadDate?: string;
  /** Generic embed URL fallback (Vimeo / self-hosted). Use youtubeId when possible. */
  videoUrl?: string;
  brochurePdfUrl?: string;
}

/** Build a privacy-enhanced YouTube embed URL from an 11-char video ID. */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

/** Build a YouTube Shorts embed URL (standard /embed/ works — YouTube auto-detects 9:16). */
export function youtubeShortsEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}

/** Get a product's primary watchable video URL (YouTube preferred). */
export function productVideoEmbed(p: Product): string | undefined {
  if (p.youtubeId) return youtubeEmbedUrl(p.youtubeId);
  return p.videoUrl;
}

export const products: Product[] = [
  // ═══════════════════════════════════════════════════════════════
  // SINGLE COLOR MACHINES
  // ═══════════════════════════════════════════════════════════════

  {
    slug: 'two-station-slide-sole-machine',
    modelSlug: 'dy-1102',
    model: 'DY-1102',
    name: 'TPU Sole Injection Moulding Machine — DY-1102 Entry-Level 2-Station Slide',
    category: 'single-color',
    shortDescription:
      'Entry-level TPU sole injection moulding machine — 2-station slide design. The lowest-barrier way to start TPU sole production. Also compatible with PVC and TPR materials.',
    features: [
      'Primary application: TPU sole production',
      '2 stations slide design',
      'Lowest entry cost for TPU manufacturing',
      'Also compatible with PVC / TPR',
      'Simple operation, easy maintenance',
      'Low energy consumption',
    ],
    specifications: {
      'Model': 'DY-1102',
      'Stations': '2 (slide type)',
      'Primary Material': 'TPU',
      'Compatible Materials': 'PVC / TPR / TPU',
      'Best For': 'Small-batch / entry-level TPU production',
    },
    applications: [
      'TPU sole sampling & prototyping',
      'Small-batch TPU production',
      'Entry-level TPU manufacturing',
      'PVC / TPR flat soles',
      'OEM low-volume production',
    ],
    mainImage: img('dy-1102.png'),
    gallery: [],
    youtubeId: 'RGE2Fic2bno',
  },

  {
    slug: 'automatic-mold-opening-sole-machine',
    modelSlug: 'dy-1102h',
    model: 'DY-1102H',
    name: 'Full Automatic Two-Station V-Block Slide Plastic Rubber Sole Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      '2-station V-Block slide machine with 150T clamping force and 1050 kg/cm² injection pressure. Versatile heavy-duty design — handles standard sole production plus some industrial parts. 170 pairs/hour.',
    features: [
      '2 stations V-Block slide design',
      'Heavy 150T clamping force',
      'Production: 170 pairs/hour',
      'Multi-station independent pressure control (digital programmed)',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Servo energy-saving system — saves 30%+ electricity',
      'Compact frame, low maintenance',
    ],
    specifications: {
      'Model': 'DY-1102H',
      'Stations': '2 (V-Block slide)',
      'Screw Diameter': 'Φ55 mm',
      'Max Injection Capacity': '470 cm³/shot',
      'Clamping Force': '150 tons',
      'Max Injection Pressure': '1050 kg/cm²',
      'Productivity': '170 pairs/hour',
      'Mould Dimension': '500 × 360 × 180 mm',
      'Total Power': '33 kW',
      'Machine Dimension': '3.9 × 2.0 × 2.5 m',
      'Machine Weight': '8 tons',
      'Oil Capacity': '450 L',
    },
    applications: [
      'Flat sole shoes',
      'Casual footwear',
      'House slippers',
      'Single-color PVC/TPR/TPU soles',
      'Heavy-duty production runs',
    ],
    mainImage: img('dy-1102-v.jpg'),
    gallery: [],
  },

  {
    slug: 'pvc-six-station-rotary-machine',
    modelSlug: 'dy-1106',
    model: 'DY-1106',
    name: 'Full Automatic 6-Station Water-Cooling Rotary PVC Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      '6-station water-cooled rotary machine for PVC, TPR and TPU. Ideal for one-pair-per-mold production (perfect for men\'s shoe set 39-44 = 6 pairs). Compact and reliable.',
    features: [
      '6 stations rotary disc',
      'Water-cooling system',
      'Materials: PVC / TPR / TPU',
      'Optimised for 1-pair-per-mold (e.g. men\'s shoe set 39-44)',
      'Quick mould change',
      'Compact design',
    ],
    specifications: {
      'Model': 'DY-1106',
      'Stations': '6',
      'Configuration': '1-pair per mold (6 pairs/cycle)',
      'Material': 'PVC / TPR / TPU',
      'Cooling': 'Water-cooling',
    },
    applications: ['Men\'s shoe sets', 'Small-batch production', 'Mould trial', 'OEM sampling'],
    mainImage: img('dy-1106.jpg'),
    gallery: [],
    youtubeId: 'ydUyUriENNc',
    youtubeShortsId: 'YBxiP73CjEY',
  },

  {
    slug: 'tpu-single-color-vertical-machine',
    modelSlug: 'dy-1106tr-tpu',
    model: 'DY-1106TR/TPU',
    name: 'Fully Automatic Vertical Six-Station Water Cooling One Color TR/TPU Sole Injection Machine',
    category: 'single-color',
    shortDescription:
      'Vertical 6-station water-cooled TR/TPU machine. 150T heavy clamping force optimized for TR/TPU foam/solid soles. Automatic mould opening robotic arm. 80-120 pairs/hour.',
    features: [
      '6 stations vertical layout',
      'Heavy 150T clamping force (specifically for 1-pair-per-mold)',
      'Central water-cooling — fast mould cooling',
      'Automatic mould opening robotic arm — operable by female / older workers',
      'Optimised for TR / TPU foam and solid soles',
      'Integrated compact structure — less floor space',
      'Servo energy-saving system — saves 30%+ electricity',
      'Production: 80-120 pairs/hour',
    ],
    specifications: {
      'Model': 'DY-1106TR/TPU',
      'Stations': '6 (vertical)',
      'Screw Diameter': 'Φ50 mm',
      'Max Injection Capacity': '390 cm³/shot',
      'Clamping Force': '150 tons',
      'Max Injection Pressure': '1300 kg/cm²',
      'Productivity': '80-120 pairs/hour',
      'Mould Dimension': '500 × 340 × 170 mm',
      'Total Power': '33 kW',
      'Machine Dimension': '2.8 × 2.1 × 2.9 m',
      'Machine Weight': '7 tons',
      'Oil Capacity': '500 L',
    },
    applications: ['Sports shoe TR/TPU soles', 'Running shoe soles', 'Outdoor footwear', 'High-performance soles'],
    mainImage: img('dy-1106.jpg'),
    gallery: [],
  },

  {
    slug: 'pvc-single-color-12-station-machine',
    modelSlug: 'dy-1112a',
    model: 'DY-1112A',
    name: 'Full Automatic Rotary Type One Color Plastic Rubber Sole Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      '12-station rotary single-color machine for PVC/TPR/TPU. 100T clamping force suited for standard sole production. 130 pairs/hour with large Φ65 screw.',
    features: [
      '12 stations rotary disc',
      '100T clamping force',
      'Large Φ65 screw for high injection volume',
      'Production: 130 pairs/hour',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Computer-programmed digital control',
    ],
    specifications: {
      'Model': 'DY-1112A',
      'Stations': '12',
      'Screw Diameter': 'Φ65 mm',
      'Max Injection Capacity': '660 cm³/shot',
      'Clamping Force': '100 tons',
      'Max Injection Pressure': '890 kg/cm²',
      'Productivity': '130 pairs/hour',
      'Mould Dimension': '500 × 320 × 250 mm',
      'Total Power': '31.5 kW',
      'Machine Dimension': '4.3 × 4.7 × 2.2 m',
      'Machine Weight': '5.5 tons',
      'Oil Capacity': '600 L',
    },
    applications: ['Mid-volume PVC sole production', 'Casual footwear', 'Sports shoe soles', 'OEM production'],
    mainImage: img('dy-1112.jpg'),
    gallery: [],
  },

  {
    slug: 'tr-tpu-water-cooling-sole-machine',
    modelSlug: 'dy-1112tr-tpu',
    model: 'DY-1112TR/TPU',
    name: 'Fully Automatic TR/TPU Water Cooling One Color Plastic Rubber Soles Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      'TR/TPU water-cooled machine available in 6 or 12 station configurations. 150T clamping force, central water-cooling, automatic mould opening. 80-120 pairs/hour.',
    features: [
      'Available in 6-station or 12-station configurations',
      'Heavy 150T clamping force',
      'Central water-cooling system — fast mould cooling',
      'Automatic mould opening robotic arm',
      'Optimised for TR / TPU (foamed or solid)',
      'Compact structure design',
      'Servo energy-saving system — saves 30%+ electricity',
      'Production: 80-120 pairs/hour',
    ],
    specifications: {
      'Model': 'DY-1112TR/TPU',
      'Stations': '6 or 12 (configurable)',
      'Screw Diameter': 'Φ55 mm',
      'Max Injection Capacity': '470 cm³/shot',
      'Clamping Force': '150 tons',
      'Max Injection Pressure': '1050 kg/cm²',
      'Productivity': '80-120 pairs/hour',
      'Mould Dimension': '500 × 340 × 170 mm',
      'Total Power': '33 kW',
      'Machine Dimension (6-station)': '4.5 × 2.0 × 2.0 m',
      'Machine Dimension (12-station)': '5.5 × 2.2 × 2.0 m',
      'Machine Weight': '6.5 tons (6-station) / 8 tons (12-station)',
      'Oil Capacity': '450 L',
    },
    applications: ['TR/TPU sports soles', 'Athletic footwear', 'High-volume TR/TPU production', 'Trail running shoes'],
    mainImage: img('dy-1112.jpg'),
    gallery: [],
  },

  {
    slug: 'pvc-single-color-rotary-machine',
    modelSlug: 'dy-1120a',
    model: 'DY-1120A',
    name: 'Full Automatic Rotary Type One Color Plastic Rubber Soles Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      'High-output 20-station rotary single-color machine for PVC/TPR/TPU. 180 pairs/hour, large Φ75 screw. The DEYU workhorse for high-volume PVC sole production.',
    features: [
      '20 stations rotary disc',
      'Production: 180 pairs/hour (high volume)',
      'Large Φ75 screw — high injection volume per shot',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      '20 independent station injection volume settings (computer-controlled)',
      'Low-noise low-speed high-torque hydraulic motor',
      'Stepless speed change',
    ],
    specifications: {
      'Model': 'DY-1120A',
      'Stations': '20',
      'Screw Diameter': 'Φ75 mm',
      'Max Injection Capacity': '880 cm³/shot',
      'Clamping Force': '55 tons',
      'Max Injection Pressure': '660 kg/cm²',
      'Productivity': '180 pairs/hour',
      'Mould Dimension': '400 × 200 × 160 mm',
      'Total Power': '33.3 kW',
      'Machine Dimension': '4.2 × 2.1 × 2.0 m',
      'Machine Weight': '4.2 tons',
      'Oil Capacity': '450 L',
    },
    applications: ['Sports shoes', 'Casual shoes', 'Safety shoes', 'Sandals', 'High-volume PVC production'],
    mainImage: img('dy-1120.jpg'),
    gallery: [],
  },

  {
    slug: 'tpu-tr-vertical-injection-machine',
    modelSlug: 'dy-150',
    model: 'DY-150',
    name: 'Automatic Vertical Two Color TR/TPU Injection Moulding Machine',
    category: 'single-color',
    shortDescription:
      'Vertical hydraulic TR/TPU machine with 4-screw configuration supporting single and dual color production. 0/90/180° turnover structure. 150T clamping. Niche product for vertical-layout preferences.',
    features: [
      'Vertical hydraulic mould-close system',
      '0° / 90° / 180° turnover structure',
      '4 screws (Φ55 × 4) — supports single and dual color',
      '150T clamping force',
      'Auto-adjusting mould space (80-200mm)',
      'Compact footprint',
      'Integrated oil tank + electric control box',
      'Touchscreen man-machine interface',
    ],
    specifications: {
      'Model': 'DY-150',
      'Layout': 'Vertical',
      'Colors': '1 or 2',
      'Material': 'TR / TPR / TPU',
      'Screw Diameter': 'Φ55 × 4',
      'Clamping Force': '150 tons',
      'Mould Opening Stroke': '370 mm',
      'Mould Dimension': '480 × 550 mm',
      'Mould Thickness': '80-200 mm',
      'Max Injection Capacity': '1000 cc',
      'Total Power': '38 kW',
      'Oil Capacity': '600 L',
      'Machine Dimension': '2.2 × 2.7 × 2.6 m',
      'Machine Weight': '10 tons',
    },
    applications: ['TR soles', 'TPU soles', 'Specialty vertical-layout production', 'Customers preferring vertical machines'],
    mainImage: img('dy-150.jpg'),
    gallery: [],
    youtubeShortsId: '7cMchkNhq4U',
  },

  // ═══════════════════════════════════════════════════════════════
  // DUAL COLOR MACHINES
  // ═══════════════════════════════════════════════════════════════

  {
    slug: 'single-head-dual-color-tr-tpu-machine',
    modelSlug: 'dy-2112tr-tpu',
    model: 'DY-2112TR/TPU',
    name: 'Full Automatic Rotary Single-Head Two Color TR/TPU Sole Injection Moulding Machine',
    category: 'dual-color',
    shortDescription:
      'Unique single-head dual color TR/TPU machine. 12 stations, 110T clamping, water-cooled, robotic arm auto-open. 80-120 pairs/hour. Compact alternative to dual-head configurations.',
    features: [
      '12 stations rotary disc',
      'Unique single-head design with dual-color capability',
      '110T clamping force',
      'Central water-cooling',
      'Automatic mould opening robotic arm',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Energy-saving servo system — saves 30%+ electricity',
      'Production: 80-120 pairs/hour',
    ],
    specifications: {
      'Model': 'DY-2112TR/TPU',
      'Stations': '12',
      'Configuration': 'Single head, dual color',
      'Screw Diameter': 'Φ50 / Φ50',
      'Max Injection Capacity': '390 cm³/shot',
      'Clamping Force': '110 tons',
      'Max Injection Pressure': '1300 kg/cm²',
      'Productivity': '80-120 pairs/hour',
      'Mould Dimension': '500 × 340 × 170 mm',
      'Total Power': '33 kW',
      'Machine Dimension': '5 × 4 × 2 m',
      'Machine Weight': '7 tons',
      'Oil Capacity': '650 L',
    },
    applications: ['Dual-color TR/TPU sports soles', 'Compact dual-color production', 'Mid-volume athletic footwear'],
    mainImage: img('dy-2212t.jpg'),
    gallery: [],
  },

  {
    slug: 'tpu-tr-dual-color-12-station',
    modelSlug: 'dy-2212tpu-tr',
    model: 'DY-2212TPU/TR',
    name: 'Full Automatic Rotary Type Two Color TPU/TR Water-Cooled Sole Injection Moulding Machine',
    category: 'dual-color',
    shortDescription:
      'Premium 12-station dual-color TPU/TR machine with column-type structure, central water-cooling, and 150T clamping force. The DEYU flagship for outsoles, soccer cleats, and high-end TPU dual-color production. 80-120 pairs/hour.',
    features: [
      '12 stations rotary disc',
      'Column-type (3-pillar) head structure for 150T clamping',
      'Central water-cooling — rapid mould cooling',
      'Optimised for TPU outsoles, soccer cleats, premium TR/TPU soles',
      'Dual injection heads (2 × Φ55 screws)',
      'High injection pressure: 1300/1300 kg/cm²',
      'Compact lightweight frame',
      'External oil pump — better heat dissipation, longer machine life',
      'Production: 80-120 pairs/hour',
    ],
    specifications: {
      'Model': 'DY-2212TPU/TR',
      'Stations': '12',
      'Screw Diameter': 'Φ55 / Φ55',
      'Max Injection Capacity': '500 / 500 cm³/shot',
      'Clamping Force': '150 tons',
      'Max Injection Pressure': '1300 / 1300 kg/cm²',
      'Productivity': '80-120 pairs/hour',
      'Mould Dimension': '500 × 340 × 180 mm',
      'Total Power': '66 kW',
      'Machine Dimension': '8 × 4 × 2.2 m',
      'Machine Weight': '20 tons',
      'Oil Capacity': '800 × 2 L',
    },
    applications: ['Soccer cleat outsoles', 'TPU dual-color outsoles', 'Premium running shoe soles', 'Trail shoes', 'Technical performance soles'],
    mainImage: img('dy-2212t.jpg'),
    gallery: [],
    youtubeId: 'CXLqefs4EAk',
  },

  {
    slug: 'tpu-dual-color-injection-machine',
    modelSlug: 'dy-2216tr-tpu',
    model: 'DY-2216TR/TPU',
    name: 'Full Automatic Rotary Type Two Color Plastic Rubber Soles Injection Moulding Machine',
    category: 'dual-color',
    shortDescription:
      '16-station rotary dual-color TR/TPU machine. 150T clamping, dual screws (2×Φ55), 60-80 pairs/hour. Fallback option for budget-conscious or mid-volume TR/TPU dual-color production.',
    features: [
      '16 stations rotary disc',
      'Dual injection heads (2 × Φ55 screws)',
      '150T clamping force',
      'Production: 60-80 pairs/hour',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      '16 independent station pressure settings',
      'Servo energy-saving system — saves 30%+ electricity',
    ],
    specifications: {
      'Model': 'DY-2216TR/TPU',
      'Stations': '16',
      'Screw Diameter': '2 × Φ55',
      'Max Injection Capacity': '2 × 470 cm³/shot',
      'Clamping Force': '150 tons',
      'Max Injection Pressure': '1050 kg/cm²',
      'Productivity': '60-80 pairs/hour',
      'Mould Dimension': '500 × 320 × 170 mm',
      'Total Power': '60 kW',
      'Machine Dimension': '9.5 × 4.5 × 2.2 m',
      'Machine Weight': '20 tons',
      'Oil Capacity': '800 × 2 L',
    },
    applications: ['Dual-color sports soles', 'Running shoes', 'Basketball shoes', 'Two-tone fashion soles', 'Mid-volume TR/TPU production'],
    mainImage: img('dy-2212t.jpg'),
    gallery: [],
  },

  {
    slug: 'dual-color-rotary-sole-machine',
    modelSlug: 'dy-2220a',
    model: 'DY-2220A',
    name: 'Full Automatic Rotary Type Two Color Plastic Rubber Soles Injection Moulding Machine',
    category: 'dual-color',
    shortDescription:
      'High-volume 20-station dual-color PVC/TPR/TPU machine. 55T clamping (configurable 55/55, 55/80, 80/80 main/secondary), 150 pairs/hour. The DEYU dual-color workhorse for general production.',
    features: [
      '20 stations rotary disc',
      'Dual injection heads (Φ75 main + Φ65 secondary)',
      'Configurable clamping force: 55/55, 55/80, or 80/80 tons (per budget)',
      'Production: 150 pairs/hour',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'High-pressure high-flow hydraulic system — better efficiency',
      'External oil pump — better cooling, longer life',
      'Compact frame, lightweight design',
    ],
    specifications: {
      'Model': 'DY-2220A',
      'Stations': '20',
      'Screw Diameter': 'Φ75 (main) / Φ65 (secondary)',
      'Max Injection Capacity': '880 / 660 cm³/shot',
      'Clamping Force': '55 tons (configurable: 55/55, 55/80, or 80/80 per spec)',
      'Max Injection Pressure': '660 / 890 kg/cm²',
      'Productivity': '150 pairs/hour',
      'Mould Dimension': '500 × 320 × 250 mm',
      'Total Power': '60 kW',
      'Machine Dimension': '7.5 × 5.8 × 2.2 m',
      'Machine Weight': '12 tons',
      'Oil Capacity': '800 × 2 L',
    },
    applications: ['Sport shoe soles', 'Casual shoe soles', 'Men\'s and women\'s shoe soles', 'Sandals', 'High-volume dual-color PVC production'],
    mainImage: img('dy-2220.jpg'),
    gallery: [],
    youtubeId: 'uNTZLSCJAko',
    youtubeShortsId: 'kNTBYCSFngs',
  },

  // ═══════════════════════════════════════════════════════════════
  // MULTI COLOR MACHINES (3+ colors, always 1-piece per mold)
  // ═══════════════════════════════════════════════════════════════

  {
    slug: 'three-color-eight-ten-station-machine',
    modelSlug: 'dy-3208a',
    model: 'DY-3208A',
    name: 'Full Automatic Rotary Type Three Color Plastic Rubber Soles Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      'Compact 3-color machine available in 8 or 10 station configurations. 80T clamping with 3 independent screws (Φ50 + 2×Φ40). 150 pairs/hour. Entry-level option for 3-color sole production.',
    features: [
      '8 or 10 stations configurable',
      'Three independent injection heads',
      'Screws: Φ50 (main) + 2 × Φ40 (secondary)',
      '80T clamping force',
      'Production: 150 pairs/hour',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Compact footprint for 3-color production',
    ],
    specifications: {
      'Model': 'DY-3208A',
      'Stations': '8 or 10',
      'Colors': '3 (independent heads)',
      'Screw Diameter': 'Φ50 / Φ40 / Φ40',
      'Max Injection Capacity': '250 / 150 cm³/shot',
      'Clamping Force': '80 tons',
      'Max Injection Pressure': '890 / 660 / 660 kg/cm²',
      'Productivity': '150 pairs/hour',
      'Mould Dimension': '300 × 300 × 130 mm',
      'Total Power': '42 kW',
      'Machine Dimension': '6.5 × 2.5 × 1.65 m',
      'Machine Weight': '11 tons',
      'Oil Capacity': '800 × 3 L',
    },
    applications: ['Entry-level 3-color sole production', 'Children\'s shoe soles', 'Casual 3-color footwear', 'Sample / mid-volume runs'],
    mainImage: img('dy-3324.jpg'),
    gallery: [],
  },

  {
    slug: 'three-color-12-20-station-machine',
    modelSlug: 'dy-3212b',
    model: 'DY-3212B',
    name: 'Full Automatic Rotary Type Two-Head Three Color Plastic Soles Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      '3-color machine available in 12, 16, or 20 station configurations. 80T clamping force with column-type structure — the premium choice for heavier 3-color production. Two heads serve 3 colors (1 color + 2 colors across 2 layers).',
    features: [
      '12 / 16 / 20 stations configurable',
      'Two injection heads, three colors (1+2 layer configuration)',
      '80T clamping force, column-type structure',
      'Screws: Φ75 (main) + 2 × Φ60 (secondary)',
      'Materials: PVC / TPR (foamed or non-foamed)',
      '4-section temperature control',
      'External oil pump — better cooling, longer life',
    ],
    specifications: {
      'Model': 'DY-3212B',
      'Stations': '12 / 16 / 20',
      'Colors': '3 (across 2 layers)',
      'Injection Heads': '2',
      'Screw Diameter': 'Φ75 / 2 × Φ60',
      'Screw L/D Ratio': '21 / 20',
      'Max Injection Capacity': '195 / 195 mm',
      'Clamping Force': '80 tons',
      'Injection Pressure': '96 / 72.8 MPa',
      'Injection Speed': '12.7 / 16.7 cm/sec',
      'Screw Rotation Speed': '0-167 rpm',
      'Mould Dimension': '400 × 320 × 175 mm',
      'Total Power': '60 kW',
      'Motor Power': '16 / 16 kW',
      'Heater Power': '9.2 × 2 / 6.8 kW',
      'Oil Tank Volume': '500 / 500 L',
      'Machine Dimension': '7.5 × 3.5 × 2.4 m',
      'Machine Weight': '14 tons',
    },
    applications: ['Premium 3-color sports soles', 'Fashion footwear', 'Multi-color casual soles', 'Men\'s and women\'s shoe soles'],
    mainImage: img('dy-3212.png'),
    gallery: [],
  },

  {
    slug: 'multi-color-rotary-machine',
    modelSlug: 'dy-3220c',
    model: 'DY-3220C',
    name: 'Full Automatic Rotary Type Three Color Plastic Soles Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      'High-output 3-color rotary machine, 12 or 20 stations, dual injection heads. 220 pairs/hour. The DEYU multi-color workhorse for 2/3-color children\'s shoes, sports, casual, men\'s/women\'s, sandals.',
    features: [
      '12 or 20 stations',
      'Three colors, two injection heads',
      'Configurable clamping: 55T / 80T (secondary/main)',
      'Production: 220 pairs/hour',
      'Screws: Φ65 (main) + 2 × Φ60 (secondary)',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      '4-section temperature control',
      'External oil pump — better cooling, longer life',
      'Compact frame, lightweight, operator-friendly',
    ],
    specifications: {
      'Model': 'DY-3220C',
      'Stations': '12 / 20',
      'Colors': '3 (across 2 layers)',
      'Injection Heads': '2',
      'Screw Diameter': 'Φ65 / 2 × Φ60',
      'Screw L/D Ratio': '21 / 20',
      'Max Injection Capacity': '195 / 167 mm',
      'Clamping Force': '55 / 80 tons (secondary / main)',
      'Injection Pressure': '96 / 72.8 MPa',
      'Injection Speed': '12.7 / 16.7 cm/sec',
      'Screw Rotation Speed': '0-167 rpm',
      'Mould Dimension': '400 × 320 × 175 mm',
      'Total Power': '54.8 kW',
      'Motor Power': '16 / 16 kW',
      'Heater Power': '9.2 × 2 / 6.8 kW',
      'Oil Tank Volume': '500 / 400 L',
      'Machine Dimension': '8.6 × 4.5 × 2.4 m',
      'Machine Weight': '12 tons',
    },
    applications: ['Children\'s shoe soles (2/3 color)', 'Sport shoe soles', 'Casual footwear', 'Men\'s and women\'s shoes', 'Sandals'],
    mainImage: img('dy-3220.jpg'),
    gallery: [],
  },

  {
    slug: 'three-color-three-head-flexible-machine',
    modelSlug: 'dy-3324a',
    model: 'DY-3324A',
    name: 'Full Automatic Rotary Type Three Color Plastic Rubber Soles Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      'High-capacity 24-station 3-color machine with 3 independent gooseneck injection heads. The maximum-flexibility DEYU multi-color machine — run 3-color stacked soles, OR 3 different single-color batches in parallel, OR mixed single + dual-color production. 150 pairs/hour.',
    features: [
      '24 stations rotary disc',
      'Three independent gooseneck injection heads',
      'Maximum flexibility: 3-layer stacked soles, 3 parallel single-color runs, or mixed configurations',
      '55T clamping force (heavy-frame design despite low tonnage)',
      'Large screws: Φ75 (main) + 2 × Φ65 (secondary)',
      'Production: 150 pairs/hour',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Ideal for factories producing multiple sole styles',
    ],
    specifications: {
      'Model': 'DY-3324A',
      'Stations': '24',
      'Colors': 'Up to 3 (across up to 3 layers)',
      'Injection Heads': '3 (independent gooseneck)',
      'Screw Diameter': 'Φ75 / Φ65 / Φ65',
      'Max Injection Capacity': '880 / 660 / 660 cm³/shot',
      'Clamping Force': '55 tons',
      'Max Injection Pressure': '890 / 660 / 660 kg/cm²',
      'Productivity': '150 pairs/hour',
      'Mould Dimension': '500 × 320 × 250 mm',
      'Total Power': '90 kW',
      'Machine Dimension': '10 × 8 × 2.2 m',
      'Machine Weight': '19 tons',
      'Oil Capacity': '800 × 3 L',
    },
    applications: [
      'Three-color stacked sole production',
      'Multiple single-color batches (3 styles in parallel)',
      'Mixed single-color + dual-color runs',
      'Fashion footwear OEM with varied sole designs',
      'High-capacity multi-color production',
    ],
    mainImage: img('dy-3324.jpg'),
    gallery: [],
    youtubeId: 'mercLlSpiJI',
  },

  {
    slug: 'four-color-rotary-sole-machine',
    modelSlug: 'dy-4212c',
    model: 'DY-4212C',
    name: 'Full Automatic Rotary Type Four Color Plastic Soles Injection Moulding Machine',
    category: 'multi-color',
    shortDescription:
      '12-station rotary machine with 2-head structure (1 main + 3 secondary screws). Produces dual, three, and four-color soles for children\'s shoes, sports shoes, casual footwear, sandals, and multi-color mixed soles. 220 pairs/hour.',
    features: [
      '12 stations rotary disc',
      'Two-head design: 1 main screw + 3 secondary screws (enables 1+3 color distribution)',
      'Production: 220 pairs/hour',
      'Materials: PVC / TPR / TPU (foamed or solid)',
      'Full automatic computer-programmed control',
      'External oil pump for better cooling and longer machine life',
      'Compact frame, lightweight, operator-friendly design',
    ],
    specifications: {
      'Model': 'DY-4212C',
      'Stations': '12',
      'Colors': 'Up to 4 (across 2 layers: A = 1 color, B = 1/2/3 colors)',
      'Injection Heads': '2 (gooseneck type)',
      'Screw Diameter': 'Φ65 (main) + 3 × Φ50 (secondary)',
      'Max Injection Capacity': '660 + 3 × 392 cm³/shot',
      'Max Injection Pressure': '900 / 1100 kg/cm²',
      'Clamping Force': '55T (secondary) / 80T (main)',
      'Productivity': '220 pairs/hour',
      'Mould Dimension': '400 × 320 × 175 mm',
      'Total Power': '65 kW',
      'Machine Dimension': '7.6 × 4.0 × 2.4 m',
      'Machine Weight': '13 tons',
      'Oil Capacity': '600 / 600 L',
    },
    applications: [
      'Children\'s shoe soles (2/3/4 color)',
      'Sports shoe soles',
      'Casual footwear soles',
      'Slippers and sandals',
      'Multi-color mixed/marbled soles',
      'Foamed PVC/TPR/TPU soles',
    ],
    mainImage: img('dy-4212.jpg'),
    gallery: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // AIR BLOWING MACHINES (slippers, sandals, lightweight footwear)
  // ═══════════════════════════════════════════════════════════════

  {
    slug: 'air-blowing-injection-machine',
    modelSlug: 'dy-1124b',
    model: 'DY-1124B',
    name: 'Full Automatic Rotary Type Plastic Air Blowing Injection Moulding Machine',
    category: 'air-blowing',
    shortDescription:
      '24-station single-color air-blowing machine for slippers and sandals. 55T clamping with Φ65 screw. 130 pairs/hour. Produces lightweight, soft soles with 60%+ foaming rate.',
    features: [
      '24 stations rotary disc',
      'Air-blowing injection — lightweight, soft, smooth-faced products',
      '60%+ foaming rate',
      'Production: 130 pairs/hour',
      'Recyclable raw materials (similar quality to virgin)',
      'LCD display + PLC auto-control',
      'Integrated oil tank — less floor space',
      'Ergonomic touchscreen man-machine interface',
    ],
    specifications: {
      'Model': 'DY-1124B',
      'Stations': '24',
      'Type': 'Air-blowing',
      'Colors': '1',
      'Screw Diameter': 'Φ65',
      'Max Injection Capacity': '660 cm³/shot',
      'Clamping Force': '55 tons',
      'Max Injection Pressure': '890 kg/cm²',
      'Productivity': '130 pairs/hour',
      'Mould Dimension': '480 × 320 × 300 mm',
      'Total Power': '31.5 kW',
      'Machine Dimension': '4.29 × 4.7 × 2.175 m',
      'Machine Weight': '5.5 tons',
      'Oil Capacity': '600 L',
    },
    applications: ['Slippers', 'Sandals', 'Beach footwear', 'Lightweight casual footwear', 'High-volume slipper production'],
    mainImage: img('dy-1124.jpg'),
    gallery: [],
    youtubeId: 'lrGZTA-dOwc',
    youtubeShortsId: 'rS8-gVn3_4E',
  },

  {
    slug: 'dual-color-air-blowing-machine',
    modelSlug: 'dy-2224b',
    model: 'DY-2224B',
    name: 'Full Automatic Rotary Type Two Color Plastic Rubber Air Blowing Injection Moulding Machine',
    category: 'air-blowing',
    shortDescription:
      '20 or 24-station dual-color air-blowing machine for fashion slippers, sandals, cotton shoes, mixed-color straps. 55T clamping, Φ75 + Φ65 screws. 150 pairs/hour.',
    features: [
      '20 or 24 stations configurable',
      'Dual color air-blowing injection',
      'Two injection heads',
      '55T clamping force',
      'Screws: Φ75 (main) + Φ65 (secondary)',
      'Production: 150 pairs/hour',
      'Materials: PVC / TPR foam or non-foam air-blowing',
      'High-performance servo system with imported servo motor pump',
    ],
    specifications: {
      'Model': 'DY-2224B',
      'Stations': '20 / 24',
      'Type': 'Air-blowing',
      'Colors': '2',
      'Screw Diameter': 'Φ75 / Φ65',
      'Max Injection Capacity': '880 / 660 cm³/shot',
      'Clamping Force': '55 tons',
      'Max Injection Pressure': '660 / 890 kg/cm²',
      'Productivity': '150 pairs/hour',
      'Mould Dimension': '500 × 320 × 300 mm',
      'Total Power': '60 kW',
      'Machine Dimension': '8.5 × 6.8 × 2.2 m / 9.5 × 7.3 × 2.2 m',
      'Machine Weight': '15 tons',
      'Oil Capacity': '800 × 2 L',
    },
    applications: ['Fashion slippers', 'Dual-color sandals', 'Cotton shoes', 'Mixed-color straps', 'Beach footwear'],
    mainImage: img('dy-2220-s.jpg'),
    gallery: [],
    youtubeShortsId: '3P8OJKui39s',
  },

  {
    slug: 'three-color-mixed-air-blowing-machine',
    modelSlug: 'dy-3124c',
    model: 'DY-3124C',
    name: 'Full Automatic Rotary Type Three Color Plastic Air Blowing Injection Moulding Machine',
    category: 'air-blowing',
    shortDescription:
      '20 or 24-station single-head 3-color mixed air-blowing machine. Creates unique mixed-color effects, camouflage patterns. 80T clamping, 3 screws. For premium cotton shoes, slippers, mixed-color straps, camouflage sandals.',
    features: [
      '20 or 24 stations configurable',
      'Single-head three-color mixed injection',
      '80T clamping force',
      'Screws: Φ65 + Φ60 + Φ60',
      'Air-blowing technique — lightweight, soft',
      'Unique mixed-color / camouflage effect capability',
      'Materials: PVC / TPR foam or non-foam',
      'High-performance servo energy saving system',
    ],
    specifications: {
      'Model': 'DY-3124C',
      'Stations': '20 / 24',
      'Type': 'Air-blowing',
      'Colors': '3 (mixed)',
      'Screw Diameter': 'Φ65 / Φ60 / Φ60',
      'Screw L/D Ratio': '21 / 20 / 20',
      'Max Injection Capacity': '195 / 195 / 195 mm',
      'Clamping Force': '80 tons',
      'Injection Pressure': '96 / 72.8 / 72.8 MPa',
      'Injection Speed': '12.7 / 16.7 / 16.7 cm/sec',
      'Screw Rotation Speed': '0-167 rpm',
      'Mould Dimension': '400 × 320 × 360 mm',
      'Total Power': '70 kW',
      'Heater Power': '9.2 × 2 / 6.8 kW',
      'Motor Power': '53 kW',
      'Machine Dimension': '6 × 4 × 2.4 m',
      'Machine Weight': '8 tons',
      'Oil Tank Volume': '670 L',
    },
    applications: ['Mixed-color cotton shoes', 'Casual shoes', 'Camouflage sandals', 'Mixed-color straps', 'Premium fashion slippers'],
    mainImage: img('dy-3124.jpg'),
    gallery: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // INDUSTRIAL HEAVY-DUTY MACHINES (400T press, not shoe soles)
  // ═══════════════════════════════════════════════════════════════

  {
    slug: 'industrial-parts-two-station-machine',
    modelSlug: 'dy-1102-s',
    model: 'DY-1102-S',
    name: 'Fully Automatic Two-Station Slide Plastic Rubber Industrial Injection Moulding Machine — 400T',
    category: 'industrial',
    shortDescription:
      'Heavy-duty 2-station slide industrial press with 400-ton clamping force and 9000cc injection capacity. Purpose-built for industrial parts: barbell plates, dumbbells, automotive seat cushions. NOT a shoe sole machine — a dedicated heavy-industrial production line.',
    features: [
      '2 stations slide design',
      'Heavy 400-ton clamping force',
      'Massive 9000 cm³/shot injection capacity',
      'Large Φ105 screw diameter',
      'Full electro-hydraulic servo system — fast response, energy saving',
      'Electronic ruler for precise material measurement',
      'Full automatic PLC computer control',
      'Brand-new automatic mould opening structure',
      'Materials: PVC / TPE / TPR / TPU and other thermoplastics',
    ],
    specifications: {
      'Model': 'DY-1102-S',
      'Stations': '2 (slide)',
      'Screw Diameter': 'Φ105 mm',
      'Max Injection Capacity': '9000 cm³/shot',
      'Clamping Force': '400 tons',
      'Injection Stroke': '700 mm',
      'Minimum Mould Thickness': '200 mm',
      'Left-Right Mould Opening Stroke': '850 mm',
      'Ejector Stroke': '350 mm',
      'Max Mould Dimension': '700 × 600 × 470 mm',
      'Average Power': '35 kW',
      'Machine Dimension': '5.0 × 5.7 × 3.2 m',
      'Machine Weight': '14.6 tons',
      'Oil Capacity': '500 L',
    },
    applications: [
      'Barbell weight plates',
      'Dumbbells (cast iron with rubber coating)',
      'Automotive seat cushions',
      'Heavy industrial moulded parts',
      'Fitness equipment OEM production',
    ],
    mainImage: img('dy-1102.png'),
    gallery: [],
  },

  {
    slug: 'industrial-parts-six-station-machine',
    modelSlug: 'dy-1106-s',
    model: 'DY-1106-S',
    name: 'Fully Automatic Six-Station Water-Cooled Disc Industrial Injection Moulding Machine — 400T',
    category: 'industrial',
    shortDescription:
      'Heavy-duty 6-station rotary disc industrial press with 400-ton clamping force, water-cooling, and 9000cc injection capacity. Higher-output sister to DY-1102-S. Purpose-built for dumbbells, barbell plates, automotive seat cushions, and other heavy industrial moulded parts.',
    features: [
      '6 stations rotary disc',
      'Heavy 400-ton clamping force',
      'Massive 9000 cm³/shot injection capacity',
      'Large Φ105 screw diameter',
      'Central water-cooling system — fast cooling',
      'Full electro-hydraulic servo system — fast response, energy saving',
      'Electronic ruler for precise material measurement',
      'Full automatic PLC computer control',
      'Brand-new automatic mould opening structure',
      'Materials: PVC / TPE / TPR / TPU and other thermoplastics',
      'Servo system saves 30%+ electricity',
    ],
    specifications: {
      'Model': 'DY-1106-S',
      'Stations': '6 (rotary disc)',
      'Screw Diameter': 'Φ105 mm',
      'Max Injection Capacity': '9000 cm³/shot',
      'Clamping Force': '400 tons',
      'Injection Stroke': '700 mm',
      'Minimum Mould Thickness': '200 mm',
      'Ejector Stroke': '350 mm',
      'Max Mould Dimension': '650 × 600 × 470 mm',
      'Average Power': '35 kW',
      'Machine Dimension': '7.2 × 4.0 × 3.2 m',
      'Machine Weight': '18 tons',
      'Oil Capacity': '500 L',
    },
    applications: [
      'Barbell weight plates',
      'Dumbbells (rubber-coated)',
      'Automotive seat cushions',
      'Heavy industrial moulded parts',
      'Fitness equipment OEM',
      'Higher-volume industrial production',
    ],
    mainImage: img('dy-1106h.jpg'),
    gallery: [],
    youtubeShortsId: 'RURcmgsGn1c',
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
  'industrial': 'Industrial Heavy-Duty Machines',
};
