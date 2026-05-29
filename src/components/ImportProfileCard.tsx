"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAlert, useConfirm } from "@/components/ui/DialogProvider";
import { useToast } from "@/components/ui/ToastProvider";
import {
  importProfile,
  parseExportFileText,
} from "@/lib/importExport/importProfile";
import { dispatchProfileImported } from "@/lib/profileEvents";
import { useRef, useState } from "react";

export function ImportProfileCard() {
  const t = useTranslations("settings.import");
  const tc = useTranslations("common");
  const alert = useAlert();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  function openFilePicker() {
    inputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    let text: string;
    try {
      text = await file.text();
    } catch {
      await alert({
        title: t("failedTitle"),
        description: t("failedDescription"),
        variant: "error",
      });
      return;
    }

    const parsed = parseExportFileText(text);
    if (!parsed.ok) {
      if (parsed.error === "unsupported_version") {
        await alert({
          title: t("unsupportedTitle"),
          description: t("unsupportedDescription"),
          variant: "warning",
        });
      } else {
        await alert({
          title: t("invalidTitle"),
          description: t("invalidDescription"),
          variant: "error",
        });
      }
      return;
    }

    const { profile, summary } = parsed;
    const description = [
      t("summaryEntries", { count: summary.entriesCount }),
      t("summaryInsights", { count: summary.insightsCount }),
      t("summaryTags", { count: summary.tagsCount }),
      "",
      t("replaceWarning"),
    ].join("\n");

    const confirmed = await confirm({
      title: t("summaryTitle"),
      description,
      confirmLabel: t("importConfirm"),
      cancelLabel: tc("cancel"),
      variant: "danger",
    });

    if (!confirmed) return;

    setImporting(true);
    try {
      const result = await importProfile(profile);
      dispatchProfileImported();
      router.refresh();

      showToast({
        title: t("successTitle"),
        description: t("successSubtitle", { count: result.entriesCount }),
      });
    } catch {
      await alert({
        title: t("failedTitle"),
        description: t("failedDescription"),
        variant: "error",
      });
    } finally {
      setImporting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
      <h2 className="text-start text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t("title")}
      </h2>
      <p className="mt-1 text-start text-sm text-zinc-500 dark:text-zinc-400">
        {t("description")}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />
      <button
        type="button"
        onClick={openFilePicker}
        disabled={importing}
        className="mt-4 inline-flex rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-150 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80"
      >
        {importing ? tc("importing") : t("importButton")}
      </button>
    </section>
  );
}
