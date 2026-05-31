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

/** For blog posts: only emit alternates the database actually has. Lying to
 *  Google about which locales we serve is worse than offering fewer — it leads
 *  to 404 alternates which kill SEO trust. */
function existingLocaleLanguages(path: string, locales: string[]) {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = url(locale, path);
  // x-default always points at English — the canonical source of truth.
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

  // Product pages: we ship localised marketing copy + spec labels for every
  // locale we have a translation file for. The data-helper falls back to
  // English per-field, so every locale URL technically renders content —
  // sitemap-wise we still advertise all locales.
  const productEntries: MetadataRoute.Sitemap = products.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: url(locale, `/products/${p.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: allLocales(`/products/${p.slug}`) },
    }))
  );

  // ── Blog: per-slug, only emit locales where a published row exists ──────
  const blogSlugs = await getAllPublishedSlugs();
  const slugToLocales = new Map<string, string[]>();
  for (const { slug, language } of blogSlugs) {
    const arr = slugToLocales.get(slug) ?? [];
    if (!arr.includes(language)) arr.push(language);
    slugToLocales.set(slug, arr);
  }

  const blogEntries: MetadataRoute.Sitemap = [];
  for (const [slug, locales] of slugToLocales) {
    const path = `/blog/${slug}`;
    const altLangs = existingLocaleLanguages(path, locales);
    for (const locale of locales) {
      blogEntries.push({
        url: url(locale, path),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: { languages: altLangs },
      });
    }
  }

  return [...staticEntries, ...productEntries, ...blogEntries];
}
