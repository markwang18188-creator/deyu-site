import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { buildAlternates } from '@/lib/metadata';
import CtaSection from '@/components/sections/CtaSection';
import { gallery, imageUrl, type GalleryImage } from '@/data/gallery';

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
const installations = gallery.filter(
  (g) =>
    g.published !== false &&
    (g.category === 'workshop' ||
      g.category === 'customer' ||
      g.category === 'product')
);
const shipments = gallery.filter(
  (g) => g.published !== false && g.category === 'shipment'
);

const markets = [
  { region: 'South America', countries: 'Brazil · Argentina · Colombia', icon: '🌎' },
  { region: 'Middle East & Africa', countries: 'Turkey · Egypt · Morocco · Nigeria', icon: '🌍' },
  { region: 'South Asia', countries: 'India · Pakistan · Bangladesh', icon: '🌏' },
  { region: 'Southeast Asia', countries: 'Vietnam · Indonesia', icon: '🌏' },
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
      <div className="bg-[#1e3a8a] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">{t('title')}</h1>
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

      {/* Section 2 — Customer Installations & Production */}
      {installations.length > 0 && (
        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="In Production"
              title="Customer Installations & Daily Production"
              desc="DEYU machines are running in factories across 30+ countries — from large-volume sport-shoe brands to specialty footwear OEMs. Below is a snapshot of our machines on the production floor."
            />
            <GalleryGrid images={installations} />
          </div>
        </section>
      )}

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

      {/* Global markets */}
      <section className="py-16 bg-[#1e3a8a] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-center">
            Where Our Machines Are Running
          </h2>
          <p className="text-blue-200 text-center mb-10 max-w-2xl mx-auto">
            Exporting to 30+ countries across four continents.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {markets.map((m) => (
              <div
                key={m.region}
                className="bg-white/10 border border-white/20 rounded-lg p-6 text-center backdrop-blur"
              >
                <div className="text-4xl mb-3">{m.icon}</div>
                <h3 className="font-semibold text-sm mb-2">{m.region}</h3>
                <p className="text-xs text-blue-200 leading-relaxed">{m.countries}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
