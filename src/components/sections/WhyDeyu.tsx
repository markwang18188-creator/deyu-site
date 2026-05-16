import { getTranslations } from 'next-intl/server';

export default async function WhyDeyu() {
  const t = await getTranslations('whyDeyu');

  const advantages = [
    { icon: '🔬', title: t('tpu_title'), description: t('tpu_desc') },
    { icon: '🏭', title: t('turnkey_title'), description: t('turnkey_desc') },
    { icon: '🌍', title: t('experience_title'), description: t('experience_desc') },
    { icon: '📜', title: t('certified_title'), description: t('certified_desc') },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#f1f5f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-[#e2e8f0]"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">{item.title}</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
