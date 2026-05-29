export type EntryType = "strength" | "weakness" | "skill" | "note";

export interface Entry {
  id: string;
  title?: string;
  type: EntryType;
  description: string;
  tags: string[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface EntryInput {
  title?: string;
  type: EntryType;
  description: string;
  tags: string[];
  rating: number;
}

export interface DashboardStats {
  total: number;
  strengths: number;
  weaknesses: number;
  skills: number;
  notes: number;
  averageRating: number;
  topTags: { tag: string; count: number }[];
}

export const ENTRY_TYPES: EntryType[] = [
  "strength",
  "weakness",
  "skill",
  "note",
];

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  strength: "Strength",
  weakness: "Weakness",
  skill: "Skill",
  note: "Note",
};

export const ENTRY_TYPE_COLORS: Record<
  EntryType,
  { bg: string; text: string; border: string }
> = {
  strength: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/30",
  },
  weakness: {
    bg: "bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-500/30",
  },
  skill: {
    bg: "bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-500/30",
  },
  note: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/30",
  },
};
