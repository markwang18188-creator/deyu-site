import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import TrustCountriesMarquee from '@/components/sections/TrustCountriesMarquee';
import ProductCategoryGrid from '@/components/sections/ProductCategoryGrid';
import CtaSection from '@/components/sections/CtaSection';
import { buildAlternates } from '@/lib/metadata';

export function generateMetadata(): Metadata {
  return {
    title: 'Shoe Sole Injection Moulding Machine Manufacturer | DEYU Wenzhou China',
    description:
      'Leading shoe sole injection moulding machine manufacturer in Wenzhou, China. 15+ years experience, ISO 9001 & CE certified. TPU, PVC, dual-color sole machines for global markets. Get a quote today.',
    alternates: buildAlternates('/'),
    openGraph: {
      title: 'DEYU – Shoe Sole Injection Moulding Machines',
      description:
        'Wenzhou DEYU Machinery: TPU, PVC & dual-color sole injection machines. CE certified, exported to 15+ countries. Request a quote.',
      url: 'https://deyusolemachine.com',
      siteName: 'DEYU Shoe Machinery',
      type: 'website',
    },
  };
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://deyusolemachine.com/#organization',
  name: 'Wenzhou Deyu Machinery Co., Ltd',
  alternateName: ['DEYU', 'DEYU Machinery', '温州德宇机械'],
  url: 'https://deyusolemachine.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://deyusolemachine.com/deyu-logo.png',
    width: 975,
    height: 507,
  },
  image: 'https://deyusolemachine.com/og-image.png',
  description:
    'Leading shoe sole injection moulding machine manufacturer in Wenzhou, China. 15+ years of experience, ISO 9001 & CE certified, exported to 30+ countries.',
  foundingDate: '2009',
  foundingLocation: {
    '@type': 'Place',
    name: 'Wenzhou, Zhejiang, China',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Wenzhou',
    addressRegion: 'Zhejiang',
    addressCountry: 'CN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+86-136-1577-8781',
      contactType: 'sales',
      availableLanguage: ['English', 'Spanish', 'Portuguese', 'Turkish', 'Arabic', 'Chinese'],
      areaServed: ['IN', 'BR', 'TR', 'EG', 'NG', 'AR', 'CO', 'VE', 'PE', 'MX', 'KE', 'ET'],
    },
    {
      '@type': 'ContactPoint',
      email: 'info@wzdeyu.cn',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  ],
  knowsAbout: [
    'Shoe Sole Injection Moulding',
    'PVC Sole Manufacturing',
    'TPU Sole Manufacturing',
    'TR Sole Manufacturing',
    'Rotary Disc Sole Machines',
    'Footwear Machinery',
  ],
  sameAs: [
    'https://wzdeyu.cn',
    'https://www.facebook.com/profile.php?id=100092413230082',
    'https://www.youtube.com/@deyumachinery',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://deyusolemachine.com/#website',
  url: 'https://deyusolemachine.com',
  name: 'DEYU — Shoe Sole Injection Moulding Machines',
  inLanguage: ['en', 'es', 'pt', 'tr', 'ar'],
  publisher: { '@id': 'https://deyusolemachine.com/#organization' },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Hero />
      <TrustBar />
      <TrustCountriesMarquee />
      <ProductCategoryGrid />
      <CtaSection />
    </>
  );
}
