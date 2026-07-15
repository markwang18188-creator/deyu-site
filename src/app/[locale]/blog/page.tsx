import type { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPublishedPosts } from '@/lib/supabase/blog';
import { buildAlternates } from '@/lib/metadata';
import CtaSection from '@/components/sections/CtaSection';
import { ArrowRight, CalendarDays } from 'lucide-react';

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
  const [featuredPost, ...secondaryPosts] = posts;

  return (
    <>
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-14 overflow-hidden">
        <div className="absolute inset-0 bg-industrial-grid animate-grid-shift opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3 tracking-tight">{t('title')}</h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-2xl leading-relaxed">{t('subtitle')}</p>
        </div>
      </div>

      <section className="py-14 bg-[#f8fafc] min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-[#64748b] bg-white border border-[#e2e8f0] rounded-xl">
              <p className="text-lg font-medium">{t('no_posts')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {featuredPost && (
                <article className="bg-white border border-[#dbe3ef] rounded-xl overflow-hidden shadow-sm">
                  <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                    <Link
                      href={`/blog/${featuredPost.slug}` as '/blog/[slug]'}
                      className="block bg-[#e2e8f0] aspect-[16/10] lg:aspect-auto overflow-hidden"
                    >
                      {featuredPost.featured_image_url ? (
                        <img
                          src={featuredPost.featured_image_url}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]" />
                      )}
                    </Link>
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      {featuredPost.keywords?.[0] && (
                        <span className="w-fit text-xs font-bold uppercase tracking-[0.14em] text-[#c2410c] bg-orange-50 px-3 py-1 rounded-full mb-4">
                          {featuredPost.keywords[0]}
                        </span>
                      )}
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] leading-tight">
                        <Link href={`/blog/${featuredPost.slug}` as '/blog/[slug]'} className="hover:text-[#1e3a8a]">
                          {featuredPost.title}
                        </Link>
                      </h2>
                      {featuredPost.description && (
                        <p className="mt-4 text-[#475569] leading-relaxed">
                          {featuredPost.description}
                        </p>
                      )}
                      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#64748b]">
                        {featuredPost.published_at && (
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(featuredPost.published_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        <Link
                          href={`/blog/${featuredPost.slug}` as '/blog/[slug]'}
                          className="inline-flex items-center gap-2 font-semibold text-[#1e3a8a] hover:text-[#ea580c] transition-colors"
                        >
                          {t('read_more')}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {secondaryPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {secondaryPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group bg-white rounded-xl border border-[#e2e8f0] overflow-hidden hover:border-[#cbd5e1] hover:shadow-md transition-all"
                    >
                      <Link
                        href={`/blog/${post.slug}` as '/blog/[slug]'}
                        className="block aspect-[16/10] bg-[#e2e8f0] overflow-hidden"
                      >
                        {post.featured_image_url ? (
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]" />
                        )}
                      </Link>
                      <div className="p-5 flex min-h-[230px] flex-col">
                        {post.keywords?.[0] && (
                          <span className="w-fit text-[11px] font-bold uppercase tracking-[0.12em] text-[#c2410c] bg-orange-50 px-2.5 py-1 rounded-full mb-3">
                            {post.keywords[0]}
                          </span>
                        )}
                        <h2 className="text-lg font-bold text-[#0f172a] leading-snug">
                          <Link href={`/blog/${post.slug}` as '/blog/[slug]'} className="group-hover:text-[#1e3a8a]">
                            {post.title}
                          </Link>
                        </h2>
                        {post.description && (
                          <p className="mt-3 text-sm text-[#64748b] leading-relaxed line-clamp-3">
                            {post.description}
                          </p>
                        )}
                        <div className="mt-auto pt-5 flex items-center justify-between gap-4">
                          {post.published_at && (
                            <span className="text-xs text-[#94a3b8]">
                              {new Date(post.published_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                          <Link
                            href={`/blog/${post.slug}` as '/blog/[slug]'}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e3a8a] hover:text-[#ea580c] transition-colors"
                          >
                            {t('read_more')}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
