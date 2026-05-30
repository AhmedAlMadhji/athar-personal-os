"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { IconRefresh } from "@/components/icons/AppIcons";
import { getRandomMotivationalMessage } from "@/lib/motivationalMessagesService";

function pickRandomIndex(length: number, exclude?: number): number {
  if (length <= 1) return 0;
  let index = Math.floor(Math.random() * length);
  while (exclude !== undefined && index === exclude && length > 1) {
    index = Math.floor(Math.random() * length);
  }
  return index;
}

export function WelcomeMessage({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("welcome");
  const defaultMessages = t.raw("messages") as string[];

  const [customText, setCustomText] = useState<string | null>(null);
  const [defaultIndex, setDefaultIndex] = useState(() =>
    pickRandomIndex(defaultMessages.length)
  );
  const [loading, setLoading] = useState(true);

  const loadMessage = useCallback(async () => {
    setLoading(true);
    const custom = await getRandomMotivationalMessage();
    setCustomText(custom);
    if (!custom) {
      setDefaultIndex((current) =>
        pickRandomIndex(defaultMessages.length, current)
      );
    }
    setLoading(false);
  }, [defaultMessages.length]);

  useEffect(() => {
    void loadMessage();
  }, [loadMessage]);

  useOnProfileImported(() => {
    void loadMessage();
  });

  const displayText = customText ?? defaultMessages[defaultIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-indigo-200/40 bg-indigo-50/50 dark:border-indigo-800/30 dark:bg-indigo-950/30 ${
        compact ? "p-3" : "rounded-2xl p-5 shadow-[0_2px_16px_rgba(99,102,241,0.08)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-start leading-snug text-zinc-700 dark:text-zinc-200 ${
            compact ? "line-clamp-2 text-sm" : "min-h-[3rem] text-base"
          }`}
        >
          {loading ? "…" : displayText}
        </p>
        <button
          type="button"
          onClick={() => void loadMessage()}
          disabled={loading}
          className="shrink-0 rounded-md border border-indigo-200/60 bg-white/80 p-1.5 text-xs text-indigo-600 transition hover:bg-white disabled:opacity-50 dark:border-indigo-800/50 dark:bg-zinc-900/80 dark:text-indigo-400"
          title={t("refresh")}
          aria-label={t("refresh")}
        >
          <IconRefresh className="h-3.5 w-3.5" />
        </button>
      </div>
      {customText && !compact && (
        <p className="mt-1.5 text-start text-xs text-indigo-600/80 dark:text-indigo-400/80">
          {t("customMessage")}
        </p>
      )}
    </div>
  );
}
