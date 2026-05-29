'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'deyu_cookie_ack';

/**
 * Lightweight, non-blocking cookie notice. Target markets are mostly outside
 * the EU (India / Brazil / Vietnam / Turkey / Middle East), so this is a
 * dismissible informational bar rather than a consent-gating CMP. The choice
 * is remembered in localStorage. Positioned bottom-left to avoid colliding
 * with the bottom-right chat widget.
 */
export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      /* localStorage unavailable (private mode) — just don't show */
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm rounded-xl bg-[#0f172a] text-slate-200 shadow-2xl ring-1 ring-white/10 p-4 sm:p-5">
      <p className="text-sm leading-relaxed">
        We use cookies to analyze site traffic and improve your browsing
        experience. By continuing to use this site, you accept our use of
        cookies.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={dismiss}
          className="rounded-md bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
