"use client";

import { useTranslations } from "next-intl";
import { useEntryTypes } from "@/hooks/useEntryTypes";
import {
  resolveTypeBadgeClasses,
  resolveTypeLabel,
} from "@/lib/entryTypesService";
import type { CoreEntryType } from "@/types/entry";

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className = "" }: TypeBadgeProps) {
  const te = useTranslations("entryTypes");
  const { customTypes } = useEntryTypes();
  const colors = resolveTypeBadgeClasses(type, customTypes);
  const label = resolveTypeLabel(type, customTypes, (core) =>
    te(core as CoreEntryType)
  );

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      {label}
    </span>
  );
}
