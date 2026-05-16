import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              {t('badge_iso')}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-blue-300 rounded-full" />
              {t('badge_ce')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="bg-[#ea580c] hover:bg-orange-700 text-white font-semibold px-7 py-3.5 rounded-md transition-colors text-base"
            >
              {t('cta_quote')}
            </Link>
            <Link
              href="/products"
              className="border-2 border-white/50 hover:border-white text-white font-semibold px-7 py-3.5 rounded-md transition-colors text-base"
            >
              {t('cta_browse')}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/20 pt-10">
          {([
            ['stat_years', 'stat_years_sub'],
            ['stat_countries', 'stat_countries_sub'],
            ['stat_models', 'stat_models_sub'],
            ['stat_certified', 'stat_certified_sub'],
          ] as const).map(([valKey, labKey]) => (
            <div key={valKey}>
              <div className="text-2xl lg:text-3xl font-bold text-white">{t(valKey)}</div>
              <div className="text-sm text-blue-200 mt-1">{t(labKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
