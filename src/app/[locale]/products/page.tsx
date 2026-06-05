import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { products, categoryLabels, type ProductCategory } from '@/data/products';
import CtaSection from '@/components/sections/CtaSection';
import ChatbotBanner from '@/components/sections/ChatbotBanner';
import { buildAlternates } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('productsPage');
  const locale = await getLocale();
  return {
    title: `${t('title')} | DEYU`,
    description: t('subtitle'),
    alternates: buildAlternates('/products', locale),
  };
}

const categoryKeys: ProductCategory[] = [
  'single-color', 'dual-color', 'multi-color', 'industrial', 'moulds',
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
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-industrial-grid animate-grid-shift opacity-50" />
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">{t('title')}</h1>
          <p className="text-blue-200 text-lg max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <section className="py-12 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <ChatbotBanner />
          </div>
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
                <div className="relative aspect-[4/3] bg-[#f8fafc] overflow-hidden">
                  <Image
                    src={product.mainImage}
                    alt={`${product.model} - ${product.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
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
