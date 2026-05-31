'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';

interface Props {
  href: string;
  image: string;
  icon: string;
  title: string;
  description: string;
  models: string;
  viewLabel: string;
}

/**
 * Aceternity-style spotlight category card.
 *
 * On mouse move, two CSS variables (`--x` / `--y`) on the card root are
 * updated to the cursor's local position. A pointer-events-none overlay
 * paints a soft orange radial gradient centered on those coordinates, so
 * the spotlight visibly follows the cursor without re-rendering React.
 * Compose with the existing image-background + dark-gradient mask: image
 * provides context, mask keeps text legible, spotlight adds the premium
 * feel.
 */
export default function CategoryCard({
  href,
  image,
  icon,
  title,
  description,
  models,
  viewLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <Link
      ref={ref}
      href={href as '/products'}
      onMouseMove={handleMouseMove}
      className="block group relative aspect-[4/3] rounded-xl overflow-hidden border border-[#e2e8f0] hover:border-transparent hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-500 bg-[#0f172a]"
    >
      {/* Representative machine image — slow zoom on hover (Ken Burns) */}
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />

      {/* Dark gradient mask — heavy at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/55 to-[#0f172a]/15 transition-opacity duration-500 group-hover:opacity-70" />

      {/* Cursor-tracked spotlight — visible only on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
        style={{
          background:
            'radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(234,88,12,0.45), rgba(234,88,12,0.18) 30%, transparent 65%)',
        }}
      />

      {/* Subtle orange edge on hover — separate from cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl ring-1 ring-inset ring-orange-400/30"
      />

      {/* Top accent line wipes in on hover */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#ea580c] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10" />

      {/* Content pinned to bottom */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xl transition-transform duration-300 group-hover:scale-110 origin-left inline-block">
            {icon}
          </span>
        </div>
        <h3 className="text-xl font-bold leading-tight mb-1.5 drop-shadow-sm">{title}</h3>
        <p className="text-[13px] text-white/85 leading-relaxed mb-2 line-clamp-2">
          {description}
        </p>
        <p className="text-[11px] text-white/65 font-mono line-clamp-1 mb-3">{models}</p>
        <div className="text-sm font-semibold text-orange-300 group-hover:text-orange-200 inline-flex items-center gap-1.5">
          {viewLabel}
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </div>
      </div>
    </Link>
  );
}
