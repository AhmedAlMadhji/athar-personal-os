"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IconLightbulb, IconRefresh } from "@/components/icons/AppIcons";
import { Link } from "@/i18n/navigation";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { getRandomPersonalInsight } from "@/lib/personalInsightsService";
import type { PersonalInsight } from "@/types/personalInsight";

export function InsightOfTheDay({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("insightsJournal");
  const [insight, setInsight] = useState<PersonalInsight | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const picked = await getRandomPersonalInsight();
    setInsight(picked);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useOnProfileImported(() => {
    void load();
  });

  if (!loading && !insight) {
    return (
      <div className="rounded-lg border border-dashed border-violet-200/60 bg-violet-50/30 p-3 dark:border-violet-800/40 dark:bg-violet-950/20">
        <p className="text-start text-xs text-zinc-600 dark:text-zinc-400">
          {t("emptyWidget")}
        </p>
        <Link
          href="/insights"
          className="mt-1 inline-block text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          {t("addFirstInsight")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-violet-200/50 bg-violet-50/40 p-3 dark:border-violet-800/40 dark:bg-violet-950/25">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-start text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
          <IconLightbulb className="h-3.5 w-3.5" />
          {t("insightOfDay")}
        </h3>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="shrink-0 rounded-md border border-violet-200/60 bg-white/80 p-1.5 text-violet-600 transition hover:bg-white disabled:opacity-50 dark:border-violet-800/50 dark:bg-zinc-900/80 dark:text-violet-400"
          title={t("refresh")}
          aria-label={t("refresh")}
        >
          <IconRefresh className="h-3.5 w-3.5" />
        </button>
      </div>

      {loading || !insight ? (
        <p className="text-xs text-zinc-500">…</p>
      ) : (
        <div className="space-y-1 text-start">
          <Link
            href={`/insights/${insight.id}`}
            className={`block font-semibold text-zinc-900 hover:text-violet-700 dark:text-zinc-50 dark:hover:text-violet-300 ${
              compact ? "line-clamp-1 text-sm" : "text-base"
            }`}
          >
            {insight.title}
          </Link>
          {insight.solution && (
            <p className={`text-zinc-600 dark:text-zinc-400 ${compact ? "line-clamp-1 text-xs" : "text-sm"}`}>
              <span className="font-medium">{t("solution")}:</span>{" "}
              {insight.solution}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
