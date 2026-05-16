import Link from 'next/link';

const categories = [
  {
    title: 'Single Color Machines',
    slug: 'single-color',
    description: 'PVC, TPR and TPU single-color sole machines. Up to 20 stations, 180+ pairs/hour.',
    icon: '⚪',
    models: 'DY-1102 · DY-1106 · DY-1120A · DY-150',
    href: '/products?category=single-color',
  },
  {
    title: 'Dual Color Machines',
    slug: 'dual-color',
    description: 'TPU / TR dual-color rotary machines. Premium soles with clear color separation.',
    icon: '🔵',
    models: 'DY-2216TR/TPU · DY-2220A · DY-2212TPU/TR',
    href: '/products?category=dual-color',
  },
  {
    title: 'Multi Color Machines',
    slug: 'multi-color',
    description: '3–4 color rotary machines for complex designer soles and premium footwear.',
    icon: '🌈',
    models: 'DY-3220C · DY-3212B · DY-4212C',
    href: '/products?category=multi-color',
  },
  {
    title: 'Air Blowing Machines',
    slug: 'air-blowing',
    description: 'Lightweight slipper and sandal sole production with air-blowing injection.',
    icon: '💨',
    models: 'DY-1124B · DY-2224B · DY-3124C',
    href: '/products?category=air-blowing',
  },
  {
    title: 'Industrial Parts',
    slug: 'industrial',
    description: 'Adapted machines for dumbbells, weight plates, and automotive seat cushions.',
    icon: '🔩',
    models: 'DY-1106-S · DY-1102-S',
    href: '/products?category=industrial',
  },
  {
    title: 'Supporting Equipment',
    slug: 'equipment',
    description: 'Complete turnkey factory solutions: mixers, dryers, crushers, compressors and more.',
    icon: '⚙️',
    models: 'Colour Mixer · Hopper Dryer · Crusher · Compressor',
    href: '/equipment',
  },
];

export default function ProductCategoryGrid() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
            Complete Sole Machine Range
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            From single-color economy machines to four-color premium lines — we have the right
            machine for every sole type and production volume.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="group border border-[#e2e8f0] rounded-lg p-6 hover:border-[#1e3a8a] hover:shadow-lg transition-all bg-white"
            >
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-semibold text-[#0f172a] mb-2 group-hover:text-[#1e3a8a] transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-[#64748b] mb-4 leading-relaxed">{cat.description}</p>
              <p className="text-xs text-[#94a3b8] font-mono">{cat.models}</p>
              <div className="mt-4 text-sm font-semibold text-[#3b82f6] group-hover:text-[#ea580c] transition-colors">
                View Models →
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white font-semibold px-8 py-3 rounded-md transition-colors"
          >
            View All 15+ Machine Models
          </Link>
        </div>
      </div>
    </section>
  );
}
