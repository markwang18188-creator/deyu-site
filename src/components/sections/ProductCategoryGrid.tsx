import Image from 'next/image';
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
              <Link
                href={cat.href as '/products'}
                className="block group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#e2e8f0] hover:border-transparent hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-500 bg-[#0f172a]"
              >
                {/* Representative machine image (slowly zooms on hover — Ken Burns) */}
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />

                {/* Dark gradient mask — heavy at bottom for text legibility.
                    Hovering lightens it so the machine photo reveals more. */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/55 to-[#0f172a]/15 transition-opacity duration-500 group-hover:opacity-70" />

                {/* Top accent line — animates in on hover */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#ea580c] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />

                {/* Soft orange glow on hover (top-right) */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/0 group-hover:bg-orange-500/25 rounded-full blur-3xl transition-colors duration-700" />

                {/* Content — pinned to bottom, white on dark */}
                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="text-xl transition-transform duration-300 group-hover:scale-110 origin-left inline-block">
                      {cat.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight mb-1.5 drop-shadow-sm">
                    {cat.title}
                  </h3>
                  <p className="text-[13px] text-white/85 leading-relaxed mb-2 line-clamp-2">
                    {cat.description}
                  </p>
                  <p className="text-[11px] text-white/65 font-mono line-clamp-1 mb-3">
                    {cat.models}
                  </p>
                  <div className="text-sm font-semibold text-orange-300 group-hover:text-orange-200 inline-flex items-center gap-1.5">
                    {t('view_models')}
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
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
