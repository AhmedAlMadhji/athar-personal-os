import type { AnalyticsData } from "@/types/analytics";

export const ANALYTICS_STAGE_THRESHOLDS = {
  onboardingMax: 9,
  basicMax: 29,
  patternsMax: 99,
} as const;

export type AnalyticsStage = 1 | 2 | 3 | 4;

export type InsightConfidence = "low" | "medium" | "high";

export type AnalyticsChartId =
  | "growth"
  | "consistency"
  | "typeComparison"
  | "correlation"
  | "tags"
  | "heatmap";

export function getAnalyticsStage(entryCount: number): AnalyticsStage {
  if (entryCount <= ANALYTICS_STAGE_THRESHOLDS.onboardingMax) return 1;
  if (entryCount <= ANALYTICS_STAGE_THRESHOLDS.basicMax) return 2;
  if (entryCount <= ANALYTICS_STAGE_THRESHOLDS.patternsMax) return 3;
  return 4;
}

/** Softer chart copy below 10 entries; balanced below 30; full tone at 30+. */
export function getInsightConfidence(entryCount: number): InsightConfidence {
  if (entryCount < 10) return "low";
  if (entryCount < 30) return "medium";
  return "high";
}

/** Empty state only when a chart truly has nothing to plot. */
export function hasChartData(
  chart: AnalyticsChartId,
  analytics: AnalyticsData
): boolean {
  switch (chart) {
    case "growth":
      return analytics.growth.length > 0;
    case "consistency":
      return analytics.consistency.length > 0;
    case "typeComparison":
      return analytics.typeComparison.length > 0;
    case "correlation":
      return analytics.correlation.length > 0;
    case "tags":
      return (analytics.tagsBreakdown?.length ?? 0) > 0;
    case "heatmap":
      return analytics.entryCount > 0;
    default:
      return false;
  }
}
