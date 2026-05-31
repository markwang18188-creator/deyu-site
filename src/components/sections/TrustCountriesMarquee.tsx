import { Marquee } from '@/components/ui/magic/Marquee';
import Globe from '@/components/ui/Globe';

/** Countries DEYU machines are currently running in. Kept here so the data
 *  is easy to edit; ordered roughly by continent. */
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
 * Global-reach section — dark navy backdrop with a slowly rotating 3D
 * globe (cobe) marking each customer country in warm gold, paired with
 * two opposite-scrolling country marquees underneath. Conveys "we ship
 * everywhere" with quiet premium feel rather than a noisy stat grid.
 */
export default function TrustCountriesMarquee() {
  return (
    <section className="relative py-20 lg:py-24 overflow-hidden bg-[#070d1f]">
      {/* Subtle radial glow + grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 35%, rgba(59,130,246,0.18), transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 lg:mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-400">
            Global Reach
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mt-3">
            Running 24/7 In <span className="text-orange-400">15 Countries</span>
          </h2>
        </div>

        {/* Globe */}
        <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[380px] mb-10 lg:mb-12">
          <Globe className="w-full" />
          {/* Soft underglow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-10 bottom-0 h-24 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(234,88,12,0.35), transparent 70%)',
            }}
          />
        </div>

        {/* Country marquees */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070d1f] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#070d1f] to-transparent z-10" />

          <Marquee pauseOnHover className="[--duration:55s] [--gap:2.5rem] py-2">
            {COUNTRIES.map((c) => (
              <CountryPill key={c} name={c} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:65s] [--gap:2.5rem] py-2 mt-1">
            {COUNTRIES.slice().reverse().map((c) => (
              <CountryPill key={c + '-r'} name={c} variant="muted" />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

function CountryPill({ name, variant }: { name: string; variant?: 'muted' }) {
  const base =
    'inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap shrink-0 border transition-colors';
  const styles =
    variant === 'muted'
      ? 'bg-white/[0.03] text-white/60 border-white/10 hover:text-white/90'
      : 'bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.1]';
  return (
    <span className={`${base} ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" />
      {name}
    </span>
  );
}
