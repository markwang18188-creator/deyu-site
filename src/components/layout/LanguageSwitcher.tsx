'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useState } from 'react';

const localeNames: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
  tr: 'TR',
  ar: 'AR',
};

const localeFullNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  tr: 'Türkçe',
  ar: 'العربية',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white px-2 py-1 rounded transition-colors"
        aria-label={`${localeNames[locale]} — switch language`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {localeNames[locale]}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-full mt-1 w-36 bg-white text-gray-900 rounded-lg shadow-xl border border-[#e2e8f0] py-1 z-50">
            {routing.locales.map((l) => (
              <button
                key={l}
                onClick={() => handleSwitch(l)}
                className={`w-full text-start px-4 py-2 text-sm hover:bg-[#f1f5f9] transition-colors flex items-center gap-2 ${
                  l === locale ? 'font-semibold text-[#1e3a8a]' : 'text-gray-700'
                }`}
              >
                <span className="w-8 text-xs font-bold text-[#94a3b8]">{localeNames[l]}</span>
                {localeFullNames[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
