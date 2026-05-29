import { db } from "@/lib/db";
import type {
  InsightCategory,
  InsightsDashboardStats,
  PersonalInsight,
  PersonalInsightInput,
} from "@/types/personalInsight";

function nowIso(): string {
  return new Date().toISOString();
}

function clampConfidence(level: number): number {
  return Math.min(10, Math.max(1, Math.round(level)));
}

export async function getAllPersonalInsights(): Promise<PersonalInsight[]> {
  return db.insights.orderBy("createdAt").reverse().toArray();
}

export async function getPersonalInsightById(
  id: string
): Promise<PersonalInsight | undefined> {
  return db.insights.get(id);
}

export async function createPersonalInsight(
  input: PersonalInsightInput
): Promise<PersonalInsight> {
  const timestamp = nowIso();
  const insight: PersonalInsight = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    realization: input.realization.trim(),
    cause: input.cause.trim(),
    solution: input.solution.trim(),
    category: input.category,
    confidenceLevel: clampConfidence(input.confidenceLevel),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await db.insights.add(insight);
  return insight;
}

export async function updatePersonalInsight(
  id: string,
  input: PersonalInsightInput
): Promise<PersonalInsight | undefined> {
  const existing = await db.insights.get(id);
  if (!existing) return undefined;

  const updated: PersonalInsight = {
    ...existing,
    title: input.title.trim(),
    realization: input.realization.trim(),
    cause: input.cause.trim(),
    solution: input.solution.trim(),
    category: input.category,
    confidenceLevel: clampConfidence(input.confidenceLevel),
    updatedAt: nowIso(),
  };

  await db.insights.put(updated);
  return updated;
}

export async function deletePersonalInsight(id: string): Promise<boolean> {
  const existing = await db.insights.get(id);
  if (!existing) return false;
  await db.insights.delete(id);
  return true;
}

export async function getInsightsDashboardStats(): Promise<InsightsDashboardStats> {
  const all = await db.insights.toArray();

  const categoryCounts = new Map<string, number>();
  for (const insight of all) {
    categoryCounts.set(
      insight.category,
      (categoryCounts.get(insight.category) ?? 0) + 1
    );
  }

  const topCategories = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const highestConfidence = [...all]
    .sort((a, b) => b.confidenceLevel - a.confidenceLevel)
    .slice(0, 5);

  const recent = [...all]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    total: all.length,
    topCategories,
    highestConfidence,
    recent,
  };
}

export async function searchPersonalInsights(options: {
  query?: string;
  category?: InsightCategory | "all";
  sortBy?: "date" | "confidence";
}): Promise<PersonalInsight[]> {
  let results = await getAllPersonalInsights();

  if (options.category && options.category !== "all") {
    results = results.filter((i) => i.category === options.category);
  }

  if (options.query?.trim()) {
    const q = options.query.trim().toLowerCase();
    results = results.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.realization.toLowerCase().includes(q) ||
        i.cause.toLowerCase().includes(q) ||
        i.solution.toLowerCase().includes(q)
    );
  }

  if (options.sortBy === "confidence") {
    results.sort((a, b) => b.confidenceLevel - a.confidenceLevel);
  } else {
    results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return results;
}

export async function getRandomPersonalInsight(): Promise<PersonalInsight | null> {
  const all = await db.insights.toArray();
  if (all.length === 0) return null;
  return all[Math.floor(Math.random() * all.length)];
}
