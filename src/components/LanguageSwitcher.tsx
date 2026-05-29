"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSettings } from "@/components/SettingsProvider";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const locales: { code: Locale; flag: string; labelKey: "en" | "ar" }[] = [
  { code: "en", flag: "🇺🇸", labelKey: "en" },
  { code: "ar", flag: "🇸🇦", labelKey: "ar" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setLocale } = useSettings();

  async function switchLocale(newLocale: Locale) {
    await setLocale(newLocale);
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      {!compact && (
        <p className="px-2 text-start text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {t("label")}
        </p>
      )}
      <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
        {locales.map(({ code, flag, labelKey }) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => void switchLocale(code)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition ${
                active
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
              aria-pressed={active}
            >
              <span aria-hidden>{flag}</span>
              {!compact && <span>{t(labelKey)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
