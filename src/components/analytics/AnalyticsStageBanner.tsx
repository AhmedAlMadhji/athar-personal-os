"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AnalyticsStage } from "@/lib/analyticsMaturity";

interface AnalyticsStageBannerProps {
  stage: AnalyticsStage;
  entryCount: number;
}

export function AnalyticsStageBanner({
  stage,
  entryCount,
}: AnalyticsStageBannerProps) {
  const t = useTranslations("analytics.maturity");

  return (
    <section className="rounded-xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/60 to-white px-5 py-4 dark:border-indigo-900/40 dark:from-indigo-950/25 dark:to-zinc-900/80">
      <p className="text-start text-[10px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        {t(`stageLabel.${stage}`)}
      </p>
      <h2 className="mt-1 text-start text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {t(`stageTitle.${stage}`)}
      </h2>
      <p className="mt-2 text-start text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t(`stageDescription.${stage}`, { count: entryCount })}
      </p>
      {stage === 1 && (
        <Link
          href="/add"
          className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          {t("stageCta")}
        </Link>
      )}
    </section>
  );
}
