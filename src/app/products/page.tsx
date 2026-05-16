import type { Metadata } from 'next';
import Link from 'next/link';
import { products, categoryLabels, type ProductCategory } from '@/data/products';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'Shoe Sole Injection Moulding Machines | Full Product Range | DEYU',
  description:
    'Browse DEYU\'s complete range of shoe sole injection moulding machines: single color, dual color, multi color, air blowing and industrial parts machines. Factory direct from Wenzhou China.',
};

const categories: { key: ProductCategory; description: string }[] = [
  { key: 'single-color', description: 'PVC, TPR and TPU single-color sole machines. Up to 20 stations, 180+ pairs/hour.' },
  { key: 'dual-color', description: 'TPU / TR dual-color rotary machines with premium color separation.' },
  { key: 'multi-color', description: '3–4 color rotary machines for complex designer soles.' },
  { key: 'air-blowing', description: 'Lightweight slipper and sandal sole production.' },
  { key: 'industrial', description: 'Adapted machines for dumbbells, weight plates and automotive parts.' },
];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category as ProductCategory | undefined;
  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <>
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            Shoe Sole Injection Moulding Machines
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            15+ models covering single color, dual color, multi color, air blowing and industrial applications.
          </p>
        </div>
      </div>

      <section className="py-12 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !activeCategory
                  ? 'bg-[#1e3a8a] text-white'
                  : 'bg-white text-[#334155] border border-[#e2e8f0] hover:border-[#1e3a8a]'
              }`}
            >
              All Machines
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/products?category=${cat.key}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-[#1e3a8a] text-white'
                    : 'bg-white text-[#334155] border border-[#e2e8f0] hover:border-[#1e3a8a]'
                }`}
              >
                {categoryLabels[cat.key]}
              </Link>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-lg border border-[#e2e8f0] hover:border-[#1e3a8a] hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-[#e2e8f0] flex items-center justify-center">
                  <span className="text-[#94a3b8] text-sm font-mono">{product.model}</span>
                </div>
                <div className="p-5">
                  <span className="inline-block text-xs font-semibold text-[#ea580c] bg-orange-50 px-2 py-1 rounded mb-3">
                    {categoryLabels[product.category]}
                  </span>
                  <h2 className="text-base font-semibold text-[#0f172a] group-hover:text-[#1e3a8a] transition-colors mb-2 leading-snug line-clamp-2">
                    {product.name}
                  </h2>
                  <p className="text-sm text-[#64748b] line-clamp-2 mb-4">
                    {product.shortDescription}
                  </p>
                  <div className="text-sm font-semibold text-[#3b82f6] group-hover:text-[#ea580c] transition-colors">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Need Help Choosing the Right Machine?"
        subtitle="Tell us your sole type, material and target output — our engineers will recommend the best model and send a detailed quote."
      />
    </>
  );
}
