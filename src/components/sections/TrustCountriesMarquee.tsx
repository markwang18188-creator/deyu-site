import { Marquee } from '@/components/ui/magic/Marquee';

/** Countries DEYU machines are currently running in. Kept here so the data
 *  is easy to edit; ordered alphabetically within continent groups. */
const COUNTRIES = [
  'Brazil',
  'Argentina',
  'Colombia',
  'Mexico',
  'Turkey',
  'Egypt',
  'Morocco',
  'Nigeria',
  "Côte d'Ivoire",
  'Iran',
  'India',
  'Pakistan',
  'Bangladesh',
  'Vietnam',
  'Indonesia',
  'Russia',
];

/**
 * Quiet, premium replacement for the deleted "Trusted by Factories in 15
 * Countries" block. A single edge-fading marquee strip of country names —
 * dignified, B2B, doesn't shout. Two rows scrolling in opposite directions
 * give visual depth without being busy.
 */
export default function TrustCountriesMarquee() {
  return (
    <section className="relative py-14 lg:py-16 bg-white border-y border-[#e2e8f0] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#ea580c]">
          Running 24/7 In Factories Across
        </span>
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mt-2">
          15 Countries · 4 Continents
        </h2>
      </div>

      <div className="relative">
        {/* Edge fade so the strip melts into the section instead of clipping */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <Marquee pauseOnHover className="[--duration:55s] [--gap:3rem] py-3">
          {COUNTRIES.map((c) => (
            <CountryPill key={c} name={c} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:65s] [--gap:3rem] py-3 mt-1">
          {COUNTRIES.slice().reverse().map((c) => (
            <CountryPill key={c + '-r'} name={c} variant="muted" />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function CountryPill({ name, variant }: { name: string; variant?: 'muted' }) {
  const base =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors';
  const styles =
    variant === 'muted'
      ? 'bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a]'
      : 'bg-[#1e3a8a]/5 text-[#1e3a8a] hover:bg-[#1e3a8a]/10';
  return (
    <span className={`${base} ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" aria-hidden="true" />
      {name}
    </span>
  );
}
