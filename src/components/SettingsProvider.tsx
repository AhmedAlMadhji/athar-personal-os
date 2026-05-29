"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Locale } from "@/i18n/routing";
import {
  applyTheme,
  getSettings,
  setLocale as saveLocale,
  setTheme as saveTheme,
} from "@/lib/settingsService";
import { PROFILE_IMPORTED_EVENT } from "@/lib/profileEvents";
import type { ThemeMode, UserSettings } from "@/types/settings";

interface SettingsContextValue {
  ready: boolean;
  settings: UserSettings | null;
  dark: boolean;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setLocale: (locale: Locale) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    function refreshSettings() {
      getSettings().then((loaded) => {
        applyTheme(loaded.theme);
        setSettings(loaded);
        setReady(true);
      });
    }

    refreshSettings();

    window.addEventListener(PROFILE_IMPORTED_EVENT, refreshSettings);
    return () =>
      window.removeEventListener(PROFILE_IMPORTED_EVENT, refreshSettings);
  }, []);

  const setTheme = useCallback(async (theme: ThemeMode) => {
    const updated = await saveTheme(theme);
    setSettings(updated);
  }, []);

  const setLocale = useCallback(async (locale: Locale) => {
    const updated = await saveLocale(locale);
    setSettings(updated);
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!settings) return;
    const next = settings.theme === "dark" ? "light" : "dark";
    await setTheme(next);
  }, [settings, setTheme]);

  const dark = settings?.theme === "dark";

  return (
    <SettingsContext.Provider
      value={{
        ready,
        settings,
        dark: dark ?? false,
        setTheme,
        setLocale,
        toggleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
