"use client";

import { useTranslations } from "next-intl";
import { ExportButton } from "@/components/ExportButton";
import { Link } from "@/i18n/navigation";

export function DashboardActions() {
  const t = useTranslations("dashboard");

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <Link
        href="/add"
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700"
      >
        {t("addEntry")}
      </Link>

      <div
        className="inline-flex items-center rounded-md border border-zinc-200/80 bg-zinc-50/90 p-0.5 dark:border-zinc-700/80 dark:bg-zinc-800/50"
        role="group"
        aria-label={t("secondaryActions")}
      >
        <Link
          href="/analytics"
          className="rounded px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors duration-150 hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900/80 dark:hover:text-zinc-100"
        >
          {t("viewAnalytics")}
        </Link>
        <span
          className="mx-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-700"
          aria-hidden
        />
        <ExportButton variant="toolbar" />
      </div>
    </div>
  );
}
