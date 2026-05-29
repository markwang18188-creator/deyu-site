import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { getPreviewPostBySlug } from '@/lib/supabase/blog';
import ArticleView from '@/components/blog/ArticleView';
import CtaSection from '@/components/sections/CtaSection';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Draft preview',
  robots: { index: false, follow: false },
};

function authorized(key?: string): boolean {
  const secret = process.env.CONTENT_CRON_SECRET || process.env.CRON_SECRET;
  return !!secret && key === secret;
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;

  if (!authorized(key)) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-[#0f172a]">Draft preview</h1>
        <p className="mt-3 text-sm text-[#64748b]">
          Unauthorized. Append <code>?key=YOUR_SECRET</code> to the URL.
        </p>
      </main>
    );
  }

  const locale = await getLocale();
  const post = await getPreviewPostBySlug(slug, locale);
  if (!post) notFound();

  return (
    <>
      <ArticleView post={post} preview />
      <CtaSection />
    </>
  );
}
