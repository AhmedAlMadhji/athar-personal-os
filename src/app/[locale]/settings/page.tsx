"use client";

import { useTranslations } from "next-intl";
import { useSettings } from "@/components/SettingsProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ImportProfileCard } from "@/components/ImportProfileCard";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "@/i18n/navigation";
import type { ThemeMode } from "@/types/settings";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tTheme = useTranslations("theme");
  const { dark, setTheme, ready } = useSettings();

  async function handleThemeChange(theme: ThemeMode) {
    await setTheme(theme);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title={t("title")} description={t("description")} />

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <h2 className="text-start text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("appearance")}
        </h2>
        <p className="mt-1 text-start text-sm text-zinc-500 dark:text-zinc-400">
          {t("appearanceHint")}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={!ready}
            onClick={() => void handleThemeChange("light")}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
              !dark
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {tTheme("light")}
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => void handleThemeChange("dark")}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
              dark
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {tTheme("dark")}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <h2 className="text-start text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("language")}
        </h2>
        <p className="mt-1 text-start text-sm text-zinc-500 dark:text-zinc-400">
          {t("languageHint")}
        </p>
        <div className="mt-4">
          <LanguageSwitcher />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <h2 className="text-start text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("motivationalMessages")}
        </h2>
        <p className="mt-1 text-start text-sm text-zinc-500 dark:text-zinc-400">
          {t("motivationalMessagesHint")}
        </p>
        <Link
          href="/settings/motivational-messages"
          className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md"
        >
          {t("manageMessages")}
        </Link>
      </section>

      <ImportProfileCard />
    </div>
  );
}
