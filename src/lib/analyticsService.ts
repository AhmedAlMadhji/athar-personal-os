import { getAllEntries } from "@/lib/entriesService";
import type {
  AnalyticsData,
  BarComparisonPoint,
  ChartInsightMeta,
  ConsistencyDataPoint,
  CorrelationPoint,
  DistributionDataPoint,
  GrowthDataPoint,
  HeatmapDay,
  Insight,
  TagDistributionPoint,
} from "@/types/analytics";
import type { Entry, EntryType } from "@/types/entry";

const DISTRIBUTION_COLORS: Record<EntryType, string> = {
  strength: "#10b981",
  weakness: "#f43f5e",
  skill: "#0ea5e9",
  note: "#f59e0b",
};

const TAG_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
];

const HEATMAP_WEEKS = 12;
const ENTRY_TYPES: EntryType[] = ["strength", "weakness", "skill", "note"];

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function trendDirection(values: number[]): "up" | "down" | "flat" {
  if (values.length < 2) return "flat";
  const midpoint = Math.ceil(values.length / 2);
  const firstHalf = avg(values.slice(0, midpoint));
  const secondHalf = avg(values.slice(midpoint));
  const delta = secondHalf - firstHalf;
  if (Math.abs(delta) < 0.25) return "flat";
  return delta > 0 ? "up" : "down";
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function computeGrowthOverTime(entries: Entry[]): GrowthDataPoint[] {
  const buckets = new Map<string, { sum: number; count: number; weekStart: Date }>();

  for (const entry of entries) {
    const created = new Date(entry.createdAt);
    const weekStart = startOfWeek(created);
    const key = toDateKey(weekStart);
    const existing = buckets.get(key);
    if (existing) {
      existing.sum += entry.rating;
      existing.count += 1;
    } else {
      buckets.set(key, { sum: entry.rating, count: 1, weekStart });
    }
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime())
    .map(({ sum, count, weekStart }) => ({
      period: toDateKey(weekStart),
      label: formatWeekLabel(weekStart),
      averageRating: Math.round((sum / count) * 10) / 10,
      entryCount: count,
    }));
}

export function computeTypeComparison(entries: Entry[]): BarComparisonPoint[] {
  return ENTRY_TYPES.map((type) => ({
    type,
    label: type,
    count: entries.filter((entry) => entry.type === type).length,
    fill: DISTRIBUTION_COLORS[type],
  })).filter((item) => item.count > 0);
}

export function computeActivityConsistency(
  entries: Entry[]
): ConsistencyDataPoint[] {
  return computeGrowthOverTime(entries).map(({ period, label, entryCount }) => ({
    period,
    label,
    entryCount,
  }));
}

export function computeTagsBreakdown(
  entries: Entry[]
): TagDistributionPoint[] | null {
  const tagCounts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const sorted = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count], index) => ({
      tag,
      count,
      fill: TAG_COLORS[index % TAG_COLORS.length],
    }));

  if (sorted.length === 0) {
    return null;
  }

  return sorted;
}

export function computeEffortOutcomeCorrelation(
  entries: Entry[]
): CorrelationPoint[] {
  return computeGrowthOverTime(entries).map(
    ({ period, label, entryCount, averageRating }) => ({
      period,
      label,
      effort: entryCount,
      outcome: averageRating,
    })
  );
}

function dominantType(entries: Entry[]): EntryType | null {
  const comparison = computeTypeComparison(entries);
  if (comparison.length === 0) return null;
  return comparison.sort((a, b) => b.count - a.count)[0].type;
}

function buildGrowthInsight(entries: Entry[], growth: GrowthDataPoint[]): ChartInsightMeta {
  const ratings = growth.map((point) => point.averageRating);
  const direction = trendDirection(ratings);
  const latest = ratings.at(-1) ?? 0;
  const earliest = ratings[0] ?? latest;
  const delta = Math.abs(latest - earliest).toFixed(1);

  return {
    titleKey: `chartInsights.growth.title.${direction}`,
    descriptionKey: "chartInsights.growth.description",
    takeawayKey: `chartInsights.growth.takeaway.${direction}`,
    takeawayValues: { delta, latest: latest.toFixed(1) },
  };
}

function buildTypeComparisonInsight(entries: Entry[]): ChartInsightMeta {
  const top = dominantType(entries);
  const strengths = entries.filter((entry) => entry.type === "strength").length;
  const weaknesses = entries.filter((entry) => entry.type === "weakness").length;
  const ratio =
    strengths + weaknesses > 0
      ? Math.round((strengths / (strengths + weaknesses)) * 100)
      : 0;

  return {
    titleKey: top ? "chartInsights.typeComparison.title" : "chartInsights.typeComparison.titleEmpty",
    descriptionKey: "chartInsights.typeComparison.description",
    takeawayKey:
      ratio >= 55
        ? "chartInsights.typeComparison.takeawayStrong"
        : ratio <= 45
          ? "chartInsights.typeComparison.takeawayWeak"
          : "chartInsights.typeComparison.takeawayBalanced",
    takeawayValues: { type: top ?? "strength", ratio },
  };
}

function buildConsistencyInsight(
  consistency: ConsistencyDataPoint[]
): ChartInsightMeta {
  const counts = consistency.map((point) => point.entryCount);
  const direction = trendDirection(counts);
  const total = counts.reduce((sum, count) => sum + count, 0);
  const peak = Math.max(...counts, 0);

  return {
    titleKey: `chartInsights.consistency.title.${direction}`,
    descriptionKey: "chartInsights.consistency.description",
    takeawayKey: `chartInsights.consistency.takeaway.${direction}`,
    takeawayValues: { total, peak },
  };
}

function buildTagsInsight(tags: TagDistributionPoint[] | null): ChartInsightMeta | null {
  if (!tags || tags.length === 0) return null;
  const top = tags[0];
  return {
    titleKey: "chartInsights.tags.title",
    descriptionKey: "chartInsights.tags.description",
    takeawayKey: "chartInsights.tags.takeaway",
    takeawayValues: { tag: top.tag, count: top.count },
  };
}

function buildCorrelationInsight(correlation: CorrelationPoint[]): ChartInsightMeta {
  if (correlation.length < 2) {
    return {
      titleKey: "chartInsights.correlation.titleEmpty",
      descriptionKey: "chartInsights.correlation.description",
      takeawayKey: "chartInsights.correlation.takeawayEmpty",
    };
  }

  const efforts = correlation.map((point) => point.effort);
  const outcomes = correlation.map((point) => point.outcome);
  const effortTrend = trendDirection(efforts);
  const outcomeTrend = trendDirection(outcomes);
  const aligned = effortTrend === outcomeTrend && effortTrend !== "flat";

  return {
    titleKey: aligned
      ? "chartInsights.correlation.titleAligned"
      : "chartInsights.correlation.titleMixed",
    descriptionKey: "chartInsights.correlation.description",
    takeawayKey: aligned
      ? "chartInsights.correlation.takeawayAligned"
      : "chartInsights.correlation.takeawayMixed",
  };
}

function buildHeatmapInsight(heatmap: HeatmapDay[]): ChartInsightMeta {
  const activeDays = heatmap.filter((day) => day.count > 0).length;
  const totalEntries = heatmap.reduce((sum, day) => sum + day.count, 0);
  const streak = heatmap.reduce((max, day) => Math.max(max, day.count), 0);

  return {
    titleKey:
      activeDays >= 14
        ? "chartInsights.heatmap.titleActive"
        : "chartInsights.heatmap.titleSparse",
    descriptionKey: "chartInsights.heatmap.description",
    takeawayKey:
      activeDays >= 14
        ? "chartInsights.heatmap.takeawayActive"
        : "chartInsights.heatmap.takeawaySparse",
    takeawayValues: { activeDays, totalEntries, streak },
  };
}

function buildAnalyticsInsights(
  entries: Entry[],
  growth: GrowthDataPoint[],
  consistency: ConsistencyDataPoint[],
  tagsBreakdown: TagDistributionPoint[] | null,
  correlation: CorrelationPoint[],
  heatmap: HeatmapDay[]
): AnalyticsData["insights"] {
  return {
    growth: buildGrowthInsight(entries, growth),
    typeComparison: buildTypeComparisonInsight(entries),
    consistency: buildConsistencyInsight(consistency),
    tags: buildTagsInsight(tagsBreakdown),
    correlation: buildCorrelationInsight(correlation),
    heatmap: buildHeatmapInsight(heatmap),
  };
}

export function computeTypeDistribution(
  entries: Entry[]
): DistributionDataPoint[] {
  return ENTRY_TYPES
    .map((type) => ({
      name: type,
      value: entries.filter((e) => e.type === type).length,
      type,
      fill: DISTRIBUTION_COLORS[type],
    }))
    .filter((item) => item.value > 0);
}

export function computeActivityHeatmap(entries: Entry[]): HeatmapDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = HEATMAP_WEEKS * 7;
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - totalDays + 1);

  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = entry.createdAt.slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const heatmap: HeatmapDay[] = [];
  const cursor = new Date(startDate);

  while (cursor <= today) {
    const date = toDateKey(cursor);
    const weekStart = startOfWeek(cursor);
    const weekIndex = Math.floor(
      (weekStart.getTime() - startOfWeek(startDate).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    heatmap.push({
      date,
      count: counts.get(date) ?? 0,
      dayOfWeek: cursor.getDay(),
      weekIndex: Math.max(0, weekIndex),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return heatmap;
}

export function generateInsights(entries: Entry[]): Insight[] {
  const insights: Insight[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const last7Days = entries.filter(
    (e) => now - new Date(e.createdAt).getTime() <= 7 * dayMs
  );
  const last14Days = entries.filter(
    (e) => now - new Date(e.createdAt).getTime() <= 14 * dayMs
  );
  const days14to28 = entries.filter((e) => {
    const age = now - new Date(e.createdAt).getTime();
    return age > 14 * dayMs && age <= 28 * dayMs;
  });

  if (entries.length === 0) {
    insights.push({
      id: "empty",
      tone: "neutral",
      messageKey: "empty",
    });
    return insights;
  }

  const lastEntry = entries.reduce((latest, e) =>
    new Date(e.createdAt) > new Date(latest.createdAt) ? e : latest
  );
  const daysSinceLastEntry = Math.floor(
    (now - new Date(lastEntry.createdAt).getTime()) / dayMs
  );

  if (daysSinceLastEntry >= 7) {
    insights.push({
      id: "low-activity",
      tone: "warning",
      messageKey: "lowActivity",
      values: { days: daysSinceLastEntry },
    });
  }

  const weaknessTagCounts = new Map<string, number>();
  for (const entry of last7Days.filter((e) => e.type === "weakness")) {
    for (const tag of entry.tags) {
      weaknessTagCounts.set(tag, (weaknessTagCounts.get(tag) ?? 0) + 1);
    }
  }
  for (const [tag, count] of weaknessTagCounts) {
    if (count >= 2) {
      insights.push({
        id: `weakness-tag-${tag}`,
        tone: "warning",
        messageKey: "weaknessTag",
        values: { tag, count },
      });
    }
  }

  const avg = (list: Entry[]) =>
    list.length > 0
      ? list.reduce((s, e) => s + e.rating, 0) / list.length
      : 0;

  const recentAvg = avg(last14Days);
  const priorAvg = avg(days14to28);

  if (last14Days.length >= 2 && days14to28.length >= 2 && recentAvg > priorAvg) {
    insights.push({
      id: "positive-rating-trend",
      tone: "positive",
      messageKey: "positiveRatingTrend",
      values: {
        prior: priorAvg.toFixed(1),
        recent: recentAvg.toFixed(1),
      },
    });
  }

  const strengthTagCounts = new Map<string, number>();
  for (const entry of entries.filter((e) => e.type === "strength")) {
    for (const tag of entry.tags) {
      strengthTagCounts.set(tag, (strengthTagCounts.get(tag) ?? 0) + 1);
    }
  }
  const topStrengthTag = [...strengthTagCounts.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0];
  if (topStrengthTag && topStrengthTag[1] >= 3) {
    insights.push({
      id: `strength-tag-${topStrengthTag[0]}`,
      tone: "positive",
      messageKey: "strengthTag",
      values: { tag: topStrengthTag[0], count: topStrengthTag[1] },
    });
  }

  const recentIds = new Set(last7Days.map((e) => e.id));
  const recentStrengthTags = new Set(
    last7Days.filter((e) => e.type === "strength").flatMap((e) => e.tags)
  );
  for (const tag of recentStrengthTags) {
    const tagEntries = entries.filter((e) => e.tags.includes(tag));
    if (tagEntries.length < 3) continue;
    const sorted = [...tagEntries].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const firstHalf = sorted.slice(0, Math.ceil(sorted.length / 2));
    const secondHalf = sorted.slice(Math.ceil(sorted.length / 2));
    if (
      avg(secondHalf) > avg(firstHalf) &&
      secondHalf.some((e) => recentIds.has(e.id))
    ) {
      insights.push({
        id: `improving-${tag}`,
        tone: "positive",
        messageKey: "improving",
        values: { tag },
      });
      break;
    }
  }

  if (insights.length === 0) {
    insights.push({
      id: "steady",
      tone: "neutral",
      messageKey: "steady",
    });
  }

  return insights;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const entries = await getAllEntries();
  const growth = computeGrowthOverTime(entries);
  const consistency = computeActivityConsistency(entries);
  const tagsBreakdown = computeTagsBreakdown(entries);
  const correlation = computeEffortOutcomeCorrelation(entries);
  const heatmap = computeActivityHeatmap(entries);

  return {
    growth,
    distribution: computeTypeDistribution(entries),
    typeComparison: computeTypeComparison(entries),
    consistency,
    tagsBreakdown,
    correlation,
    heatmap,
    heatmapWeeks: HEATMAP_WEEKS,
    insights: buildAnalyticsInsights(
      entries,
      growth,
      consistency,
      tagsBreakdown,
      correlation,
      heatmap
    ),
  };
}

export async function getInsights(): Promise<Insight[]> {
  const entries = await getAllEntries();
  return generateInsights(entries);
}
