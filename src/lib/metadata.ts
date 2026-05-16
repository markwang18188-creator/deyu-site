const BASE_URL = 'https://deyusolemachine.com';
const LOCALES = ['en', 'es', 'pt', 'tr', 'ar'] as const;

function localeUrl(locale: string, path: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

export function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = localeUrl(locale, path);
  }
  languages['x-default'] = localeUrl('en', path);

  return {
    canonical: localeUrl('en', path),
    languages,
  };
}

export { BASE_URL, LOCALES };
