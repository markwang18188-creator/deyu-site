import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const FACTORY_HERO_IMAGE = '/factory-exterior.jpg';

export default async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-16 lg:py-24 overflow-hidden">
      {/* 动态网格背景 */}
      <div className="absolute inset-0 bg-industrial-grid animate-grid-shift opacity-60" />

      {/* 大色斑动效 (顶部右侧 + 底部左侧) */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-screen blur-3xl animate-blob" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-orange-500/15 rounded-full mix-blend-screen blur-3xl animate-blob" style={{ animationDelay: '5s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: copy */}
          <div>
            <div className="flex flex-wrap gap-3 mb-6 animate-fade-up">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {t('badge_iso')}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                {t('badge_ce')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
              {t('title')}
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed animate-fade-up-delay-2">
              {t('subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up-delay-3">
              <Link
                href="/contact"
                className="shine-on-hover bg-[#c2410c] hover:bg-[#9a3412] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-900/40 text-white font-semibold px-7 py-3.5 rounded-md transition-all duration-300 text-base"
              >
                {t('cta_quote')}
              </Link>
              <Link
                href="/products"
                className="border-2 border-white/50 hover:border-white hover:bg-white/10 hover:-translate-y-0.5 text-white font-semibold px-7 py-3.5 rounded-md transition-all duration-300 text-base"
              >
                {t('cta_browse')}
              </Link>
            </div>
          </div>

          {/* Right: factory image with cinematic frame */}
          <div className="relative lg:order-last animate-fade-in">
            {/* 装饰光晕 */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/20 via-transparent to-orange-400/20 rounded-3xl blur-2xl" />
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 group">
              <Image
                src={FACTORY_HERO_IMAGE}
                alt="DEYU factory in Wenzhou, China"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
              />
              {/* 渐变叠加 */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/50 via-transparent to-transparent" />
              {/* 装饰角标 */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide">
                🏭 WENZHOU, CHINA
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/20 pt-10">
          {(
            [
              ['stat_years', 'stat_years_sub'],
              ['stat_countries', 'stat_countries_sub'],
              ['stat_models', 'stat_models_sub'],
              ['stat_certified', 'stat_certified_sub'],
            ] as const
          ).map(([valKey, labKey], i) => (
            <div
              key={valKey}
              className="animate-fade-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="text-2xl lg:text-3xl font-bold text-white">{t(valKey)}</div>
              <div className="text-sm text-blue-200 mt-1">{t(labKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
