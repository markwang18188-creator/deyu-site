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
    <section className="bg-white border-y border-[#e2e8f0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:gap-x-12">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3 group"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-125">
                {item.icon}
              </span>
              <div>
                <div className="font-semibold text-[#0f172a] text-sm">{item.label}</div>
                <div className="text-xs text-[#64748b]">{item.sub}</div>
              </div>
              {i < items.length - 1 && (
                <div className="hidden lg:block h-8 w-px bg-slate-200 ml-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
