import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPublishedPosts } from '@/lib/supabase/blog';
import { buildAlternates } from '@/lib/metadata';
import CtaSection from '@/components/sections/CtaSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('blog');
  const locale = await getLocale();
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
    alternates: buildAlternates('/blog', locale),
  };
}

export default async function BlogPage() {
  const t = await getTranslations('blog');
  const locale = await getLocale();
  const posts = await getPublishedPosts(locale);

  return (
    <>
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-industrial-grid animate-grid-shift opacity-50" />
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">{t('title')}</h1>
          <p className="text-blue-200 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <section className="py-16 bg-[#f1f5f9] min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-[#64748b]">
              <div className="text-5xl mb-6">✍️</div>
              <p className="text-lg font-medium">{t('no_posts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.featured_image_url && (
                    <div className="aspect-[16/9] bg-[#e2e8f0] overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {!post.featured_image_url && (
                    <div className="aspect-[16/9] bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] flex items-center justify-center">
                      <span className="text-white text-4xl opacity-30">⚙️</span>
                    </div>
                  )}
                  <div className="p-6">
                    {post.keywords && post.keywords[0] && (
                      <span className="text-xs font-semibold text-[#ea580c] bg-orange-50 px-2 py-1 rounded-full mb-3 inline-block">
                        {post.keywords[0]}
                      </span>
                    )}
                    <h2 className="text-lg font-bold text-[#0f172a] mb-2 leading-snug">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-sm text-[#64748b] mb-4 leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {post.published_at && (
                        <span className="text-xs text-[#94a3b8]">
                          {t('published')}{' '}
                          {new Date(post.published_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <Link
                        href={`/blog/${post.slug}` as '/blog/[slug]'}
                        className="text-sm font-semibold text-[#1e3a8a] hover:text-[#ea580c] transition-colors"
                      >
                        {t('read_more')}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
