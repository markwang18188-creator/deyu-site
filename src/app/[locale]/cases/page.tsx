import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/lib/metadata';
import CtaSection from '@/components/sections/CtaSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cases');
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
    alternates: buildAlternates('/cases'),
  };
}

const BUCKET = 'https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/exhibitions';

const exhibitionImages = Array.from({ length: 19 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `${BUCKET}/exhibition-${num}.jpg`;
});

const markets = [
  { region: 'South America', countries: 'Brazil · Argentina · Colombia', icon: '🌎' },
  { region: 'Middle East & Africa', countries: 'Turkey · Egypt · Morocco · Nigeria', icon: '🌍' },
  { region: 'South Asia', countries: 'India · Pakistan · Bangladesh', icon: '🌏' },
  { region: 'Southeast Asia', countries: 'Vietnam · Indonesia', icon: '🌏' },
];

export default async function CasesPage() {
  const t = await getTranslations('cases');

  return (
    <>
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">{t('title')}</h1>
          <p className="text-blue-200 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      {/* Exhibition gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-3">
              Trade Shows & Customer Visits
            </h2>
            <p className="text-[#475569]">
              DEYU machines are trusted by footwear manufacturers worldwide. From international
              exhibitions to on-site customer installations, here&apos;s a glimpse of our work in action.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {exhibitionImages.map((src, idx) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-[#f1f5f9] rounded-lg overflow-hidden block"
              >
                <Image
                  src={src}
                  alt={`DEYU exhibition and customer photo ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to enlarge
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Global markets */}
      <section className="py-16 bg-[#f1f5f9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-3 text-center">
            Where Our Machines Are Running
          </h2>
          <p className="text-[#475569] text-center mb-10 max-w-2xl mx-auto">
            Exporting to 30+ countries across four continents.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {markets.map((m) => (
              <div
                key={m.region}
                className="bg-white border border-[#e2e8f0] rounded-lg p-6 text-center"
              >
                <div className="text-4xl mb-3">{m.icon}</div>
                <h3 className="font-semibold text-[#0f172a] text-sm mb-2">{m.region}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{m.countries}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
