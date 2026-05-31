'use client';

import type { ReactNode } from 'react';
import { BlurFade } from './magic/BlurFade';

interface Props {
  children: ReactNode;
  /** Seconds to wait after the element enters the viewport before animating. */
  delay?: number;
  /** Extra className passed through to the animated wrapper. */
  className?: string;
  /** Viewport margin for the intersection trigger (default `-50px`). */
  rootMargin?: string;
  /** Kept for API compatibility — ignored (BlurFade always renders a div). */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'li';
}

/**
 * Backwards-compatible wrapper that now delegates to the Magic UI
 * `BlurFade` component (smoother easing + soft blur reveal). All existing
 * call sites work unchanged; new code should import `BlurFade` directly.
 */
export default function FadeIn({ children, delay = 0, className = '', rootMargin = '-50px' }: Props) {
  return (
    <BlurFade delay={delay} className={className} inViewMargin={rootMargin as `${number}px`}>
      {children}
    </BlurFade>
  );
}
