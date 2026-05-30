'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Product detail media gallery: vertical thumbnail strip on the left, large
 * media area on the right (stacks to thumb-strip-below on mobile). Hovering
 * or clicking a thumbnail swaps the main view. The video thumbnail carries a
 * play-icon overlay so visitors can tell at a glance there's a demo to watch.
 */
export default function ProductMediaSwitcher({
  image,
  alt,
  videoEmbedUrl,
  videoYoutubeId,
  videoTitle,
}: {
  image: string;
  alt: string;
  videoEmbedUrl?: string | null;
  videoYoutubeId?: string | null;
  videoTitle?: string;
}) {
  type Item =
    | { type: 'image'; src: string }
    | { type: 'video'; embed: string; thumb: string };

  const items: Item[] = [{ type: 'image', src: image }];
  if (videoEmbedUrl && videoYoutubeId) {
    items.push({
      type: 'video',
      embed: videoEmbedUrl,
      thumb: `https://i.ytimg.com/vi/${videoYoutubeId}/hqdefault.jpg`,
    });
  }
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="flex flex-row md:flex-col gap-2 md:flex-shrink-0 order-2 md:order-1 justify-center md:justify-start">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={it.type === 'video' ? 'Watch demo video' : 'View photo'}
              aria-pressed={active === i}
              className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition shrink-0 ${
                active === i
                  ? 'border-[#ea580c] ring-2 ring-orange-200'
                  : 'border-[#e2e8f0] hover:border-[#94a3b8]'
              }`}
            >
              <img
                src={it.type === 'image' ? it.src : it.thumb}
                alt=""
                className="w-full h-full object-cover bg-white"
              />
              {it.type === 'video' && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="w-6 h-6 rounded-full bg-white/95 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-3 h-3 text-[#0f172a] ml-[1px]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M6.3 2.84A1 1 0 005 3.74v12.5a1 1 0 001.555.832l9.4-6.25a1 1 0 000-1.664l-9.4-6.25z" />
                    </svg>
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main media area */}
      <div
        className={`flex-1 relative ${
          current.type === 'video' ? 'aspect-video' : 'aspect-[4/3]'
        } bg-[#f8fafc] rounded-xl overflow-hidden border border-[#e2e8f0] order-1 md:order-2 transition-all`}
      >
        {current.type === 'video' ? (
          <iframe
            src={`${current.embed}${current.embed.includes('?') ? '&' : '?'}autoplay=1`}
            title={videoTitle ?? alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full bg-black"
          />
        ) : (
          <Image
            src={current.src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6"
          />
        )}
      </div>
    </div>
  );
}
