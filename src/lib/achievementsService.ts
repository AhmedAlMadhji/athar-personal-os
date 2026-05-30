import { getAllEntries } from "@/lib/entriesService";
import { isCoreEntryType } from "@/lib/entryTypesService";
import type {
  AchievementContext,
  AchievementDefinition,
  EarnedAchievement,
} from "@/types/achievement";
import type { Entry } from "@/types/entry";

const DAY_MS = 24 * 60 * 60 * 1000;

function avgRatings(list: Entry[]): number {
  if (list.length === 0) return 0;
  return list.reduce((s, e) => s + e.rating, 0) / list.length;
}

function activeDaysInLast(entries: Entry[], days: number, now: number): number {
  const cutoff = now - days * DAY_MS;
  const daysSet = new Set<string>();
  for (const entry of entries) {
    const ts = new Date(entry.createdAt).getTime();
    if (ts >= cutoff) daysSet.add(entry.createdAt.slice(0, 10));
  }
  return daysSet.size;
}

function entriesInLast(entries: Entry[], days: number, now: number): Entry[] {
  const cutoff = now - days * DAY_MS;
  return entries.filter((e) => new Date(e.createdAt).getTime() >= cutoff);
}

const DEFINITIONS: AchievementDefinition[] = [
  {
    id: "first-reflection",
    category: "commitment",
    messageKey: "firstReflection",
    descriptionKey: "firstReflectionDesc",
    check: ({ entries }) =>
      entries.length >= 1
        ? {
            id: "first-reflection",
            category: "commitment",
            messageKey: "firstReflection",
            earnedAt: entries[entries.length - 1].createdAt,
          }
        : null,
  },
  {
    id: "honest-inventory",
    category: "awareness",
    messageKey: "honestInventory",
    descriptionKey: "honestInventoryDesc",
    check: ({ entries }) => {
      const hasStrength = entries.some((e) => e.type === "strength");
      const hasWeakness = entries.some((e) => e.type === "weakness");
      if (!hasStrength || !hasWeakness) return null;
      const latest = entries
        .filter((e) => e.type === "strength" || e.type === "weakness")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
      return {
        id: "honest-inventory",
        category: "awareness",
        messageKey: "honestInventory",
        earnedAt: latest.createdAt,
      };
    },
  },
  {
    id: "reflection-rhythm",
    category: "consistency",
    messageKey: "reflectionRhythm",
    descriptionKey: "reflectionRhythmDesc",
    check: ({ entries, now }) => {
      const recent = entriesInLast(entries, 7, now);
      if (recent.length < 3) return null;
      return {
        id: "reflection-rhythm",
        category: "consistency",
        messageKey: "reflectionRhythm",
        earnedAt: recent[0].createdAt,
        values: { count: recent.length },
      };
    },
  },
  {
    id: "steady-presence",
    category: "consistency",
    messageKey: "steadyPresence",
    descriptionKey: "steadyPresenceDesc",
    check: ({ entries, now }) => {
      const active = activeDaysInLast(entries, 28, now);
      if (active < 7) return null;
      return {
        id: "steady-presence",
        category: "consistency",
        messageKey: "steadyPresence",
        earnedAt: entries[0].createdAt,
        values: { days: active },
      };
    },
  },
  {
    id: "depth-milestone",
    category: "commitment",
    messageKey: "depthMilestone",
    descriptionKey: "depthMilestoneDesc",
    check: ({ entries }) => {
      if (entries.length < 10) return null;
      const sorted = [...entries].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return {
        id: "depth-milestone",
        category: "commitment",
        messageKey: "depthMilestone",
        earnedAt: sorted[9].createdAt,
        values: { count: 10 },
      };
    },
  },
  {
    id: "self-portrait",
    category: "commitment",
    messageKey: "selfPortrait",
    descriptionKey: "selfPortraitDesc",
    check: ({ entries }) => {
      if (entries.length < 30) return null;
      const sorted = [...entries].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      return {
        id: "self-portrait",
        category: "commitment",
        messageKey: "selfPortrait",
        earnedAt: sorted[29].createdAt,
        values: { count: 30 },
      };
    },
  },
  {
    id: "mood-lift",
    category: "growth",
    messageKey: "moodLift",
    descriptionKey: "moodLiftDesc",
    check: ({ entries, now }) => {
      if (entries.length < 15) return null;
      const recent = entriesInLast(entries, 14, now);
      const prior = entries.filter((e) => {
        const age = now - new Date(e.createdAt).getTime();
        return age > 14 * DAY_MS && age <= 28 * DAY_MS;
      });
      if (recent.length < 3 || prior.length < 3) return null;
      const recentAvg = avgRatings(recent);
      const priorAvg = avgRatings(prior);
      if (recentAvg <= priorAvg + 0.3) return null;
      return {
        id: "mood-lift",
        category: "growth",
        messageKey: "moodLift",
        earnedAt: recent[0].createdAt,
        values: {
          prior: priorAvg.toFixed(1),
          recent: recentAvg.toFixed(1),
        },
      };
    },
  },
  {
    id: "tag-thread",
    category: "awareness",
    messageKey: "tagThread",
    descriptionKey: "tagThreadDesc",
    check: ({ entries }) => {
      const counts = new Map<string, number>();
      for (const entry of entries) {
        for (const tag of entry.tags) {
          counts.set(tag, (counts.get(tag) ?? 0) + 1);
        }
      }
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      if (!top || top[1] < 5) return null;
      return {
        id: "tag-thread",
        category: "awareness",
        messageKey: "tagThread",
        earnedAt: entries.find((e) => e.tags.includes(top[0]))!.createdAt,
        values: { tag: top[0], count: top[1] },
      };
    },
  },
  {
    id: "core-explorer",
    category: "awareness",
    messageKey: "coreExplorer",
    descriptionKey: "coreExplorerDesc",
    check: ({ entries }) => {
      const used = new Set(
        entries.map((e) => e.type).filter((t) => isCoreEntryType(t))
      );
      if (used.size < 4) return null;
      return {
        id: "core-explorer",
        category: "awareness",
        messageKey: "coreExplorer",
        earnedAt: entries[0].createdAt,
      };
    },
  },
];

export async function getEarnedAchievements(): Promise<EarnedAchievement[]> {
  const entries = await getAllEntries();
  const now = Date.now();
  const ctx: AchievementContext = { entries, now };

  const earned: EarnedAchievement[] = [];
  for (const def of DEFINITIONS) {
    const result = def.check(ctx);
    if (result) earned.push(result);
  }

  return earned.sort(
    (a, b) =>
      new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  );
}

export const ACHIEVEMENT_DEFINITIONS = DEFINITIONS;
