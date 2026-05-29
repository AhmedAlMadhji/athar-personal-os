import { routing, type Locale } from "@/i18n/routing";

/** Pick best locale from Accept-Language header (server-only). */
export function detectLocaleFromHeader(
  acceptLanguage: string | null | undefined
): Locale {
  if (!acceptLanguage) {
    return routing.defaultLocale;
  }

  const lower = acceptLanguage.toLowerCase();

  for (const locale of routing.locales) {
    if (lower.includes(locale)) {
      return locale;
    }
  }

  return routing.defaultLocale;
}
