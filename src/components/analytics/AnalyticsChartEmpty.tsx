"use client";

import { useTranslations } from "next-intl";
import { IconChartBar } from "@/components/icons/AppIcons";
import type { AnalyticsChartId } from "@/lib/analyticsMaturity";

interface AnalyticsChartEmptyProps {
  chart: AnalyticsChartId;
  className?: string;
}

export function AnalyticsChartEmpty({
  chart,
  className = "",
}: AnalyticsChartEmptyProps) {
  const t = useTranslations("analytics.maturity");

  return (
    <article
      className={`flex min-h-[220px] flex-col rounded-xl border border-dashed border-zinc-200/90 bg-zinc-50/50 dark:border-zinc-700/80 dark:bg-zinc-900/40 ${className}`}
    >
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/60"
          aria-hidden
        >
          <IconChartBar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-start text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("emptyTitle")}
        </h3>
        <p className="mt-2 max-w-sm text-start text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t(`emptyDescription.${chart}`)}
        </p>
      </div>
    </article>
  );
}
