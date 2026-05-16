import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
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

      <section className="py-16 bg-[#f1f5f9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Coming soon notice */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-10 text-center mb-12">
            <div className="text-5xl mb-6">📋</div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-4">{t('coming_soon_title')}</h2>
            <p className="text-[#475569] max-w-xl mx-auto mb-8">{t('coming_soon_desc')}</p>
            <Link
              href="/contact"
              className="inline-block bg-[#ea580c] hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Contact Us to Learn More
            </Link>
          </div>

          {/* Markets served */}
          <h2 className="text-xl font-bold text-[#0f172a] mb-6">Where Our Machines Are Running</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {markets.map((m) => (
              <div
                key={m.region}
                className="bg-white border border-[#e2e8f0] rounded-lg p-5 text-center"
              >
                <div className="text-3xl mb-3">{m.icon}</div>
                <h3 className="font-semibold text-[#0f172a] text-sm mb-1">{m.region}</h3>
                <p className="text-xs text-[#64748b]">{m.countries}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
