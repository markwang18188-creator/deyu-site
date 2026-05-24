import { getTranslations } from 'next-intl/server';
import FadeIn from '@/components/ui/FadeIn';

export default async function WhyDeyu() {
  const t = await getTranslations('whyDeyu');

  const advantages = [
    { icon: '🔬', title: t('tpu_title'), description: t('tpu_desc'), accent: 'from-blue-500 to-cyan-400' },
    { icon: '🏭', title: t('turnkey_title'), description: t('turnkey_desc'), accent: 'from-orange-500 to-amber-400' },
    { icon: '🌍', title: t('experience_title'), description: t('experience_desc'), accent: 'from-emerald-500 to-teal-400' },
    { icon: '📜', title: t('certified_title'), description: t('certified_desc'), accent: 'from-violet-500 to-purple-400' },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-[#f1f5f9] overflow-hidden">
      {/* 装饰圆斑 */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 border border-[#e2e8f0] group overflow-hidden h-full">
                {/* 顶部彩色描边 */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className={`inline-flex w-14 h-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-3xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <span className="filter drop-shadow-sm">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-3">{item.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
