"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { useTranslations } from "next-intl";
import { EntryCard } from "@/components/EntryCard";
import { PageHeader } from "@/components/PageHeader";
import { getAllEntries, getAllTags } from "@/lib/entriesService";
import type { Entry, EntryType } from "@/types/entry";
import { ENTRY_TYPES } from "@/types/entry";

export default function TimelinePage() {
  const t = useTranslations("timeline");
  const te = useTranslations("entryTypes");
  const tc = useTranslations("common");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<EntryType | "all">("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [allEntries, allTags] = await Promise.all([
      getAllEntries(),
      getAllTags(),
    ]);
    setEntries(allEntries);
    setTags(allTags);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useOnProfileImported(() => {
    void load();
  });

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const typeMatch = typeFilter === "all" || entry.type === typeFilter;
      const tagMatch =
        tagFilter === "all" || entry.tags.includes(tagFilter);
      return typeMatch && tagMatch;
    });
  }, [entries, typeFilter, tagFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
        {tc("loadingTimeline")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="type-filter"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {t("filterType")}
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as EntryType | "all")
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="all">{t("allTypes")}</option>
            {ENTRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {te(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="tag-filter"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {t("filterTag")}
          </label>
          <select
            id="tag-filter"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="all">{t("allTags")}</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {t("showing", { filtered: filtered.length, total: entries.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">{t("noMatch")}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
