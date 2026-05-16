import type { ReactNode } from 'react';

// Root layout is a pass-through; html/body are rendered in [locale]/layout.tsx
// so each locale can set the correct lang and dir attributes.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
