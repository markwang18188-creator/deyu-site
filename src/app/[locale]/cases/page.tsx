import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/lib/metadata';
import CtaSection from '@/components/sections/CtaSection';
import { gallery, imageUrl, type GalleryImage } from '@/data/gallery';
import CustomerFactoryGallery, { type FactoryItem } from '@/components/cases/CustomerFactoryGallery';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cases');
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
    alternates: buildAlternates('/cases'),
  };
}

// Group photos for display. workshop/customer/product combined into one
// "Customer Installations & Production" section so visitors see them as
// one coherent story (machines in real use).
const tradeShows = gallery.filter(
  (g) => g.published !== false && g.category === 'tradeshow'
);
const shipments = gallery.filter(
  (g) => g.published !== false && g.category === 'shipment'
);

// Mix of YouTube customer-site videos + best customer/workshop photos for
// the "Inside Customer Factories" gallery. Videos come first so they take
// the spotlight when the section first appears; photos round out the
// thumbnail strip. Add more video items here as customer-factory videos
// get published on YouTube (multi-machine tours, customer site demos).
const factoryItems: FactoryItem[] = [
  {
    type: 'video' as const,
    youtubeId: 'vkDSJiMSumQ',
    caption:
      'DY-1108 single-color sole machine running on an African customer factory floor — real production, real output.',
    tags: ['Africa', 'DY-1108', 'Customer Site'],
  },
  ...gallery
    .filter(
      (g) =>
        g.published !== false &&
        (g.category === 'customer' || g.category === 'workshop')
    )
    .map((g) => ({
      type: 'image' as const,
      src: imageUrl(g),
      alt: g.caption,
      caption: g.caption,
      tags: g.location ? [g.location] : undefined,
    })),
];

function GalleryGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {images.map((g) => (
        <a
          key={g.id}
          href={imageUrl(g)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square bg-[#f1f5f9] rounded-lg overflow-hidden block"
        >
          <Image
            src={imageUrl(g)}
            alt={g.caption}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pt-8 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs font-medium leading-snug line-clamp-2">
              {g.caption}
            </p>
            {(g.location || g.year) && (
              <p className="text-white/70 text-[10px] mt-1">
                {[g.location, g.year].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="max-w-3xl mb-8">
      <span className="text-xs font-semibold text-[#ea580c] uppercase tracking-wider">
        {eyebrow}
      </span>
      <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mt-2 mb-3">
        {title}
      </h2>
      <p className="text-[#475569] leading-relaxed">{desc}</p>
    </div>
  );
}

export default async function CasesPage() {
  const t = await getTranslations('cases');

  return (
    <>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-industrial-grid animate-grid-shift opacity-50" />
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">{t('title')}</h1>
          <p className="text-blue-200 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      {/* Section 1 — Trade Shows */}
      {tradeShows.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Exhibitions"
              title="Trade Shows Around the World"
              desc="DEYU exhibits at major footwear-machinery trade shows every year — meeting with manufacturers, distributors and shoe brands face-to-face."
            />
            <GalleryGrid images={tradeShows} />
          </div>
        </section>
      )}

      {/* Section 2 — Inside Customer Factories (interactive gallery) */}
      {factoryItems.length > 0 && <CustomerFactoryGallery items={factoryItems} />}

      {/* Section 3 — Shipments */}
      {shipments.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Worldwide Delivery"
              title="Shipped to Every Continent"
              desc="Each machine is professionally crated and loaded into containers for export. Door-to-door logistics support available on request."
            />
            <GalleryGrid images={shipments} />
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
