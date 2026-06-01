'use client';

import type { ReactNode } from 'react';
import { trackWhatsAppClick } from '@/lib/analytics';

const DEFAULT_NUMBER = '8613615778781';

interface Props {
  /** Override the factory's default WhatsApp number when needed (rare). */
  number?: string;
  /** Optional URL-encoded pre-filled message body. */
  text?: string;
  /** Where this button lives — used as the analytics event's `location` field.
   *  Keep it stable so dashboards can compare conversion by surface:
   *  'header' | 'header_mobile' | 'footer' | 'product_detail' | 'cta_section'
   *  | 'chatbot' | 'thank_you' | 'contact_page' | 'hero' */
  location: string;
  /** Optional product slug or model — lets us see which product page the
   *  WhatsApp button is clicked from most often. */
  machine?: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * Client-side `<a href="https://wa.me/...">` wrapper that fires a
 * `whatsapp_click` analytics event when clicked. Centralises the default
 * factory number so we never have to grep-replace it again.
 */
export default function WhatsAppLink({
  number = DEFAULT_NUMBER,
  text,
  location,
  machine,
  className,
  ariaLabel,
  children,
}: Props) {
  const href = text ? `https://wa.me/${number}?text=${text}` : `https://wa.me/${number}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      onClick={() => trackWhatsAppClick(location, machine)}
    >
      {children}
    </a>
  );
}
