import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { getPostBySlug, getAllPublishedSlugs } from '@/lib/supabase/blog';
import { buildAlternates } from '@/lib/metadata';
import CtaSection from '@/components/sections/CtaSection';
import ArticleView from '@/components/blog/ArticleView';

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

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  return (
    <>
      <ArticleView post={post} />
      <CtaSection />
    </>
  );
}
