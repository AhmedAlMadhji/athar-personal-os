"use client";

import { useTranslations } from "next-intl";
import type { Insight, InsightTone } from "@/types/analytics";

interface InsightsPanelProps {
  insights: Insight[];
}

const toneStyles: Record<
  InsightTone,
  { border: string; bg: string; icon: string }
> = {
  positive: {
    border: "border-emerald-200 dark:border-emerald-800/60",
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    border: "border-amber-200 dark:border-amber-800/60",
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
  },
  neutral: {
    border: "border-zinc-200 dark:border-zinc-700",
    bg: "bg-zinc-50/80 dark:bg-zinc-800/50",
    icon: "text-zinc-500 dark:text-zinc-400",
  },
};

const toneIcons: Record<InsightTone, string> = {
  positive: "↑",
  warning: "!",
  neutral: "·",
};

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const t = useTranslations("analytics");
  const ti = useTranslations("insights");

  return (
    <div className="rounded-lg border border-zinc-200/80 bg-gradient-to-br from-white via-white to-indigo-50/20 dark:border-zinc-800/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/10">
      <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800/80">
        <h3 className="text-start text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {t("insightsTitle")}
        </h3>
        <p className="mt-0.5 text-start text-xs text-zinc-500 dark:text-zinc-400">
          {t("insightsDesc")}
        </p>
      </div>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        {insights.map((insight) => {
          const style = toneStyles[insight.tone];
          return (
            <li
              key={insight.id}
              className={`flex gap-2.5 px-3 py-2.5 ${style.bg}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/80 text-xs font-bold dark:bg-zinc-900/80 ${style.icon}`}
              >
                {toneIcons[insight.tone]}
              </span>
              <p className="text-start text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                {ti(
                  insight.messageKey,
                  (insight.values ?? {}) as Record<string, string | number>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
