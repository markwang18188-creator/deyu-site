import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import FadeIn from '@/components/ui/FadeIn';
import CategoryCard from '@/components/sections/CategoryCard';

export default async function ProductCategoryGrid() {
  const t = await getTranslations('productGrid');

  const categories = [
    {
      slug: 'single-color',
      title: t('single_color_title'),
      description: t('single_color_desc'),
      icon: '⚪',
      models: 'DY-1102 · DY-1106 · DY-1120A · DY-150',
      image: '/products/dy-single-rotary-gooseneck-2.jpg',
      href: '/products?category=single-color',
    },
    {
      slug: 'dual-color',
      title: t('dual_color_title'),
      description: t('dual_color_desc'),
      icon: '🔵',
      models: 'DY-2216TR/TPU · DY-2220A · DY-2212TPU/TR',
      image: '/products/dy-2212t.jpg',
      href: '/products?category=dual-color',
    },
    {
      slug: 'multi-color',
      title: t('multi_color_title'),
      description: t('multi_color_desc'),
      icon: '🌈',
      models: 'DY-3220C · DY-3212B · DY-4212C',
      image: '/products/dy-3220.jpg',
      href: '/products?category=multi-color',
    },
    {
      slug: 'industrial',
      title: t('industrial_title'),
      description: t('industrial_desc'),
      icon: '🔩',
      models: 'DY-1106-S · DY-1102-S',
      image: '/products/dy-1106h.jpg',
      href: '/products?category=industrial',
    },
    {
      slug: 'equipment',
      title: t('equipment_title'),
      description: t('equipment_desc'),
      icon: '⚙️',
      models: 'Colour Mixer · Hopper Dryer · Crusher · Compressor',
      image: '/exhibitions/exhibition-22.jpg',
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
              <CategoryCard
                href={cat.href}
                image={cat.image}
                icon={cat.icon}
                title={cat.title}
                description={cat.description}
                models={cat.models}
                viewLabel={t('view_models')}
              />
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
