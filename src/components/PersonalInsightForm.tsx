"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PersonalInsight, PersonalInsightInput } from "@/types/personalInsight";
import { INSIGHT_CATEGORIES } from "@/types/personalInsight";

interface PersonalInsightFormProps {
  initial?: PersonalInsight;
  onSubmit: (input: PersonalInsightInput) => Promise<void>;
  submitLabel: string;
}

export function PersonalInsightForm({
  initial,
  onSubmit,
  submitLabel,
}: PersonalInsightFormProps) {
  const t = useTranslations("insightsJournal.form");
  const tc = useTranslations("common");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [realization, setRealization] = useState(initial?.realization ?? "");
  const [cause, setCause] = useState(initial?.cause ?? "");
  const [solution, setSolution] = useState(initial?.solution ?? "");
  const [category, setCategory] = useState(initial?.category ?? INSIGHT_CATEGORIES[0]);
  const [confidenceLevel, setConfidenceLevel] = useState(
    initial?.confidenceLevel ?? 5
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !realization.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title,
        realization,
        cause,
        solution,
        category,
        confidenceLevel,
      });
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80 sm:p-6"
    >
      <div>
        <label htmlFor="insight-title" className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("title")} <span className="text-rose-500">{tc("required")}</span>
        </label>
        <input
          id="insight-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("titlePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="realization" className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("realization")} <span className="text-rose-500">{tc("required")}</span>
        </label>
        <textarea
          id="realization"
          rows={3}
          value={realization}
          onChange={(e) => setRealization(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("realizationPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="cause" className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("cause")}
        </label>
        <textarea
          id="cause"
          rows={2}
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("causePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="solution" className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("solution")}
        </label>
        <textarea
          id="solution"
          rows={2}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("solutionPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("category")}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        >
          {INSIGHT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t(`categories.${cat}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label htmlFor="confidence" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("confidence")}
          </label>
          <span className="text-sm font-semibold">{tc("ratingOf", { rating: confidenceLevel })}</span>
        </div>
        <input
          id="confidence"
          type="range"
          min={1}
          max={10}
          value={confidenceLevel}
          onChange={(e) => setConfidenceLevel(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-start text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-md disabled:opacity-60"
      >
        {saving ? tc("saving") : submitLabel}
      </button>
    </form>
  );
}
