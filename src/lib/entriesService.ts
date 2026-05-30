import { db } from "@/lib/db";
import { parseTags } from "@/lib/parseTags";
import type {
  DashboardStats,
  Entry,
  EntryInput,
  EntryType,
} from "@/types/entry";

function generateId(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function getAllEntries(): Promise<Entry[]> {
  return db.entries.orderBy("createdAt").reverse().toArray();
}

export async function getEntryById(id: string): Promise<Entry | undefined> {
  return db.entries.get(id);
}

export async function createEntry(input: EntryInput): Promise<Entry> {
  const timestamp = nowIso();
  const entry: Entry = {
    id: generateId(),
    title: input.title?.trim() || undefined,
    type: input.type,
    description: input.description.trim(),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    rating: Math.min(10, Math.max(1, input.rating)),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await db.entries.add(entry);
  return entry;
}

export async function updateEntry(
  id: string,
  input: EntryInput
): Promise<Entry | undefined> {
  const existing = await db.entries.get(id);
  if (!existing) return undefined;

  const updated: Entry = {
    ...existing,
    title: input.title?.trim() || undefined,
    type: input.type,
    description: input.description.trim(),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    rating: Math.min(10, Math.max(1, input.rating)),
    updatedAt: nowIso(),
  };

  await db.entries.put(updated);
  return updated;
}

export async function deleteEntry(id: string): Promise<boolean> {
  const existing = await db.entries.get(id);
  if (!existing) return false;
  await db.entries.delete(id);
  return true;
}

export async function getEntriesByType(type: EntryType): Promise<Entry[]> {
  return db.entries.where("type").equals(type).reverse().sortBy("createdAt");
}

export async function getEntriesByTag(tag: string): Promise<Entry[]> {
  return db.entries
    .where("tags")
    .equals(tag)
    .reverse()
    .sortBy("createdAt");
}

export async function getRecentEntries(limit = 5): Promise<Entry[]> {
  return db.entries.orderBy("createdAt").reverse().limit(limit).toArray();
}

export async function getRecentStrengthEntries(
  limit = 3
): Promise<Entry[]> {
  const strengths = await db.entries.where("type").equals("strength").toArray();
  return strengths
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export async function getActivityLastNDays(
  days = 7
): Promise<{ date: string; count: number; label: string }[]> {
  const entries = await db.entries.toArray();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = entry.createdAt.slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const result: { date: string; count: number; label: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({
      date: key,
      count: counts.get(key) ?? 0,
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
    });
  }
  return result;
}

export async function getAllTags(): Promise<string[]> {
  const entries = await db.entries.toArray();
  const tagSet = new Set<string>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const entries = await db.entries.toArray();

  const tagCounts = new Map<string, number>();
  let ratingSum = 0;

  for (const entry of entries) {
    ratingSum += entry.rating;
    for (const tag of entry.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const topTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: entries.length,
    strengths: entries.filter((e) => e.type === "strength").length,
    weaknesses: entries.filter((e) => e.type === "weakness").length,
    skills: entries.filter((e) => e.type === "skill").length,
    notes: entries.filter((e) => e.type === "note").length,
    averageRating:
      entries.length > 0
        ? Math.round((ratingSum / entries.length) * 10) / 10
        : 0,
    topTags,
  };
}

/** @deprecated Use `parseTags` from `@/lib/parseTags` */
export function parseTagsInput(value: string): string[] {
  return parseTags(value);
}

export function formatTagsForInput(tags: string[]): string {
  return tags.join(", ");
}
