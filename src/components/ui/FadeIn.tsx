'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** 进入视口后延迟多少秒开始动画 */
  delay?: number;
  /** 自定义 className(会和动画类合并)*/
  className?: string;
  /** 触发动画的距离(默认 0px,即一进视口就触发)*/
  rootMargin?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'li';
}

/**
 * 滚动进入视口时触发 fade-up 动画。
 * 服务端组件可以直接 import 此 client 组件做局部包裹,不影响 SSR。
 */
export default function FadeIn({
  children,
  delay = 0,
  className = '',
  rootMargin = '-50px',
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 如果浏览器不支持或用户偏好减弱动画 — 直接显示
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  const Element = Tag as 'div';
  return (
    <Element
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
      className={className}
    >
      {children}
    </Element>
  );
}
