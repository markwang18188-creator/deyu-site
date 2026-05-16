import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

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
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href as '/products'}
              className="group border border-[#e2e8f0] rounded-lg p-6 hover:border-[#1e3a8a] hover:shadow-lg transition-all bg-white"
            >
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-semibold text-[#0f172a] mb-2 group-hover:text-[#1e3a8a] transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-[#64748b] mb-4 leading-relaxed">{cat.description}</p>
              <p className="text-xs text-[#94a3b8] font-mono">{cat.models}</p>
              <div className="mt-4 text-sm font-semibold text-[#3b82f6] group-hover:text-[#ea580c] transition-colors">
                {t('view_models')}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white font-semibold px-8 py-3 rounded-md transition-colors"
          >
            {t('view_all')}
          </Link>
        </div>
      </div>
    </section>
  );
}
