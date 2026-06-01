import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { products, getLocalizedProduct, categoryLabels, productVideoEmbed } from '@/data/products';
import CtaSection from '@/components/sections/CtaSection';
import ChatbotBanner from '@/components/sections/ChatbotBanner';
import ProductMediaSwitcher from '@/components/product/ProductMediaSwitcher';
import WhatsAppLink from '@/components/analytics/WhatsAppLink';
import { buildAlternates } from '@/lib/metadata';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = getLocalizedProduct(slug, locale);
  if (!product) return {};
  return {
    title: `${product.name} | ${product.model} | DEYU`,
    description: `${product.shortDescription} CE certified. Contact DEYU for pricing and specifications.`,
    alternates: buildAlternates(`/products/${slug}`),
    openGraph: {
      title: `${product.name} | DEYU`,
      description: product.shortDescription,
      url: `https://deyusolemachine.com/products/${slug}`,
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const product = getLocalizedProduct(slug, locale);
  if (!product) notFound();

  const t = await getTranslations('productDetail');

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    model: product.model,
    brand: { '@type': 'Brand', name: 'DEYU' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Wenzhou Deyu Machinery Co., Ltd',
      url: 'https://deyusolemachine.com',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      seller: { '@type': 'Organization', name: 'Wenzhou Deyu Machinery Co., Ltd' },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://deyusolemachine.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://deyusolemachine.com/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://deyusolemachine.com/products/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Breadcrumb */}
      <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-[#64748b]">
            <Link href="/" className="hover:text-[#1e3a8a]">{t('breadcrumb_home')}</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-[#1e3a8a]">{t('breadcrumb_products')}</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category}` as '/products'} className="hover:text-[#1e3a8a]">
              {categoryLabels[product.category]}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#0f172a] font-medium">{product.model}</span>
          </nav>
        </div>
      </div>

      {/* Product hero */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Product main media — image + demo video in one frame, tab-switchable */}
            <ProductMediaSwitcher
              image={product.mainImage}
              alt={`${product.model} - ${product.name}`}
              videoEmbedUrl={productVideoEmbed(product)}
              videoYoutubeId={product.youtubeId ?? product.youtubeShortsId ?? null}
              videoTitle={`${product.model} demonstration video`}
            />

            {/* Info */}
            <div>
              <span className="inline-block text-xs font-semibold text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full mb-4">
                {categoryLabels[product.category]}
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-[#475569] text-lg mb-6 leading-relaxed">
                {product.shortDescription}
              </p>

              <ul className="space-y-2 mb-8">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[#334155]">
                    <svg className="w-5 h-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <WhatsAppLink
                  location="product_detail"
                  machine={product.slug}
                  className="bg-[#075E54] hover:bg-[#054640] text-white font-semibold px-6 py-3 rounded-md transition-colors flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t('whatsapp_enquiry')}
                </WhatsAppLink>
                <Link
                  href="/contact"
                  className="bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  {t('send_enquiry')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot banner */}
      <section className="bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChatbotBanner />
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">{t('specifications')}</h2>
              <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                        <td className="px-5 py-3 font-medium text-[#334155] w-1/2 border-b border-[#e2e8f0]">
                          {key}
                        </td>
                        <td className="px-5 py-3 text-[#64748b] border-b border-[#e2e8f0]">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0f172a] mb-6">{t('applications')}</h2>
              <div className="flex flex-wrap gap-3">
                {product.applications.map((app) => (
                  <span
                    key={app}
                    className="bg-white border border-[#e2e8f0] text-[#334155] text-sm font-medium px-4 py-2 rounded-lg"
                  >
                    {app}
                  </span>
                ))}
              </div>

              <div className="mt-10 p-6 bg-[#1e3a8a] rounded-xl text-white">
                <h3 className="font-bold text-lg mb-2">{t('datasheet_title')}</h3>
                <p className="text-blue-200 text-sm mb-4">
                  {t('datasheet_desc')} {product.model}.
                </p>
                <Link
                  href={`/contact?machine=${product.slug}` as '/contact'}
                  className="inline-block bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold px-5 py-2.5 rounded-md transition-colors text-sm"
                >
                  {t('datasheet_cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VideoObject Schema for SEO — video itself now lives in the media
          switcher at the top of the page, so no visible section here. */}
      {product.youtubeId && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              name: `${product.model} — ${product.name}`,
              description: product.shortDescription,
              thumbnailUrl: `https://i.ytimg.com/vi/${product.youtubeId}/maxresdefault.jpg`,
              uploadDate: product.videoUploadDate || '2026-01-01',
              embedUrl: productVideoEmbed(product),
              contentUrl: `https://www.youtube.com/watch?v=${product.youtubeId}`,
              publisher: {
                '@type': 'Organization',
                name: 'Wenzhou Deyu Machinery Co., Ltd',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://deyusolemachine.com/deyu-logo.png',
                },
              },
            }),
          }}
        />
      )}

      <CtaSection />
    </>
  );
}
