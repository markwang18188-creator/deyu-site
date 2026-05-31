'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView, type Variants, type UseInViewOptions } from 'motion/react';

type MarginType = UseInViewOptions['margin'];

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  variant?: Variants;
  duration?: number;
  delay?: number;
  yOffset?: number;
  /** When true (default), animation only plays when the element scrolls into view. */
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

/**
 * Magic UI — BlurFade. Subtle fade + blur reveal on mount or scroll-in.
 * Drop-in replacement for the older custom FadeIn — same prop names where
 * they overlap, just smoother easing and a softer blur.
 *
 * Source pattern: https://magicui.design/docs/components/blur-fade
 */
export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = true,
  inViewMargin = '-50px',
  blur = '6px',
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: 'blur(0px)' },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      exit="hidden"
      variants={combinedVariants}
      transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default BlurFade;
