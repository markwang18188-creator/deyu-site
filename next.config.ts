import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lrlqtkaxakuobqrsotjl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // 301 redirects for legacy product slugs Google still has in its index.
  // Without these the old URLs return 404 / unhelpful redirects, hurting
  // crawl signal. Each entry maps an old slug → current canonical slug,
  // covering both the bare (en) path and every locale prefix.
  async redirects() {
    const slugMap: Record<string, string> = {
      // SC reported 2026-05-30:
      'three-color-eight-ten-station-machine': 'three-color-12-20-station-machine',
      'single-head-dual-color-tr-tpu-machine': 'compact-dual-color-tr-tpu-machine',
    };
    const locales = ['', '/es', '/pt', '/tr', '/ar'];
    const rules = [];
    for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
      for (const prefix of locales) {
        rules.push({
          source: `${prefix}/products/${oldSlug}`,
          destination: `${prefix}/products/${newSlug}`,
          permanent: true,
        });
      }
    }
    return rules;
  },
};

export default withNextIntl(nextConfig);
