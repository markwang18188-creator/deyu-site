import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import FadeIn from '@/components/ui/FadeIn';

export default async function ProductCategoryGrid() {
  const t = await getTranslations('productGrid');

  const categories = [
    {
      slug: 'single-color',
      title: t('single_color_title'),
      description: t('single_color_desc'),
      icon: '⚪',
      models: 'DY-1102 · DY-1106 · DY-1120A · DY-150',
      href: '/products?category=single-color',
    },
    {
      slug: 'dual-color',
      title: t('dual_color_title'),
      description: t('dual_color_desc'),
      icon: '🔵',
      models: 'DY-2216TR/TPU · DY-2220A · DY-2212TPU/TR',
      href: '/products?category=dual-color',
    },
    {
      slug: 'multi-color',
      title: t('multi_color_title'),
      description: t('multi_color_desc'),
      icon: '🌈',
      models: 'DY-3220C · DY-3212B · DY-4212C',
      href: '/products?category=multi-color',
    },
    {
      slug: 'air-blowing',
      title: t('air_blowing_title'),
      description: t('air_blowing_desc'),
      icon: '💨',
      models: 'DY-1124B · DY-2224B · DY-3124C',
      href: '/products?category=air-blowing',
    },
    {
      slug: 'industrial',
      title: t('industrial_title'),
      description: t('industrial_desc'),
      icon: '🔩',
      models: 'DY-1106-S · DY-1102-S',
      href: '/products?category=industrial',
    },
    {
      slug: 'equipment',
      title: t('equipment_title'),
      description: t('equipment_desc'),
      icon: '⚙️',
      models: 'Colour Mixer · Hopper Dryer · Crusher · Compressor',
      href: '/equipment',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 0.08}>
              <Link
                href={cat.href as '/products'}
                className="block group relative border border-[#e2e8f0] rounded-xl p-6 hover:border-transparent hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden"
              >
                {/* 顶部渐变描边 (hover 时浮现) */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* 角落装饰光晕 */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

                <div className="relative">
                  <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 origin-left inline-block">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#0f172a] mb-2 group-hover:text-[#1e3a8a] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[#64748b] mb-4 leading-relaxed">{cat.description}</p>
                  <p className="text-xs text-[#94a3b8] font-mono">{cat.models}</p>
                  <div className="mt-4 text-sm font-semibold text-[#3b82f6] group-hover:text-[#ea580c] transition-all inline-flex items-center gap-1">
                    {t('view_models')}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="text-center mt-10" delay={0.2}>
          <Link
            href="/products"
            className="inline-block border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white hover:-translate-y-0.5 hover:shadow-lg font-semibold px-8 py-3 rounded-md transition-all duration-300"
          >
            {t('view_all')}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
