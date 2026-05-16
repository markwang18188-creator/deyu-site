import type { MetadataRoute } from 'next';
import { products } from '@/data/products';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/', '/products', '/about', '/contact'];

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

  return [...staticEntries, ...productEntries];
}
