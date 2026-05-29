"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Entry, EntryInput, EntryType } from "@/types/entry";
import { ENTRY_TYPES } from "@/types/entry";
import { formatTagsForInput, parseTagsInput } from "@/lib/entriesService";

interface EntryFormProps {
  initial?: Entry;
  onSubmit: (input: EntryInput) => Promise<void>;
  submitLabel: string;
}

export function EntryForm({ initial, onSubmit, submitLabel }: EntryFormProps) {
  const t = useTranslations("form");
  const te = useTranslations("entryTypes");
  const tc = useTranslations("common");

  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<EntryType>(initial?.type ?? "strength");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tagsInput, setTagsInput] = useState(
    initial ? formatTagsForInput(initial.tags) : "",
  );
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError(t("descriptionRequired"));
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim() || undefined,
        type,
        description,
        tags: parseTagsInput(tagsInput),
        rating,
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
      className="space-y-5 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-zinc-800/80 dark:bg-zinc-900/80 sm:p-6"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {t("title")} <span className="text-zinc-400">{tc("optional")}</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("titlePlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {t("type")}
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as EntryType)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        >
          {ENTRY_TYPES.map((entryType) => (
            <option key={entryType} value={entryType}>
              {te(entryType)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {t("description")}{" "}
          <span className="text-rose-500">{tc("required")}</span>
        </label>
        <textarea
          id="description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("descriptionPlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="mb-1 block text-start text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {t("tags")} <span className="text-zinc-400">{t("tagsHint")}</span>
        </label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder={t("tagsPlaceholder")}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="rating"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {tc("rating")}
          </label>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {tc("ratingOf", { rating })}
          </span>
        </div>
        <input
          id="rating"
          type="range"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
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
        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60"
      >
        {saving ? tc("saving") : submitLabel}
      </button>
    </form>
  );
}
