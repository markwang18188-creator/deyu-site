import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import ProductCategoryGrid from '@/components/sections/ProductCategoryGrid';
import WhyDeyu from '@/components/sections/WhyDeyu';
import GlobalMap from '@/components/sections/GlobalMap';
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
  name: 'Wenzhou Deyu Machinery Co., Ltd',
  alternateName: 'DEYU',
  url: 'https://deyusolemachine.com',
  description:
    'Leading shoe sole injection moulding machine manufacturer in Wenzhou, China. 15+ years of experience, exported to 15+ countries.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Wenzhou',
    addressRegion: 'Zhejiang',
    addressCountry: 'CN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+86-136-1577-8781',
    contactType: 'sales',
    availableLanguage: ['English', 'Chinese'],
  },
  sameAs: ['https://deyusolemachine.com'],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Hero />
      <TrustBar />
      <ProductCategoryGrid />
      <WhyDeyu />
      <GlobalMap />
      <CtaSection />
    </>
  );
}
