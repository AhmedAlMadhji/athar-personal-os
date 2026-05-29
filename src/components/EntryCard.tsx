"use client";

import { useTranslations } from "next-intl";
import type { Entry } from "@/types/entry";
import { TypeBadge } from "@/components/TypeBadge";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";

interface EntryCardProps {
  entry: Entry;
  showDescription?: boolean;
}

export function EntryCard({
  entry,
  showDescription = true,
}: EntryCardProps) {
  const tc = useTranslations("common");

  return (
    <Link
      href={`/entries/${entry.id}`}
      className="group block rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition hover:border-indigo-200/60 hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)] dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:border-indigo-800/40"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <TypeBadge type={entry.type} />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatDate(entry.createdAt)}
        </span>
      </div>

      <h3 className="mb-1 text-start font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
        {entry.title || tc("untitled")}
      </h3>

      {showDescription && (
        <p className="mb-3 line-clamp-2 text-start text-sm text-zinc-600 dark:text-zinc-400">
          {entry.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {tc("rating")}: {tc("ratingOf", { rating: entry.rating })}
        </span>
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-zinc-50 px-2 py-0.5 text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-700"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
