export interface GrowthDataPoint {
  period: string;
  label: string;
  averageRating: number;
  entryCount: number;
}

export interface DistributionDataPoint {
  name: string;
  value: number;
  type: string;
  fill: string;
}

export interface BarComparisonPoint {
  type: string;
  label: string;
  count: number;
  fill: string;
}

export interface ConsistencyDataPoint {
  period: string;
  label: string;
  entryCount: number;
}

export interface TagDistributionPoint {
  tag: string;
  count: number;
  fill: string;
}

export interface CorrelationPoint {
  period: string;
  label: string;
  effort: number;
  outcome: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  dayOfWeek: number;
  weekIndex: number;
}

export interface ChartInsightMeta {
  titleKey: string;
  descriptionKey: string;
  takeawayKey: string;
  takeawayValues?: Record<string, string | number>;
}

export interface AnalyticsData {
  entryCount: number;
  growth: GrowthDataPoint[];
  distribution: DistributionDataPoint[];
  typeComparison: BarComparisonPoint[];
  consistency: ConsistencyDataPoint[];
  tagsBreakdown: TagDistributionPoint[] | null;
  correlation: CorrelationPoint[];
  heatmap: HeatmapDay[];
  heatmapWeeks: number;
  insights: {
    growth: ChartInsightMeta;
    typeComparison: ChartInsightMeta;
    consistency: ChartInsightMeta;
    tags: ChartInsightMeta | null;
    correlation: ChartInsightMeta;
    heatmap: ChartInsightMeta;
  };
}

export type InsightTone = "positive" | "warning" | "neutral";

export interface Insight {
  id: string;
  tone: InsightTone;
  messageKey: string;
  values?: Record<string, string | number>;
}
