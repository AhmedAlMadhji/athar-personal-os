"use client";

import { useCallback, useEffect, useState } from "react";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { useTranslations } from "next-intl";
import { AnalyticsChartEmpty } from "@/components/analytics/AnalyticsChartEmpty";
import { AnalyticsStageBanner } from "@/components/analytics/AnalyticsStageBanner";
import { ActivityHeatmap } from "@/components/charts/ActivityHeatmap";
import { ConsistencyLineChart } from "@/components/charts/ConsistencyLineChart";
import { CorrelationScatterChart } from "@/components/charts/CorrelationScatterChart";
import { GrowthLineChart } from "@/components/charts/GrowthLineChart";
import { TagsBreakdownPieChart } from "@/components/charts/TagsBreakdownPieChart";
import { TypeComparisonBarChart } from "@/components/charts/TypeComparisonBarChart";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { PageHeader } from "@/components/PageHeader";
import { getAnalyticsStage } from "@/lib/analyticsMaturity";
import { getAnalyticsData, getInsights } from "@/lib/analyticsService";
import type { AnalyticsData, Insight } from "@/types/analytics";

export default function AnalyticsPage() {
  const tc = useTranslations("common");
  const t = useTranslations("analytics");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [data, insightData] = await Promise.all([
      getAnalyticsData(),
      getInsights(),
    ]);
    setAnalytics(data);
    setInsights(insightData);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useOnProfileImported(() => {
    void load();
  });

  if (loading || !analytics) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-xs text-zinc-500">{tc("loadingAnalytics")}</p>
        </div>
      </div>
    );
  }

  const entryCount = analytics.entryCount;
  const stage = getAnalyticsStage(entryCount);
  const insightsTitle =
    entryCount <= 3
      ? t("maturity.onboardingInsightsTitle")
      : t("insightsTitle");
  const insightsDesc =
    entryCount <= 3
      ? t("maturity.onboardingInsightsDesc")
      : t("insightsDesc");

  if (entryCount === 0) {
    return (
      <div className="space-y-5 [&>*:last-child]:mb-0">
        <PageHeader title={t("title")} description={t("description")} />
        <InsightsPanel insights={insights} />
        <AnalyticsChartEmpty chart="growth" />
      </div>
    );
  }

  return (
    <div className="space-y-5 [&>*:last-child]:mb-0">
      <PageHeader title={t("title")} description={t("description")} />

      <AnalyticsStageBanner stage={stage} entryCount={entryCount} />

      <InsightsPanel
        insights={insights}
        title={insightsTitle}
        description={insightsDesc}
      />

      <div className="grid min-h-0 gap-4 lg:grid-cols-2">
        <GrowthLineChart
          data={analytics.growth}
          insight={analytics.insights.growth}
        />
        <ConsistencyLineChart
          data={analytics.consistency}
          insight={analytics.insights.consistency}
        />
        <TypeComparisonBarChart
          data={analytics.typeComparison}
          insight={analytics.insights.typeComparison}
        />
        <CorrelationScatterChart
          data={analytics.correlation}
          insight={analytics.insights.correlation}
        />
        {analytics.tagsBreakdown && analytics.insights.tags && (
          <TagsBreakdownPieChart
            data={analytics.tagsBreakdown}
            insight={analytics.insights.tags}
          />
        )}
      </div>

      <ActivityHeatmap
        data={analytics.heatmap}
        weeks={analytics.heatmapWeeks}
        insight={analytics.insights.heatmap}
      />
    </div>
  );
}
