'use client';

import { useState } from 'react';

/**
 * Customer factory gallery — Amazon-style left thumbnail strip + large
 * main media area. Mixes videos (YouTube embeds with a play overlay on
 * the thumb) and photos. Hover/click a thumb to swap the main view with
 * a smooth crossfade. Stacks on mobile with a horizontal thumb strip
 * below the main media.
 */
export type FactoryItem =
  | { type: 'image'; src: string; alt: string; caption: string; tags?: string[] }
  | {
      type: 'video';
      youtubeId: string;
      /** Set true for 9:16 vertical Shorts so the main media frame goes
       *  portrait instead of 16:9 (otherwise the Short renders pillarboxed). */
      isShorts?: boolean;
      thumb?: string;
      caption: string;
      tags?: string[];
    };

export default function CustomerFactoryGallery({ items }: { items: FactoryItem[] }) {
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;
  const current = items[active];

  const thumbSrc = (it: FactoryItem) =>
    it.type === 'image' ? it.src : it.thumb || `https://i.ytimg.com/vi/${it.youtubeId}/hqdefault.jpg`;

  return (
    <section className="relative py-20 lg:py-24 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e293b] overflow-hidden">
      {/* Subtle grid pattern + glow accents, like the Hero section */}
      <div className="absolute inset-0 bg-industrial-grid opacity-[0.07] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12 lg:mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-400 mb-3">
            🏭 Inside Customer Factories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            DEYU Machines on Real Production Floors
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Watch DEYU machines running every day in customer factories across 30+ countries — sport-shoe brands, slipper OEMs, sandal lines.
          </p>
        </div>

        {/* Gallery */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Thumbnail strip */}
          <div
            role="listbox"
            aria-label="Customer factory media"
            className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[560px] order-2 md:order-1 pb-1 md:pb-0 md:pr-2 scrollbar-thin"
          >
            {items.map((it, i) => {
              const isActive = active === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-orange-400 shadow-lg shadow-orange-500/40 scale-105'
                      : 'ring-1 ring-white/20 hover:ring-white/50 brightness-75 hover:brightness-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={thumbSrc(it)}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover bg-slate-700"
                  />
                  {it.type === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-md">
                        <svg className="w-3.5 h-3.5 text-[#0f172a] ml-[1px]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M6.3 2.84A1 1 0 005 3.74v12.5a1 1 0 001.555.832l9.4-6.25a1 1 0 000-1.664l-9.4-6.25z" />
                        </svg>
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main media area */}
          <div className="flex-1 order-1 md:order-2 min-w-0">
            <div className="flex justify-center">
            {current.type === 'video' && current.isShorts ? (
              // 9:16 Shorts — narrower frame, capped height so the gallery
              // section doesn't blow up on desktop. Centered within the
              // available column.
              <div className="relative aspect-[9/16] w-full max-w-[min(440px,75vh)] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
                <iframe
                  key={current.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                  title={current.caption}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
                {current.type === 'video' ? (
                  <iframe
                    key={current.youtubeId}
                    src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?rel=0&modestbranding=1`}
                    title={current.caption}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <img
                    key={current.src}
                    src={current.src}
                    alt={current.alt}
                    className="absolute inset-0 w-full h-full object-cover animate-[fadeIn_300ms_ease-out]"
                  />
                )}
              </div>
            )}
            </div>

            {/* Caption row */}
            <div className="mt-5">
              {current.tags && current.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold uppercase tracking-wider text-orange-300 bg-orange-500/15 border border-orange-400/30 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-white text-base lg:text-lg leading-relaxed max-w-3xl">
                {current.caption}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe for the image crossfade (Tailwind doesn't ship one) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
