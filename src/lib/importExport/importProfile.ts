import { db } from "@/lib/db";
import { applyTheme } from "@/lib/settingsService";
import {
  CURRENT_EXPORT_VERSION,
  type ImportSummary,
  type LegacyExportFile,
  type ParseExportError,
  type ParsedProfile,
  type ProfileExportData,
  type ProfileExportFile,
} from "@/lib/importExport/types";
import type { Entry } from "@/types/entry";
import type { MotivationalMessage } from "@/types/motivationalMessage";
import type { PersonalInsight } from "@/types/personalInsight";
import type { UserSettings } from "@/types/settings";
import { SETTINGS_ID } from "@/types/settings";

export type ParseExportResult =
  | { ok: true; profile: ParsedProfile; summary: ImportSummary }
  | { ok: false; error: ParseExportError };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEntry(value: unknown): value is Entry {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    typeof value.description === "string" &&
    Array.isArray(value.tags) &&
    typeof value.rating === "number" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isPersonalInsight(value: unknown): value is PersonalInsight {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.realization === "string" &&
    typeof value.cause === "string" &&
    typeof value.solution === "string" &&
    typeof value.category === "string" &&
    typeof value.confidenceLevel === "number" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isMotivationalMessage(value: unknown): value is MotivationalMessage {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.isFavorite === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isUserSettings(value: unknown): value is UserSettings {
  if (!isRecord(value)) return false;
  return (
    value.id === SETTINGS_ID &&
    (value.theme === "light" || value.theme === "dark") &&
    (value.locale === "en" || value.locale === "ar")
  );
}

function isEntryArray(value: unknown): value is Entry[] {
  return Array.isArray(value) && value.every(isEntry);
}

function normalizeLegacyExport(raw: LegacyExportFile): ProfileExportFile {
  const entries = [
    ...(raw.strengths ?? []),
    ...(raw.weaknesses ?? []),
    ...(raw.skills ?? []),
    ...(raw.notes ?? []),
  ];

  return {
    version: CURRENT_EXPORT_VERSION,
    exportedAt: raw.exportedAt,
    data: {
      entries,
      insights: [],
      motivationalMessages: [],
      settings: null,
    },
  };
}

function isLegacyExportFile(value: unknown): value is LegacyExportFile {
  if (!isRecord(value)) return false;
  if ("version" in value) return false;
  if (typeof value.exportedAt !== "string") return false;

  const keys = ["strengths", "weaknesses", "skills", "notes"] as const;
  const hasAny = keys.some((key) => key in value);
  if (!hasAny) return false;

  for (const key of keys) {
    const arr = value[key];
    if (arr !== undefined && !(Array.isArray(arr) && arr.every(isEntry))) {
      return false;
    }
  }
  return true;
}

function parseExportData(value: unknown): ProfileExportData | null {
  if (!isRecord(value)) return null;

  if (!("entries" in value) || !isEntryArray(value.entries)) {
    return null;
  }

  const insights = value.insights;
  if (
    insights !== undefined &&
    !(Array.isArray(insights) && insights.every(isPersonalInsight))
  ) {
    return null;
  }

  const motivationalMessages = value.motivationalMessages;
  if (
    motivationalMessages !== undefined &&
    !(
      Array.isArray(motivationalMessages) &&
      motivationalMessages.every(isMotivationalMessage)
    )
  ) {
    return null;
  }

  const settings = value.settings;
  if (settings !== undefined && settings !== null && !isUserSettings(settings)) {
    return null;
  }

  return {
    entries: value.entries,
    insights: (insights as PersonalInsight[] | undefined) ?? [],
    motivationalMessages:
      (motivationalMessages as MotivationalMessage[] | undefined) ?? [],
    settings: (settings as UserSettings | null | undefined) ?? null,
  };
}

export function countUniqueTags(entries: Entry[]): number {
  const tags = new Set<string>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      if (tag.trim()) tags.add(tag.trim());
    }
  }
  return tags.size;
}

export function buildImportSummary(data: ProfileExportData): ImportSummary {
  return {
    entriesCount: data.entries.length,
    insightsCount: data.insights.length,
    tagsCount: countUniqueTags(data.entries),
  };
}

export function parseExportFileText(text: string): ParseExportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: "invalid_file" };
  }

  if (isLegacyExportFile(parsed)) {
    const profile = normalizeLegacyExport(parsed);
    return {
      ok: true,
      profile,
      summary: buildImportSummary(profile.data),
    };
  }

  if (typeof parsed.version !== "number") {
    return { ok: false, error: "invalid_file" };
  }

  if (parsed.version > CURRENT_EXPORT_VERSION) {
    return { ok: false, error: "unsupported_version" };
  }

  if (parsed.version !== CURRENT_EXPORT_VERSION) {
    return { ok: false, error: "invalid_file" };
  }

  if (typeof parsed.exportedAt !== "string" || !("data" in parsed)) {
    return { ok: false, error: "invalid_file" };
  }

  const data = parseExportData(parsed.data);
  if (!data) {
    return { ok: false, error: "invalid_file" };
  }

  const profile: ProfileExportFile = {
    version: parsed.version,
    exportedAt: parsed.exportedAt,
    data,
  };

  return {
    ok: true,
    profile,
    summary: buildImportSummary(profile.data),
  };
}

export async function importProfile(profile: ParsedProfile): Promise<ImportSummary> {
  const { data } = profile;

  await db.transaction(
    "rw",
    db.entries,
    db.insights,
    db.motivationalMessages,
    db.settings,
    async () => {
      await db.entries.clear();
      await db.insights.clear();
      await db.motivationalMessages.clear();
      await db.settings.clear();

      if (data.entries.length > 0) {
        await db.entries.bulkPut(data.entries);
      }
      if (data.insights.length > 0) {
        await db.insights.bulkPut(data.insights);
      }
      if (data.motivationalMessages.length > 0) {
        await db.motivationalMessages.bulkPut(data.motivationalMessages);
      }
      if (data.settings) {
        await db.settings.put(data.settings);
      }
    }
  );

  if (data.settings) {
    applyTheme(data.settings.theme);
  }

  return buildImportSummary(data);
}
