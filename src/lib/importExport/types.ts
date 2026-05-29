import type { Entry } from "@/types/entry";
import type { MotivationalMessage } from "@/types/motivationalMessage";
import type { PersonalInsight } from "@/types/personalInsight";
import type { UserSettings } from "@/types/settings";

export const CURRENT_EXPORT_VERSION = 1;

export interface ProfileExportData {
  entries: Entry[];
  insights: PersonalInsight[];
  motivationalMessages: MotivationalMessage[];
  settings: UserSettings | null;
}

export interface ProfileExportFile {
  version: number;
  exportedAt: string;
  data: ProfileExportData;
}

/** Pre-v1 export shape (entries split by type, no insights/messages). */
export interface LegacyExportFile {
  exportedAt: string;
  strengths: Entry[];
  weaknesses: Entry[];
  skills: Entry[];
  notes: Entry[];
}

export interface ImportSummary {
  entriesCount: number;
  insightsCount: number;
  tagsCount: number;
}

export type ParsedProfile = ProfileExportFile;

export type ParseExportError =
  | "invalid_json"
  | "invalid_file"
  | "unsupported_version";
