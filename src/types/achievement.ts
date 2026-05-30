export type AchievementCategory =
  | "consistency"
  | "growth"
  | "commitment"
  | "awareness";

export interface EarnedAchievement {
  id: string;
  category: AchievementCategory;
  messageKey: string;
  earnedAt: string;
  values?: Record<string, string | number>;
}

export interface AchievementDefinition {
  id: string;
  category: AchievementCategory;
  messageKey: string;
  descriptionKey: string;
  check: (ctx: AchievementContext) => EarnedAchievement | null;
}

export interface AchievementContext {
  entries: import("@/types/entry").Entry[];
  now: number;
}
