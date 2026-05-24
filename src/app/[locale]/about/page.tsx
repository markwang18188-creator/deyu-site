import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import CtaSection from '@/components/sections/CtaSection';
import FadeIn from '@/components/ui/FadeIn';
import { buildAlternates } from '@/lib/metadata';

// Local public/factory/ — instant load + Vercel edge delivery.
// Backup originals in Supabase Storage (product-images/factory).
const FACTORY_BUCKET = '/factory';

const factoryHighlights = [
  { src: `${FACTORY_BUCKET}/factory-exterior.jpg`, caption: 'Wenzhou Factory' },
  { src: `${FACTORY_BUCKET}/workshop-01.jpg`, caption: 'Assembly Workshop' },
  { src: `${FACTORY_BUCKET}/workshop-02.jpg`, caption: 'Production Line' },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return {
    title: `${t('title')} | DEYU`,
    description: t('subtitle'),
    alternates: buildAlternates('/about'),
  };
}

const milestoneYears = ['2009','2011','2014','2016','2019','2024'] as const;

export default async function AboutPage() {
  const t = await getTranslations('about');

  const stats = [
    { value: '15+', label: t('stat_years_label') },
    { value: '15', label: t('stat_countries_label') },
    { value: '18+', label: t('stat_models_label') },
    { value: '100%', label: t('stat_factory_label') },
  ];

  return (
    <>
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-industrial-grid animate-grid-shift opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
          </FadeIn>
        </div>
      </div>

      <section className="py-12 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] bg-clip-text text-transparent mb-2">
                  {s.value}
                </div>
                <div className="text-sm text-[#64748b]">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-6">{t('story_title')}</h2>
          <div className="text-[#475569] space-y-4 text-base leading-relaxed">
            <p>{t('story_p1')}</p>
            <p>{t('story_p2')}</p>
            <p>{t('story_p3')}</p>
            <p>{t('story_p4')}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f1f5f9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-10 text-center">
            {t('milestones_title')}
          </h2>
          <div className="space-y-6">
            {milestoneYears.map((year) => (
              <div key={year} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-[#1e3a8a] font-bold text-sm">{year}</span>
                </div>
                <div className="flex-shrink-0 w-px bg-[#e2e8f0] self-stretch relative">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e3a8a] rounded-full" />
                </div>
                <div className="pb-6">
                  <p className="text-[#334155] text-sm leading-relaxed">
                    {t(`milestone_${year}` as 'milestone_2009')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Factory */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-3">Our Factory</h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              Based in Wenzhou — the footwear machinery capital of China — our facility produces
              shoe-sole injection moulding machines for customers across 30+ countries.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {factoryHighlights.map((f, i) => (
              <FadeIn key={f.src} delay={i * 0.1}>
                <div className="group">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#f1f5f9] shadow-md hover:shadow-2xl transition-shadow duration-300">
                    <Image
                      src={f.src}
                      alt={`DEYU factory — ${f.caption}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#334155] text-center">{f.caption}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f1f5f9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-4">{t('certs_title')}</h2>
          <p className="text-[#64748b] mb-10">{t('certs_subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-6">
            {['ISO 9001:2000', 'CE Certified'].map((cert, i) => (
              <FadeIn key={cert} delay={i * 0.1}>
                <div className="group bg-white border border-[#e2e8f0] rounded-2xl px-12 py-8 flex flex-col items-center gap-3 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🏆</div>
                  <div className="font-bold text-[#0f172a] text-lg">{cert}</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] mt-6">{t('certs_coming_soon')}</p>
        </div>
      </section>

      <CtaSection title={t('cta_title')} subtitle={t('cta_subtitle')} />
    </>
  );
}
