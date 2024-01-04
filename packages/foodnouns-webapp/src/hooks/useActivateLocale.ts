import i18next from 'i18next';

const SUPPORTED_LOCALES = i18next.languages;
const DEFAULT_LOCALE = i18next.language;

/**
 * Given a locale string (e.g. from user agent), return the best match for corresponding SupportedLocale
 * @param maybeSupportedLocale the fuzzy locale identifier
 */
function parseLocale(maybeSupportedLocale: unknown): any {

  if (typeof maybeSupportedLocale !== 'string') return undefined;
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase();
  return SUPPORTED_LOCALES.find(
    (locale: string) =>
      locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale,
  );
}

/**
 * Returns the supported locale read from the user agent (navigator)
 */
export function navigatorLocale(): any {
  if (!navigator.language) return undefined;

  const [language, region] = navigator.language.split('-');

  if (region) {
    return parseLocale(`${language}-${region.toUpperCase()}`) ?? parseLocale(language);
  }

  return parseLocale(language);
}

function storeLocale(): any {
  return localStorage.getItem('lang') ?? undefined;
}

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 * Stores the query string locale in redux (if set) to persist across sessions
 */
export function useActiveLocale(): any {
  return storeLocale() ?? navigatorLocale() ?? DEFAULT_LOCALE;
}
