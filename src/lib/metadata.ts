const BASE_URL = 'https://deyusolemachine.com';
const LOCALES = ['en', 'es', 'pt', 'tr', 'ar'] as const;

function localeUrl(locale: string, path: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

/**
 * Build `alternates` metadata for a localised page.
 *
 * @param path  Path without locale prefix, e.g. `/products/dy-1102` or `/about`.
 * @param locale  The current page's locale — the canonical points to this
 *                locale's URL, not always English. Hard-coding canonical to
 *                English told Google every non-en page was a duplicate of the
 *                English version, suppressing indexation of ar/es/pt/tr pages.
 *                Each locale URL is its own canonical entity; `hreflang`
 *                relationships then declare them as translations.
 */
export function buildAlternates(path: string, locale: string = 'en') {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = localeUrl(l, path);
  }
  languages['x-default'] = localeUrl('en', path);

  return {
    canonical: localeUrl(locale, path),
    languages,
  };
}

export { BASE_URL, LOCALES };
