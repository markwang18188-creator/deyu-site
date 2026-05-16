import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { getAllPublishedSlugs } from '@/lib/supabase/blog';

const BASE = 'https://deyusolemachine.com';
const LOCALES = ['en', 'es', 'pt', 'tr', 'ar'] as const;

function url(locale: string, path: string) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${BASE}${prefix}${path}`;
}

function allLocales(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = url(locale, path);
  languages['x-default'] = url('en', path);
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['/', '/products', '/about', '/contact', '/blog', '/cases'];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: url(locale, path),
      lastModified: new Date(),
      changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1.0 : path === '/products' ? 0.9 : 0.7,
      alternates: { languages: allLocales(path) },
    }))
  );

  const productEntries: MetadataRoute.Sitemap = products.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: url(locale, `/products/${p.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: allLocales(`/products/${p.slug}`) },
    }))
  );

  const blogSlugs = await getAllPublishedSlugs();
  const blogSeen = new Set<string>();
  const blogEntries: MetadataRoute.Sitemap = blogSlugs
    .filter(({ slug }) => {
      if (blogSeen.has(slug)) return false;
      blogSeen.add(slug);
      return true;
    })
    .map(({ slug }) => ({
      url: url('en', `/blog/${slug}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: allLocales(`/blog/${slug}`) },
    }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
