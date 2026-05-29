"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useSettings } from "@/components/SettingsProvider";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSync() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { ready, settings } = useSettings();

  useEffect(() => {
    if (!ready || !settings) return;

    const preferred = settings.locale;

    if (preferred !== locale && routing.locales.includes(preferred)) {
      router.replace(pathname, { locale: preferred as Locale });
    }
  }, [ready, settings, locale, pathname, router]);

  return null;
}
