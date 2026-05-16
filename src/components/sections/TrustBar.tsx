import { getTranslations } from 'next-intl/server';

export default async function TrustBar() {
  const t = await getTranslations('trustBar');

  const items = [
    { icon: '🏆', label: t('iso_label'), sub: t('iso_sub') },
    { icon: '✅', label: t('ce_label'), sub: t('ce_sub') },
    { icon: '📅', label: t('years_label'), sub: t('years_sub') },
    { icon: '🌍', label: t('countries_label'), sub: t('countries_sub') },
    { icon: '🏭', label: t('factory_label'), sub: t('factory_sub') },
  ];

  return (
    <section className="bg-[#f1f5f9] border-y border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-[#0f172a] text-sm">{item.label}</div>
                <div className="text-xs text-[#64748b]">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
