import Dexie, { type EntityTable } from "dexie";
import type { Entry } from "@/types/entry";
import type { MotivationalMessage } from "@/types/motivationalMessage";
import type { PersonalInsight } from "@/types/personalInsight";
import type { UserSettings } from "@/types/settings";

class SelfProfileDatabase extends Dexie {
  entries!: EntityTable<Entry, "id">;
  settings!: EntityTable<UserSettings, "id">;
  motivationalMessages!: EntityTable<MotivationalMessage, "id">;
  insights!: EntityTable<PersonalInsight, "id">;

  constructor() {
    super("self-profile-db");

    this.version(1).stores({
      entries: "id, type, createdAt, updatedAt, *tags",
    });

    this.version(2).stores({
      entries: "id, type, createdAt, updatedAt, *tags",
      settings: "id",
      motivationalMessages: "id, createdAt, isFavorite",
      insights: "id, category, confidenceLevel, createdAt, updatedAt",
    });
  }
}

export const db = new SelfProfileDatabase();
