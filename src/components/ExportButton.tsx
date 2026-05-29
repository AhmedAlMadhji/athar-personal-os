"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  downloadExportProfile,
  exportProfile,
} from "@/lib/importExport/exportProfile";

interface ExportButtonProps {
  variant?: "default" | "toolbar";
}

export function ExportButton({ variant = "default" }: ExportButtonProps) {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const profile = await exportProfile();
      downloadExportProfile(profile);
    } finally {
      setExporting(false);
    }
  }

  const label = exporting ? tc("exporting") : t("exportProfile");

  if (variant === "toolbar") {
    return (
      <button
        type="button"
        onClick={() => void handleExport()}
        disabled={exporting}
        className="rounded px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors duration-150 hover:bg-white hover:text-zinc-900 disabled:opacity-60 dark:text-zinc-400 dark:hover:bg-zinc-900/80 dark:hover:text-zinc-100"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleExport()}
      disabled={exporting}
      className="rounded-md border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors duration-150 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
    >
      {label}
    </button>
  );
}
