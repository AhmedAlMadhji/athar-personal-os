export const INSIGHT_CATEGORIES = [
  "Communication",
  "Discipline",
  "Productivity",
  "Learning",
  "Emotional",
  "Career",
  "Health",
  "Relationships",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export interface PersonalInsight {
  id: string;
  title: string;
  realization: string;
  cause: string;
  solution: string;
  category: InsightCategory;
  confidenceLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInsightInput {
  title: string;
  realization: string;
  cause: string;
  solution: string;
  category: InsightCategory;
  confidenceLevel: number;
}

export interface InsightsDashboardStats {
  total: number;
  topCategories: { category: string; count: number }[];
  highestConfidence: PersonalInsight[];
  recent: PersonalInsight[];
}
