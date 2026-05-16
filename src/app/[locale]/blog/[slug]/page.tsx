import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { getPostBySlug, getAllPublishedSlugs } from '@/lib/supabase/blog';
import { getProductBySlug } from '@/data/products';
import { buildAlternates } from '@/lib/metadata';
import CtaSection from '@/components/sections/CtaSection';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};

  return {
    title: `${post.title} | DEYU Blog`,
    description: post.description ?? undefined,
    alternates: buildAlternates(`/blog/${slug}`),
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('blog');

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const relatedProducts = (post.product_refs ?? [])
    .map((s) => getProductBySlug(s))
    .filter(Boolean);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.featured_image_url,
    datePublished: post.published_at,
    author: {
      '@type': 'Organization',
      name: 'Wenzhou Deyu Machinery Co., Ltd',
      url: 'https://deyusolemachine.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DEYU',
      url: 'https://deyusolemachine.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      {post.featured_image_url && (
        <div className="w-full aspect-[3/1] max-h-72 overflow-hidden">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] py-3">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-[#64748b]">
            <Link href="/" className="hover:text-[#1e3a8a]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-[#1e3a8a]">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-[#0f172a] font-medium">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            {post.keywords && post.keywords[0] && (
              <span className="text-xs font-semibold text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full mb-4 inline-block">
                {post.keywords[0]}
              </span>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mt-3 mb-4 leading-tight">
              {post.title}
            </h1>
            {post.published_at && (
              <p className="text-sm text-[#94a3b8]">
                {t('published')}{' '}
                {new Date(post.published_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
          </header>

          {/* MDX content */}
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-[#0f172a] prose-a:text-[#1e3a8a] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
            <MDXRemote source={post.body_mdx} />
          </div>

          <div className="mt-10">
            <Link
              href="/blog"
              className="text-sm font-semibold text-[#1e3a8a] hover:text-[#ea580c] transition-colors"
            >
              {t('back')}
            </Link>
          </div>
        </div>
      </article>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-[#f1f5f9] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[#0f172a] mb-6">{t('related_products')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => p && (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}` as '/products/[slug]'}
                  className="bg-white border border-[#e2e8f0] rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <p className="text-xs font-semibold text-[#ea580c] mb-1">{p.model}</p>
                  <p className="text-sm font-semibold text-[#0f172a] leading-snug">{p.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
