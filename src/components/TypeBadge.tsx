"use client";

import { useTranslations } from "next-intl";
import type { EntryType } from "@/types/entry";
import { ENTRY_TYPE_COLORS } from "@/types/entry";

interface TypeBadgeProps {
  type: EntryType;
  className?: string;
}

export function TypeBadge({ type, className = "" }: TypeBadgeProps) {
  const t = useTranslations("entryTypes");
  const colors = ENTRY_TYPE_COLORS[type];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {t(type)}
    </span>
  );
}
