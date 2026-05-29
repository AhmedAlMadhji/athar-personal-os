"use client";

import { useCallback, useEffect, useState } from "react";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { useTranslations } from "next-intl";
import { CompactEntryRow } from "@/components/dashboard/CompactEntryRow";
import { CompactStat } from "@/components/dashboard/CompactStat";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets";
import { InsightOfTheDay } from "@/components/InsightOfTheDay";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { Link } from "@/i18n/navigation";
import {
  getActivityLastNDays,
  getDashboardStats,
  getRecentEntries,
  getRecentStrengthEntries,
} from "@/lib/entriesService";
import type { DashboardStats, Entry } from "@/types/entry";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Entry[]>([]);
  const [activity, setActivity] = useState<
    Awaited<ReturnType<typeof getActivityLastNDays>>
  >([]);
  const [strengths, setStrengths] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [statsData, recentData, activityData, strengthsData] =
      await Promise.all([
        getDashboardStats(),
        getRecentEntries(5),
        getActivityLastNDays(7),
        getRecentStrengthEntries(3),
      ]);
    setStats(statsData);
    setRecent(recentData);
    setActivity(activityData);
    setStrengths(strengthsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useOnProfileImported(() => {
    void load();
  });

  if (loading || !stats) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-zinc-500">{tc("loadingProfile")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-start">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>
        <DashboardActions />
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        <WelcomeMessage compact />
        <InsightOfTheDay compact />
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <CompactStat label={t("totalEntries")} value={stats.total} accent="indigo" />
        <CompactStat label={t("strengths")} value={stats.strengths} accent="emerald" />
        <CompactStat label={t("weaknesses")} value={stats.weaknesses} accent="rose" />
        <CompactStat label={t("skills")} value={stats.skills} accent="sky" />
      </div>

      <DashboardWidgets
        stats={stats}
        activity={activity}
        strengths={strengths}
      />

      <section className="rounded-md border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-2.5 py-1.5 dark:border-zinc-800/80">
          <h2 className="text-start text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("recentEntries")}
          </h2>
          <Link
            href="/timeline"
            className="text-[11px] font-medium text-indigo-600 transition-colors duration-150 hover:text-indigo-700 dark:text-indigo-400"
          >
            {tc("viewAll")}
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-2.5 py-4 text-center">
            <p className="text-xs text-zinc-500">{t("noEntries")}</p>
            <Link
              href="/add"
              className="mt-1.5 inline-block text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {t("createFirst")}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {recent.map((entry) => (
              <CompactEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
