import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import ProductCategoryGrid from '@/components/sections/ProductCategoryGrid';
import WhyDeyu from '@/components/sections/WhyDeyu';
import GlobalMap from '@/components/sections/GlobalMap';
import CtaSection from '@/components/sections/CtaSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProductCategoryGrid />
      <WhyDeyu />
      <GlobalMap />
      <CtaSection />
    </>
  );
}
