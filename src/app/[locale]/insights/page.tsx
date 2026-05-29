"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "@/i18n/navigation";
import {
  getInsightsDashboardStats,
  searchPersonalInsights,
} from "@/lib/personalInsightsService";
import type { InsightsDashboardStats, PersonalInsight } from "@/types/personalInsight";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { INSIGHT_CATEGORIES, type InsightCategory } from "@/types/personalInsight";

export default function InsightsPage() {
  const t = useTranslations("insightsJournal");
  const tc = useTranslations("common");
  const [stats, setStats] = useState<InsightsDashboardStats | null>(null);
  const [insights, setInsights] = useState<PersonalInsight[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<InsightCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "confidence">("date");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [statsData, list] = await Promise.all([
      getInsightsDashboardStats(),
      searchPersonalInsights({ query, category, sortBy }),
    ]);
    setStats(statsData);
    setInsights(list);
    setLoading(false);
  }, [query, category, sortBy]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => void load(), 200);
    return () => clearTimeout(timer);
  }, [load]);

  useOnProfileImported(() => {
    setLoading(true);
    void load();
  });

  if (loading && !stats) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
        {tc("loading")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link
            href="/insights/add"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md"
          >
            {t("addInsight")}
          </Link>
        }
      />

      {stats && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900/80">
            <p className="text-start text-sm text-zinc-500">{t("totalInsights")}</p>
            <p className="mt-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.total}
            </p>
          </div>
          {stats.topCategories[0] && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900/80">
              <p className="text-start text-sm text-zinc-500">{t("topCategory")}</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {t(`form.categories.${stats.topCategories[0].category}`)}
              </p>
              <p className="text-xs text-zinc-500">
                {stats.topCategories[0].count} {t("entries")}
              </p>
            </div>
          )}
          {stats.highestConfidence[0] && (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900/80 sm:col-span-2">
              <p className="text-start text-sm text-zinc-500">{t("highestConfidence")}</p>
              <p className="mt-1 text-start font-semibold text-zinc-900 dark:text-zinc-50">
                {stats.highestConfidence[0].title}
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                {tc("ratingOf", { rating: stats.highestConfidence[0].confidenceLevel })}
              </p>
            </div>
          )}
        </section>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900/80 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor="search" className="mb-1 block text-start text-sm font-medium">
            {t("search")}
          </label>
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder={t("searchPlaceholder")}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cat" className="mb-1 block text-start text-sm font-medium">
            {t("filterCategory")}
          </label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as InsightCategory | "all")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="all">{t("allCategories")}</option>
            {INSIGHT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(`form.categories.${cat}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="sort" className="mb-1 block text-start text-sm font-medium">
            {t("sortBy")}
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "confidence")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="date">{t("sortDate")}</option>
            <option value="confidence">{t("sortConfidence")}</option>
          </select>
        </div>
      </div>

      {insights.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-3">
          {insights.map((insight) => (
            <Link
              key={insight.id}
              href={`/insights/${insight.id}`}
              className="block rounded-2xl border border-zinc-200/80 bg-white p-4 transition hover:border-violet-300 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:border-violet-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                  {t(`form.categories.${insight.category}`)}
                </span>
                <span className="text-xs text-zinc-500">
                  {tc("ratingOf", { rating: insight.confidenceLevel })}
                </span>
              </div>
              <h3 className="mt-2 text-start font-semibold text-zinc-900 dark:text-zinc-50">
                {insight.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-start text-sm text-zinc-600 dark:text-zinc-400">
                {insight.realization}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
