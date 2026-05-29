import { db } from "@/lib/db";
import { getSettings } from "@/lib/settingsService";
import {
  CURRENT_EXPORT_VERSION,
  type ProfileExportFile,
} from "@/lib/importExport/types";

function nowIso(): string {
  return new Date().toISOString();
}

export async function exportProfile(): Promise<ProfileExportFile> {
  const [entries, insights, motivationalMessages, settings] = await Promise.all([
    db.entries.toArray(),
    db.insights.toArray(),
    db.motivationalMessages.toArray(),
    getSettings(),
  ]);

  return {
    version: CURRENT_EXPORT_VERSION,
    exportedAt: nowIso(),
    data: {
      entries,
      insights,
      motivationalMessages,
      settings,
    },
  };
}

export function downloadExportProfile(profile: ProfileExportFile): void {
  const blob = new Blob([JSON.stringify(profile, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `self-profile-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
