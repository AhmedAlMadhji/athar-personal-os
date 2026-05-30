import { db } from "@/lib/db";
import type { Locale } from "@/i18n/routing";
import { LOCALE_STORAGE_KEY } from "@/i18n/routing";
import {
  DEFAULT_SETTINGS,
  SETTINGS_ID,
  type ThemeMode,
  type UserSettings,
} from "@/types/settings";

function applyThemeToDocument(theme: ThemeMode): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export async function getSettings(): Promise<UserSettings> {
  let settings = await db.settings.get(SETTINGS_ID);

  if (!settings) {
    const legacyLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as
      | Locale
      | null;
    const legacyDark = document.documentElement.classList.contains("dark");

    settings = {
      ...DEFAULT_SETTINGS,
      locale:
        legacyLocale === "en" || legacyLocale === "ar"
          ? legacyLocale
          : DEFAULT_SETTINGS.locale,
      theme: legacyDark ? "dark" : DEFAULT_SETTINGS.theme,
      customEntryTypes: [],
    };

    await db.settings.put(settings);

    if (legacyLocale) {
      localStorage.removeItem(LOCALE_STORAGE_KEY);
    }
  }

  if (!settings.customEntryTypes) {
    settings.customEntryTypes = [];
    await db.settings.put(settings);
  }

  return settings;
}

export async function updateSettings(
  partial: Partial<Pick<UserSettings, "theme" | "locale" | "customEntryTypes">>
): Promise<UserSettings> {
  const current = await getSettings();
  const updated: UserSettings = {
    ...current,
    ...partial,
  };

  await db.settings.put(updated);

  if (partial.theme !== undefined) {
    applyThemeToDocument(updated.theme);
  }

  return updated;
}

export async function setTheme(theme: ThemeMode): Promise<UserSettings> {
  return updateSettings({ theme });
}

export async function setLocale(locale: Locale): Promise<UserSettings> {
  return updateSettings({ locale });
}

export function applyTheme(theme: ThemeMode): void {
  applyThemeToDocument(theme);
}
