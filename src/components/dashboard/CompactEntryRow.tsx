"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Entry } from "@/types/entry";
import { TypeBadge } from "@/components/TypeBadge";
import { Link } from "@/i18n/navigation";
import { formatRelativeDate } from "@/lib/utils";

interface CompactEntryRowProps {
  entry: Entry;
}

export function CompactEntryRow({ entry }: CompactEntryRowProps) {
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <Link
      href={`/entries/${entry.id}`}
      className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-start text-sm font-medium text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
          {entry.title || tc("untitled")}
        </p>
      </div>
      <TypeBadge type={entry.type} className="shrink-0 scale-90" />
      <span className="shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
        {formatRelativeDate(entry.createdAt, locale)}
      </span>
    </Link>
  );
}
