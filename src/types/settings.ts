import type { Locale } from "@/i18n/routing";
import type { CustomEntryType } from "@/types/customEntryType";

export const SETTINGS_ID = "user-settings" as const;

export type ThemeMode = "light" | "dark";

export interface UserSettings {
  id: typeof SETTINGS_ID;
  theme: ThemeMode;
  locale: Locale;
  customEntryTypes?: CustomEntryType[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  id: SETTINGS_ID,
  theme: "light",
  locale: "en",
  customEntryTypes: [],
};
