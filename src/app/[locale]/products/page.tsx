import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { products, categoryLabels, type ProductCategory } from '@/data/products';
import CtaSection from '@/components/sections/CtaSection';
import { buildAlternates } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('productsPage');
  return {
    title: `${t('title')} | DEYU`,
    description: t('subtitle'),
    alternates: buildAlternates('/products'),
  };
}

const categoryKeys: ProductCategory[] = [
  'single-color', 'dual-color', 'multi-color', 'air-blowing', 'industrial',
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const t = await getTranslations('productsPage');
  const { category } = await searchParams;
  const activeCategory = category as ProductCategory | undefined;
  const filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <>
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">{t('title')}</h1>
          <p className="text-blue-200 text-lg max-w-2xl">{t('subtitle')}</p>
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
              {t('all_machines')}
            </Link>
            {categoryKeys.map((key) => (
              <Link
                key={key}
                href={`/products?category=${key}` as '/products'}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === key
                    ? 'bg-[#1e3a8a] text-white'
                    : 'bg-white text-[#334155] border border-[#e2e8f0] hover:border-[#1e3a8a]'
                }`}
              >
                {categoryLabels[key]}
              </Link>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}` as '/products'}
                className="group bg-white rounded-lg border border-[#e2e8f0] hover:border-[#1e3a8a] hover:shadow-lg transition-all overflow-hidden"
              >
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
                    {t('view_details')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
