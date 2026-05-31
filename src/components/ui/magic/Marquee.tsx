import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: ReactNode;
  vertical?: boolean;
  repeat?: number;
}

/**
 * Magic UI — Marquee. Infinite horizontal (or vertical) scroll of children.
 * The wrapping element duplicates `children` `repeat` times so the loop
 * appears seamless. Animation keyframes are registered in globals.css
 * (animate-marquee / animate-marquee-vertical) and read --duration / --gap
 * CSS variables so each instance can override speed and spacing.
 *
 * Source pattern: https://magicui.design/docs/components/marquee
 */
export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export default Marquee;
