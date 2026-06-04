// Product images live in public/products/ — instant local dev + free Vercel edge delivery.
// Originals are also backed up in Supabase Storage (product-images bucket).
// When you replace an image, just overwrite the file in public/products/.
const img = (name: string) => `/products/${name}`;

export type ProductCategory =
  | 'single-color'
  | 'dual-color'
  | 'multi-color'
  | 'industrial'
  | 'moulds';

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
  /** Additional application videos — alternative use cases for the same machine.
   *  Rendered in an "Other Applications" section on the product page, below the main demo. */
  applicationVideos?: ApplicationVideo[];
  brochurePdfUrl?: string;
}

export interface ApplicationVideo {
  /** YouTube video ID (11-char, horizontal). */
  youtubeId: string;
  /** Short label, e.g. "TPU Luggage Handle Production". */
  label: string;
  /** Optional 1-2 sentence description shown under the embed. */
  description?: string;
}

/** Build a privacy-enhanced YouTube embed URL from an 11-char video ID. */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

/** Build a YouTube Shorts embed URL (standard /embed/ works — YouTube auto-detects 9:16). */
export function youtubeShortsEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}

/** Get a product's primary watchable video URL (YouTube preferred).
 *  Falls back to a Shorts embed when the product only has a Shorts upload —
 *  better to show *some* demo than none. */
export function productVideoEmbed(p: Product): string | undefined {
  if (p.youtubeId) return youtubeEmbedUrl(p.youtubeId);
  if (p.youtubeShortsId) return youtubeShortsEmbedUrl(p.youtubeShortsId);
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
    applicationVideos: [
      {
        youtubeId: 'jH8xowcRFqQ',
        label: 'TPU Luggage Handle Production',
        description:
          'The same DY-1102 chassis producing TPU luggage / suitcase handles — demonstrates the machine\'s flexibility beyond shoe sole production. Mould change is the only switch needed.',
      },
    ],
  },

  {
    slug: 'pvc-six-station-rotary-machine',
    modelSlug: 'dy-1106',
    model: 'DY-1106 / DY-1108 / DY-1112',
    name: 'Full Automatic Single-Color Rotary Sole Injection Moulding Machine — 80-100T (PVC / TPR / TPU)',
    category: 'single-color',
    shortDescription:
      'Medium-tonnage single-color rotary sole machine for PVC / TPR / TPU. One product family covering DY-1106 (6-station), DY-1108 (8-station) and DY-1112 (12-station) at 80-100T clamping. Up to 130 pairs/hour. Optional water-cooling.',
    features: [
      'Rotary disc — 6 / 8 / 12 station options (DY-1106 / 1108 / 1112)',
      'Medium clamping force: 80-100 tons',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Up to 130 pairs/hour',
      'Large Φ65 screw on the 12-station (DY-1112)',
      'Optional central water-cooling for faster mould cooling',
      'Computer-programmed digital control · servo energy-saving (saves 30%+)',
    ],
    specifications: {
      'Models': 'DY-1106 (6-station) · DY-1108 (8-station) · DY-1112 (12-station)',
      'Clamping Force': '80-100 tons',
      'Stations': '6 / 8 / 12',
      'Material': 'PVC / TPR / TPU',
      'Screw Diameter': 'Φ65 mm (DY-1112)',
      'Max Injection Capacity': '660 cm³/shot (DY-1112)',
      'Max Injection Pressure': '890 kg/cm² (DY-1112)',
      'Productivity': 'Up to 130 pairs/hour',
      'Cooling': 'Optional water-cooling',
      'Total Power': '31.5 kW',
    },
    applications: ['Men\'s shoe sets', 'Mid-volume PVC/TPR/TPU sole production', 'Casual & sports footwear', 'OEM production'],
    mainImage: img('dy-single-rotary-gooseneck-2.jpg'),
    gallery: [],
    youtubeId: 'ydUyUriENNc',
    youtubeShortsId: 'YBxiP73CjEY',
  },

  {
    slug: 'tr-tpu-150t-water-cooling-rotary-machine',
    modelSlug: 'dy-1112tr-tpu',
    model: 'DY-1106TR/TPU / DY-1112TR/TPU',
    name: 'Full Automatic Single-Color Water-Cooling Rotary Sole Machine — 150T (TR / TPU)',
    category: 'single-color',
    shortDescription:
      'Heavy 150T single-color water-cooling rotary sole machine for TR / TPU. Central water-cooling and automatic mould-opening, available in 6-station (DY-1106TR/TPU) or 6/12-station (DY-1112TR/TPU) configurations. 80-120 pairs/hour.',
    features: [
      'Heavy 150T clamping force — for TR / TPU foam and solid soles',
      'Configurations: DY-1106TR/TPU (6-station) · DY-1112TR/TPU (6 or 12 station)',
      'Central water-cooling — fast mould cooling',
      'Automatic mould-opening robotic arm — easy for any operator',
      'Materials: TR / TPU (foamed or solid)',
      'Servo energy-saving system — saves 30%+ electricity',
      'Compact integrated structure',
    ],
    specifications: {
      'Models': 'DY-1106TR/TPU (6-station) · DY-1112TR/TPU (6 or 12 station)',
      'Clamping Force': '150 tons',
      'Stations': '6 / 12',
      'Material': 'TR / TPU',
      'Screw Diameter': 'Φ50-55 mm',
      'Max Injection Capacity': '390-470 cm³/shot',
      'Max Injection Pressure': '1050-1300 kg/cm²',
      'Productivity': '80-120 pairs/hour',
      'Cooling': 'Central water-cooling',
      'Total Power': '33 kW',
      'Machine Weight': '6.5-8 tons (by configuration)',
    },
    applications: ['TR/TPU sports & athletic soles', 'Running & trail shoe soles', 'Outdoor footwear', 'High-performance soles'],
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
    category: 'dual-color',
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
    slug: 'compact-dual-color-tr-tpu-machine',
    modelSlug: 'dy-2112tr-tpu',
    model: 'DY-2112TR/TPU',
    name: 'Single-Head Two-Color TR/TPU Rotary Sole Injection Moulding Machine — DY-2112',
    category: 'dual-color',
    shortDescription:
      'Compact single-injection-head dual-color rotary machine for TR/TPU soles. 12-station rotary disc, 110-ton clamping, 80-100 pairs/hour. The most accessible entry into two-tone sole production.',
    features: [
      'Single injection head, dual-color output — compact footprint',
      '12-station rotary disc',
      'Clamping force: 110 tons',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Central water-cooling — efficient heat dissipation',
      'Automatic mould opening + clamping robotic arm — reduces operator labour',
      'Servo energy-saving system — saves 30%+ electricity',
      'Production: 80-100 pairs/hour',
    ],
    specifications: {
      'Model': 'DY-2112TR/TPU',
      'Work Stations': '12 (rotary disc)',
      'Configuration': 'Single injection head · dual-colour',
      'Clamping Force': '110 tons',
      'Material': 'PVC / TPR / TPU',
      'Screw Diameter': 'Φ50 / Φ50 mm',
      'Max Injection Capacity': '390 cm³/shot',
      'Max Injection Pressure': '1300 kg/cm²',
      'Productivity': '80-100 pairs/hour',
      'Mould Dimension': '500 × 340 × 170 mm',
      'Cooling': 'Central water-cooling',
      'Total Power': '33 kW',
      'Machine Weight': '7 tons',
      'Oil Capacity': '650 L',
    },
    applications: [
      'Dual-color casual & sports soles',
      'Entry-level two-tone sole production',
      'Medium-volume dual-color OEM',
      'Footwear factory dual-color line starter',
    ],
    mainImage: img('dy-2112.jpg'),
    gallery: [],
  },

  {
    slug: 'tpu-dual-color-injection-machine',
    modelSlug: 'dy-2216tr-tpu',
    model: 'DY-2212 / DY-2216',
    name: 'Full Automatic Rotary Dual-Head Two-Color TR/TPU Sole Injection Moulding Machine Series',
    category: 'dual-color',
    shortDescription:
      'Heavy-duty dual-head dual-color TR/TPU rotary sole machine family. DY-2212 (column-type 12-station 150T flagship) and DY-2216 (16-station 150T higher-output). 60-120 pairs/hour.',
    features: [
      'Two configurations: DY-2212 (column-type 12-station) · DY-2216 (16-station dual-head)',
      '150T heavy clamping force on both',
      '12 or 16 stations rotary disc',
      'Materials: TR / TPU (PVC / TPR also supported on DY-2216)',
      'Central water-cooling — rapid mould cooling',
      'External oil pump on DY-2212 — better heat dissipation, longer machine life',
      'Servo energy-saving system — saves 30%+ electricity',
      'Production: 60-120 pairs/hour by configuration',
    ],
    specifications: {
      'Models': 'DY-2212 (12-station column-type) · DY-2216 (16-station)',
      'Stations': '12 / 16',
      'Configuration': 'Dual injection head · dual-colour',
      'Clamping Force': '150 tons',
      'Material': 'TR / TPU (PVC / TPR on DY-2216)',
      'Screw Diameter': 'Φ55/Φ55',
      'Max Injection Capacity': '2×500 cm³/shot (DY-2212) · 2×470 cm³/shot (DY-2216)',
      'Max Injection Pressure': '1300/1300 (DY-2212) · 1050 (DY-2216)',
      'Productivity': '80-120 pairs/hour (DY-2212) · 60-80 pairs/hour (DY-2216)',
      'Cooling': 'Central water-cooling',
      'Total Power': '60-66 kW',
      'Machine Weight': '20 tons',
    },
    applications: ['Dual-color TR/TPU sports soles', 'Soccer cleat outsoles', 'Premium running shoe soles', 'Two-tone fashion soles', 'High-volume dual-color production'],
    mainImage: img('dy-2212t.jpg'),
    gallery: [],
    youtubeId: 'CXLqefs4EAk',
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
    model: 'DY-3208 / DY-3324',
    name: 'Full Automatic Rotary Three Color Sole Injection Moulding Machine Series (3 Heads)',
    category: 'multi-color',
    shortDescription:
      'Three-color rotary sole machine family with 3 independent injection heads. Configurations range from a compact 8-station entry (DY-3208, 80T) to a high-capacity 24-station flexible flagship (DY-3324) that can run 3-layer stacked soles, 3 single-color batches in parallel, or mixed runs. 150 pairs/hour.',
    features: [
      'Two configurations: DY-3208 (8 stations, 80T compact) · DY-3324 (24 stations, flexible high-capacity)',
      'Three independent injection heads (gooseneck on DY-3324)',
      'Flexible 3-color production: stacked layers, parallel single-color batches, or mixed',
      'Materials: PVC / TPR / TPU (foamed or non-foamed)',
      'Up to 150 pairs/hour by configuration',
      'Ideal for factories producing multiple sole styles',
    ],
    specifications: {
      'Models': 'DY-3208 (8-station compact) · DY-3324 (24-station flexible)',
      'Stations': '8 / 10 / 24',
      'Colors': '3 (independent heads, up to 3 layers on DY-3324)',
      'Clamping Force': '80 tons (DY-3208) · 55 tons (DY-3324)',
      'Screw Diameter': 'Φ50/Φ40/Φ40 (DY-3208) · Φ75/Φ65/Φ65 (DY-3324)',
      'Max Injection Capacity': '250/150 cm³/shot (DY-3208) · 880/660/660 cm³/shot (DY-3324)',
      'Max Injection Pressure': '890/660/660 kg/cm² (both)',
      'Productivity': '150 pairs/hour',
      'Material': 'PVC / TPR / TPU',
      'Total Power': '42 kW (DY-3208) · 90 kW (DY-3324)',
      'Machine Weight': '11 tons (DY-3208) · 19 tons (DY-3324)',
      'Oil Capacity': '800 × 3 L',
    },
    applications: [
      'Entry-level 3-color sole production (DY-3208)',
      'Three-color stacked sole production (DY-3324)',
      'Multiple single-color batches in parallel (DY-3324)',
      'Fashion footwear OEM with varied sole designs',
      'Children\'s & casual 3-color footwear',
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
    category: 'single-color',
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
    mainImage: img('dy-1124b-2.jpg'),
    gallery: [],
    youtubeId: 'lrGZTA-dOwc',
    youtubeShortsId: 'rS8-gVn3_4E',
  },

  {
    slug: 'dual-color-air-blowing-machine',
    modelSlug: 'dy-2224b',
    model: 'DY-2224B',
    name: 'Full Automatic Rotary Type Two Color Plastic Rubber Air Blowing Injection Moulding Machine',
    category: 'dual-color',
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
    category: 'multi-color',
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
    mainImage: img('dy-1102-h.jpg'),
    gallery: [],
    youtubeShortsId: 'ni0HpHWiJ6U',
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

  // ═══════════════════════════════════════════════════════════════
  // SHOE SOLE MOULDS  —  Phase 7 seed entries
  // ───────────────────────────────────────────────────────────────
  // Sub-types are tracked in specifications['Mould Type'] rather than
  // separate categories. TODO placeholders flag fields awaiting Mark's
  // input (material grade, cavity counts, photos, lead time).
  // ═══════════════════════════════════════════════════════════════

  {
    slug: 'tpu-sole-mould-rotary',
    modelSlug: 'mould-tpu-rotary',
    model: 'DEYU TPU Rotary Sole Mould',
    name: 'TPU Sole Mould for Rotary Disc Injection Machines',
    category: 'moulds',
    shortDescription:
      'CNC-machined TPU sole mould compatible with rotary disc injection machines (DY-1106 / DY-1108 / DY-1112 / DY-1120 platforms). Multi-cavity configurations available. Steel construction with hard-chrome plating for long production life.',
    features: [
      'CNC-machined for precise sole detail',
      'Hard-chrome plated cavity surface (corrosion-resistant)',
      'Quick-change clamping standard',
      'Compatible with single-color rotary machines',
      'Mould material: TODO (Mark to confirm — P20 / S136 / NAK80)',
      'Cavity count: TODO (typical 2-6 cavities)',
    ],
    specifications: {
      'Mould Type': 'Rotary Disc / Single-Color',
      'Compatible Machine Class': 'DY-1106 / DY-1108 / DY-1112 / DY-1120',
      'Material': 'TODO — confirm steel grade',
      'Cavity Count': 'TODO',
      'Shoe Size Range': 'TODO (e.g. EUR 36-46)',
      'Surface Treatment': 'TODO — hard chrome / nitriding / etc.',
      'Lead Time': 'TODO',
    },
    applications: [
      'TPU sole production',
      'Sports shoe soles',
      'Casual footwear soles',
      'OEM/ODM brand production',
      'Sample mould development',
    ],
    mainImage: img('moulds/placeholder.svg'),
    gallery: [],
  },

  {
    slug: 'one-piece-shoe-mould',
    modelSlug: 'mould-one-piece',
    model: 'DEYU One-Piece Shoe Mould',
    name: 'One-Mould-One-Shoe Injection Mould (一模一只)',
    category: 'moulds',
    shortDescription:
      'Integrated one-piece shoe mould producing a complete shoe in a single injection cycle. Designed for slipper, sandal and casual one-piece footwear lines. Reduces assembly steps versus separate sole + upper production.',
    features: [
      'Single-shot full-shoe moulding',
      'Eliminates separate sole-to-upper bonding step',
      'CNC-machined cavity for shoe-shape precision',
      'Cooling-channel optimized for cycle time',
      'Mould material: TODO (Mark to confirm)',
      'Suitable for slipper, beach sandal, casual one-piece designs',
    ],
    specifications: {
      'Mould Type': 'One-Piece / Integrated Shoe',
      'Compatible Machine Class': 'TODO — confirm with Mark (slide or vertical platforms)',
      'Material': 'TODO',
      'Cavity Count': 'Typically 1-2 cavities',
      'Shoe Size Range': 'TODO',
      'Mould Material Compatibility': 'PVC / TPR / EVA / TPU',
      'Surface Treatment': 'TODO',
      'Lead Time': 'TODO',
    },
    applications: [
      'One-piece slippers',
      'Beach sandals',
      'Casual one-piece footwear',
      'Indoor slippers (hotel / hospital)',
      'EVA / PVC integrated shoe production',
    ],
    mainImage: img('moulds/placeholder.svg'),
    gallery: [],
  },

  {
    slug: 'vertical-injection-sole-mould',
    modelSlug: 'mould-vertical',
    model: 'DEYU Vertical Sole Mould',
    name: 'Vertical Injection Sole Mould (立式)',
    category: 'moulds',
    shortDescription:
      'Sole mould designed for vertical-layout injection machines (DY-150 class). Compact mould footprint, optimised for TR/TPU sample-to-small-batch production. Ideal for shoe brands testing new sole designs.',
    features: [
      'Compact mould design — fits vertical platform clamping',
      'Optimised for TR / TPU materials',
      'Quick mould-change interface',
      'CNC-machined cavity for clean release',
      'Mould material: TODO',
      'Best for sample making, R&D, low-volume runs',
    ],
    specifications: {
      'Mould Type': 'Vertical / Single or Two-Color',
      'Compatible Machine Class': 'DY-150 (vertical) and similar',
      'Material': 'TODO',
      'Cavity Count': 'TODO (typically 1-2 cavities)',
      'Shoe Size Range': 'TODO',
      'Mould Material Compatibility': 'TR / TPU / TPR',
      'Surface Treatment': 'TODO',
      'Lead Time': 'TODO',
    },
    applications: [
      'TR / TPU sole sampling',
      'R&D sole prototyping',
      'Small-batch premium sole production',
      'Vertical-machine factories',
    ],
    mainImage: img('moulds/placeholder.svg'),
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
  'industrial': 'Industrial Heavy-Duty Machines',
  'moulds': 'Shoe Sole Moulds',
};

// ─────────────────────────────────────────────────────────────────────────
// Localisation
//
// English remains the canonical source — `products` above. Translations live
// as flat JSON files under `src/data/translations/products.<locale>.json`,
// keyed by product slug. Each per-slug entry may include any subset of the
// translatable fields; missing fields automatically fall back to English so
// a partially-translated entry never breaks a product page.
//
// Why JSON instead of inline TS? Translation drafts come from one-shot
// scripts (DeepSeek) and we want them reviewable / hand-editable without
// touching the canonical TS file. Keeps source-of-truth English copy
// untouched even when the ES file is rewritten.
// ─────────────────────────────────────────────────────────────────────────

import productsEs from './translations/products.es.json';

interface ProductTranslation {
  name?: string;
  shortDescription?: string;
  features?: string[];
  applications?: string[];
  /** Spec *labels* only — values stay English (numeric ranges, units). */
  specLabels?: Record<string, string>;
}

const TRANSLATIONS: Record<string, Record<string, ProductTranslation>> = {
  es: productsEs as Record<string, ProductTranslation>,
};

/**
 * Return a copy of the product with translated fields merged in for the
 * given locale. Falls back to the English source per-field — never returns
 * undefined on a translatable field. English (`en`) returns the canonical
 * product as-is.
 */
export function getLocalizedProduct(
  slug: string,
  locale: string
): Product | undefined {
  const source = getProductBySlug(slug);
  if (!source) return undefined;
  if (locale === 'en') return source;

  const dict = TRANSLATIONS[locale];
  if (!dict) return source;
  const t = dict[source.slug] ?? dict[source.modelSlug ?? ''] ?? {};

  const specifications: Record<string, string> = {};
  for (const [k, v] of Object.entries(source.specifications)) {
    const localKey = t.specLabels?.[k] ?? k;
    specifications[localKey] = v;
  }

  return {
    ...source,
    name: t.name ?? source.name,
    shortDescription: t.shortDescription ?? source.shortDescription,
    features: t.features?.length ? t.features : source.features,
    applications: t.applications?.length ? t.applications : source.applications,
    specifications,
  };
}
