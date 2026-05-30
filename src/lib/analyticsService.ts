import { getAllEntries } from "@/lib/entriesService";
import { getInsightConfidence } from "@/lib/analyticsMaturity";
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
import { getCustomEntryTypes, isCoreEntryType, resolveTypeChartFill } from "@/lib/entryTypesService";
import type { CustomEntryType } from "@/types/customEntryType";
import type { Entry } from "@/types/entry";

const TAG_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
];

/** ~1 year of weeks — matches GitHub contribution graph density */
const HEATMAP_WEEKS = 53;
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

/** Sunday-based week — matches heatmap rows (0 = Sun … 6 = Sat). */
function startOfWeekSunday(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
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

export function computeTypeComparison(
  entries: Entry[],
  customTypes: CustomEntryType[]
): BarComparisonPoint[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.type, (counts.get(entry.type) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([type, count]) => ({
      type,
      label: type,
      count,
      fill: resolveTypeChartFill(type, customTypes),
    }))
    .sort((a, b) => b.count - a.count);
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

function dominantType(entries: Entry[], customTypes: CustomEntryType[]): string | null {
  const comparison = computeTypeComparison(entries, customTypes);
  if (comparison.length === 0) return null;
  return comparison[0].type;
}

function buildGrowthInsight(
  entryCount: number,
  growth: GrowthDataPoint[]
): ChartInsightMeta {
  const confidence = getInsightConfidence(entryCount);
  const ratings = growth.map((point) => point.averageRating);
  const direction = trendDirection(ratings);
  const latest = ratings.at(-1) ?? 0;
  const earliest = ratings[0] ?? latest;
  const delta = Math.abs(latest - earliest).toFixed(1);

  if (confidence === "low") {
    return {
      titleKey: "chartInsights.growth.titleEarly",
      descriptionKey: "chartInsights.growth.description",
      takeawayKey: "chartInsights.growth.takeawayEarly",
      takeawayValues: { latest: latest.toFixed(1) },
    };
  }

  if (confidence === "medium") {
    return {
      titleKey: `chartInsights.growth.titleMedium.${direction}`,
      descriptionKey: "chartInsights.growth.description",
      takeawayKey: `chartInsights.growth.takeawayMedium.${direction}`,
      takeawayValues: { delta, latest: latest.toFixed(1) },
    };
  }

  return {
    titleKey: `chartInsights.growth.title.${direction}`,
    descriptionKey: "chartInsights.growth.description",
    takeawayKey: `chartInsights.growth.takeaway.${direction}`,
    takeawayValues: { delta, latest: latest.toFixed(1) },
  };
}

function buildTypeComparisonInsight(
  entryCount: number,
  entries: Entry[],
  customTypes: CustomEntryType[]
): ChartInsightMeta {
  const confidence = getInsightConfidence(entryCount);
  const top = dominantType(entries, customTypes);
  const topCount = top
    ? entries.filter((entry) => entry.type === top).length
    : 0;
  const strengths = entries.filter((entry) => entry.type === "strength").length;
  const weaknesses = entries.filter((entry) => entry.type === "weakness").length;
  const ratio =
    strengths + weaknesses > 0
      ? Math.round((strengths / (strengths + weaknesses)) * 100)
      : 0;

  if (!top) {
    return {
      titleKey: "chartInsights.typeComparison.titleEmpty",
      descriptionKey: "chartInsights.typeComparison.description",
      takeawayKey: "chartInsights.typeComparison.takeawayEarly",
    };
  }

  if (confidence !== "high" || !isCoreEntryType(top)) {
    return {
      titleKey: "chartInsights.typeComparison.titleEarly",
      descriptionKey: "chartInsights.typeComparison.description",
      takeawayKey: "chartInsights.typeComparison.takeawayEarly",
      takeawayValues: { type: top, count: topCount, ratio },
    };
  }

  return {
    titleKey: `chartInsights.typeComparison.titleByType.${top}`,
    descriptionKey: "chartInsights.typeComparison.description",
    takeawayKey:
      ratio >= 55
        ? "chartInsights.typeComparison.takeawayStrong"
        : ratio <= 45
          ? "chartInsights.typeComparison.takeawayWeak"
          : "chartInsights.typeComparison.takeawayBalanced",
    takeawayValues: { type: top, count: topCount, ratio },
  };
}

function buildConsistencyInsight(
  entryCount: number,
  consistency: ConsistencyDataPoint[]
): ChartInsightMeta {
  const confidence = getInsightConfidence(entryCount);
  const counts = consistency.map((point) => point.entryCount);
  const direction = trendDirection(counts);
  const total = counts.reduce((sum, count) => sum + count, 0);
  const peak = Math.max(...counts, 0);

  if (confidence === "low") {
    return {
      titleKey: "chartInsights.consistency.titleEarly",
      descriptionKey: "chartInsights.consistency.description",
      takeawayKey: "chartInsights.consistency.takeawayEarly",
      takeawayValues: { total, peak },
    };
  }

  if (confidence === "medium") {
    return {
      titleKey: `chartInsights.consistency.titleMedium.${direction}`,
      descriptionKey: "chartInsights.consistency.description",
      takeawayKey: `chartInsights.consistency.takeawayMedium.${direction}`,
      takeawayValues: { total, peak },
    };
  }

  return {
    titleKey: `chartInsights.consistency.title.${direction}`,
    descriptionKey: "chartInsights.consistency.description",
    takeawayKey: `chartInsights.consistency.takeaway.${direction}`,
    takeawayValues: { total, peak },
  };
}

function buildTagsInsight(
  entryCount: number,
  tags: TagDistributionPoint[] | null
): ChartInsightMeta | null {
  if (!tags || tags.length === 0) return null;
  const top = tags[0];
  const confidence = getInsightConfidence(entryCount);

  if (confidence === "low") {
    return {
      titleKey: "chartInsights.tags.titleEarly",
      descriptionKey: "chartInsights.tags.description",
      takeawayKey: "chartInsights.tags.takeawayEarly",
      takeawayValues: { tag: top.tag, count: top.count },
    };
  }

  if (confidence === "medium") {
    return {
      titleKey: "chartInsights.tags.titleMedium",
      descriptionKey: "chartInsights.tags.description",
      takeawayKey: "chartInsights.tags.takeawayMedium",
      takeawayValues: { tag: top.tag, count: top.count },
    };
  }

  return {
    titleKey: "chartInsights.tags.title",
    descriptionKey: "chartInsights.tags.description",
    takeawayKey: "chartInsights.tags.takeaway",
    takeawayValues: { tag: top.tag, count: top.count },
  };
}

function buildCorrelationInsight(
  entryCount: number,
  correlation: CorrelationPoint[]
): ChartInsightMeta {
  if (correlation.length < 2) {
    return {
      titleKey: "chartInsights.correlation.titleEarly",
      descriptionKey: "chartInsights.correlation.description",
      takeawayKey: "chartInsights.correlation.takeawayEarly",
    };
  }

  const confidence = getInsightConfidence(entryCount);
  if (confidence !== "high") {
    return {
      titleKey: "chartInsights.correlation.titleEarly",
      descriptionKey: "chartInsights.correlation.description",
      takeawayKey: "chartInsights.correlation.takeawayEarly",
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

function buildHeatmapInsight(
  entryCount: number,
  heatmap: HeatmapDay[]
): ChartInsightMeta {
  const activeDays = heatmap.filter((day) => day.count > 0).length;
  const totalEntries = heatmap.reduce((sum, day) => sum + day.count, 0);
  const streak = heatmap.reduce((max, day) => Math.max(max, day.count), 0);
  const confidence = getInsightConfidence(entryCount);

  if (confidence !== "high") {
    return {
      titleKey: "chartInsights.heatmap.titlePreview",
      descriptionKey: "chartInsights.heatmap.description",
      takeawayKey: "chartInsights.heatmap.takeawayPreview",
      takeawayValues: { activeDays, totalEntries, streak },
    };
  }

  const wellSpread = activeDays >= 14;
  return {
    titleKey: wellSpread
      ? "chartInsights.heatmap.titleActive"
      : "chartInsights.heatmap.titleModerate",
    descriptionKey: "chartInsights.heatmap.description",
    takeawayKey: wellSpread
      ? "chartInsights.heatmap.takeawayActive"
      : "chartInsights.heatmap.takeawayModerate",
    takeawayValues: { activeDays, totalEntries, streak },
  };
}

function buildAnalyticsInsights(
  entries: Entry[],
  growth: GrowthDataPoint[],
  consistency: ConsistencyDataPoint[],
  tagsBreakdown: TagDistributionPoint[] | null,
  correlation: CorrelationPoint[],
  heatmap: HeatmapDay[],
  customTypes: CustomEntryType[]
): AnalyticsData["insights"] {
  const entryCount = entries.length;
  return {
    growth: buildGrowthInsight(entryCount, growth),
    typeComparison: buildTypeComparisonInsight(entryCount, entries, customTypes),
    consistency: buildConsistencyInsight(entryCount, consistency),
    tags: buildTagsInsight(entryCount, tagsBreakdown),
    correlation: buildCorrelationInsight(entryCount, correlation),
    heatmap: buildHeatmapInsight(entryCount, heatmap),
  };
}

export function computeTypeDistribution(
  entries: Entry[],
  customTypes: CustomEntryType[]
): DistributionDataPoint[] {
  return computeTypeComparison(entries, customTypes).map((item) => ({
    name: item.type,
    value: item.count,
    type: item.type,
    fill: item.fill,
  }));
}

export function computeActivityHeatmap(entries: Entry[]): HeatmapDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - (HEATMAP_WEEKS * 7 - 1));
  const gridStart = startOfWeekSunday(rangeStart);

  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = entry.createdAt.slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const heatmap: HeatmapDay[] = [];
  const cursor = new Date(gridStart);

  while (cursor <= today) {
    const date = toDateKey(cursor);
    const dayOfWeek = cursor.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const weekIndex = Math.floor(
      (cursor.getTime() - gridStart.getTime()) / (7 * dayMs)
    );

    heatmap.push({
      date,
      count: counts.get(date) ?? 0,
      dayOfWeek,
      weekIndex,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return heatmap;
}

export function generateInsights(entries: Entry[]): Insight[] {
  if (entries.length === 0) {
    return [{ id: "empty", tone: "neutral", messageKey: "empty" }];
  }

  if (entries.length <= 3) {
    return [
      {
        id: "onboarding-early",
        tone: "neutral",
        messageKey: "onboardingEarly",
        values: { count: entries.length },
      },
      {
        id: "onboarding-honest",
        tone: "positive",
        messageKey: "onboardingHonest",
      },
      {
        id: "onboarding-next",
        tone: "neutral",
        messageKey: "onboardingNext",
      },
    ];
  }

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

  const lastEntry = entries.reduce((latest, e) =>
    new Date(e.createdAt) > new Date(latest.createdAt) ? e : latest
  );
  const daysSinceLastEntry = Math.floor(
    (now - new Date(lastEntry.createdAt).getTime()) / dayMs
  );

  if (entries.length >= 10 && daysSinceLastEntry >= 7) {
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

  if (
    entries.length >= 15 &&
    last14Days.length >= 2 &&
    days14to28.length >= 2 &&
    recentAvg > priorAvg
  ) {
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
    if (entries.length < 20) break;
    const tagEntries = entries.filter((e) => e.tags.includes(tag));
    if (tagEntries.length < 4) continue;
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
  const customTypes = await getCustomEntryTypes();
  const growth = computeGrowthOverTime(entries);
  const consistency = computeActivityConsistency(entries);
  const tagsBreakdown = computeTagsBreakdown(entries);
  const correlation = computeEffortOutcomeCorrelation(entries);
  const heatmap = computeActivityHeatmap(entries);

  return {
    entryCount: entries.length,
    growth,
    distribution: computeTypeDistribution(entries, customTypes),
    typeComparison: computeTypeComparison(entries, customTypes),
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
      heatmap,
      customTypes
    ),
  };
}

export async function getInsights(): Promise<Insight[]> {
  const entries = await getAllEntries();
  return generateInsights(entries);
}
