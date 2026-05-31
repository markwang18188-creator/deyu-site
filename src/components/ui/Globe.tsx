'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

interface Marker {
  /** [latitude, longitude] in degrees. */
  location: [number, number];
  /** Dot size; 0.05–0.10 looks good. */
  size: number;
  /** Optional per-marker RGB [0–1]. Falls back to global markerColor. */
  color?: [number, number, number];
}

interface Arc {
  from: [number, number];
  to: [number, number];
}

interface Props {
  className?: string;
  /** Marker positions (lat/lng). Defaults to DEYU's 15 customer countries + Wenzhou origin. */
  markers?: Marker[];
  /** Trade arcs (origin → destination). Defaults to Wenzhou → every customer country. */
  arcs?: Arc[];
  /** Phi rotation speed (radians per frame). Lower = slower. */
  rotationSpeed?: number;
}

const WENZHOU: [number, number] = [27.99, 120.7];

const DEFAULT_MARKERS: Marker[] = [
  { location: WENZHOU, size: 0.1, color: [0.25, 0.9, 0.55] }, // Wenzhou (origin) — emerald green to mark factory HQ
  { location: [-15.78, -47.93], size: 0.06 }, // Brazil
  { location: [-34.6, -58.4], size: 0.05 }, // Argentina
  { location: [4.7, -74.1], size: 0.05 }, // Colombia
  { location: [19.4, -99.1], size: 0.05 }, // Mexico
  { location: [39.9, 32.9], size: 0.06 }, // Turkey
  { location: [30.0, 31.2], size: 0.05 }, // Egypt
  { location: [33.6, -7.6], size: 0.05 }, // Morocco
  { location: [9.1, 7.5], size: 0.05 }, // Nigeria
  { location: [6.8, -5.3], size: 0.04 }, // Côte d'Ivoire
  { location: [35.7, 51.4], size: 0.05 }, // Iran
  { location: [28.6, 77.2], size: 0.07 }, // India
  { location: [33.7, 73.0], size: 0.05 }, // Pakistan
  { location: [23.8, 90.4], size: 0.05 }, // Bangladesh
  { location: [21.0, 105.8], size: 0.05 }, // Vietnam
  { location: [-6.2, 106.8], size: 0.06 }, // Indonesia
  { location: [55.8, 37.6], size: 0.05 }, // Russia
];

const DEFAULT_ARCS: Arc[] = DEFAULT_MARKERS.slice(1).map((m) => ({
  from: WENZHOU,
  to: m.location,
}));

/**
 * Interactive 3D globe using cobe. Rotates slowly, with customer country
 * dots in warm gold and trade-route arcs flying out from Wenzhou. Tuned
 * for a dark navy background.
 */
export default function Globe({
  className,
  markers = DEFAULT_MARKERS,
  arcs = DEFAULT_ARCS,
  rotationSpeed = 0.0035,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let width = 0;
    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor: [0.25, 0.3, 0.45], // soft blue-grey landmass
      markerColor: [1, 0.65, 0.15], // warm gold markers
      glowColor: [0.3, 0.45, 0.7], // subtle blue atmospheric glow
      markers,
      arcs,
      arcColor: [1, 0.75, 0.25], // brighter gold for the trade arcs
      arcWidth: 1.6,
      arcHeight: 0.55,
    });

    // Drive rotation via update() — cobe v2 removed onRender.
    let raf = 0;
    const tick = () => {
      phi += rotationSpeed;
      globe.update({ phi, width: width * 2, height: width * 2 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Fade-in once the first frame paints
    requestAnimationFrame(() => {
      canvas.style.opacity = '1';
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      globe.destroy();
    };
  }, [markers, arcs, rotationSpeed]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: 0,
          transition: 'opacity 1.2s ease-out',
          contain: 'layout paint size',
          maxWidth: '100%',
          aspectRatio: '1 / 1',
        }}
      />
    </div>
  );
}
