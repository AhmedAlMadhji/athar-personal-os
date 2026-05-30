import { getSettings, updateSettings } from "@/lib/settingsService";
import {
  CUSTOM_ENTRY_TYPE_PREFIX,
  CUSTOM_TYPE_COLOR_KEYS,
  MAX_CUSTOM_ENTRY_TYPES,
  type CustomEntryType,
  type CustomTypeColorKey,
} from "@/types/customEntryType";
import {
  CORE_ENTRY_TYPES,
  CORE_ENTRY_TYPE_COLORS,
  type CoreEntryType,
} from "@/types/entry";

const CUSTOM_CHART_FILLS: Record<CustomTypeColorKey, string> = {
  violet: "#8b5cf6",
  teal: "#14b8a6",
  orange: "#f97316",
  pink: "#ec4899",
  slate: "#64748b",
};

const CUSTOM_BADGE_CLASSES: Record<
  CustomTypeColorKey,
  { bg: string; text: string; border: string }
> = {
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-500/30",
  },
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-500/30",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-500/30",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-700 dark:text-pink-400",
    border: "border-pink-500/30",
  },
  slate: {
    bg: "bg-slate-500/10",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/30",
  },
};

export function isCoreEntryType(type: string): type is CoreEntryType {
  return (CORE_ENTRY_TYPES as readonly string[]).includes(type);
}

export function isCustomEntryType(type: string): boolean {
  return type.startsWith(CUSTOM_ENTRY_TYPE_PREFIX);
}

export function createCustomTypeId(): string {
  return `${CUSTOM_ENTRY_TYPE_PREFIX}${crypto.randomUUID()}`;
}

export async function getCustomEntryTypes(): Promise<CustomEntryType[]> {
  const settings = await getSettings();
  return settings.customEntryTypes ?? [];
}

export async function getAllEntryTypeIds(): Promise<string[]> {
  const custom = await getCustomEntryTypes();
  return [...CORE_ENTRY_TYPES, ...custom.map((item) => item.id)];
}

export function resolveCustomType(
  type: string,
  customTypes: CustomEntryType[]
): CustomEntryType | undefined {
  return customTypes.find((item) => item.id === type);
}

export function resolveTypeLabel(
  type: string,
  customTypes: CustomEntryType[],
  translateCore: (core: CoreEntryType) => string
): string {
  if (isCoreEntryType(type)) return translateCore(type);
  return resolveCustomType(type, customTypes)?.label ?? type;
}

export function resolveTypeBadgeClasses(
  type: string,
  customTypes: CustomEntryType[]
): { bg: string; text: string; border: string } {
  if (isCoreEntryType(type)) return CORE_ENTRY_TYPE_COLORS[type];
  const custom = resolveCustomType(type, customTypes);
  const key = custom?.colorKey ?? "violet";
  return CUSTOM_BADGE_CLASSES[key];
}

export function resolveTypeChartFill(
  type: string,
  customTypes: CustomEntryType[]
): string {
  if (isCoreEntryType(type)) {
    const fills: Record<CoreEntryType, string> = {
      strength: "#10b981",
      weakness: "#f43f5e",
      skill: "#0ea5e9",
      note: "#f59e0b",
    };
    return fills[type];
  }
  const custom = resolveCustomType(type, customTypes);
  return CUSTOM_CHART_FILLS[custom?.colorKey ?? "violet"];
}

export async function addCustomEntryType(
  label: string,
  colorKey: CustomTypeColorKey = "violet"
): Promise<CustomEntryType | { error: "limit" | "invalid" }> {
  const trimmed = label.trim();
  if (!trimmed || trimmed.length > 32) return { error: "invalid" };

  const settings = await getSettings();
  const existing = settings.customEntryTypes ?? [];
  if (existing.length >= MAX_CUSTOM_ENTRY_TYPES) return { error: "limit" };

  const next: CustomEntryType = {
    id: createCustomTypeId(),
    label: trimmed,
    colorKey: CUSTOM_TYPE_COLOR_KEYS.includes(colorKey) ? colorKey : "violet",
    createdAt: new Date().toISOString(),
  };

  await updateSettings({ customEntryTypes: [...existing, next] });
  return next;
}

export async function removeCustomEntryType(id: string): Promise<void> {
  const settings = await getSettings();
  const existing = settings.customEntryTypes ?? [];
  await updateSettings({
    customEntryTypes: existing.filter((item) => item.id !== id),
  });
}

export { CUSTOM_TYPE_COLOR_KEYS, MAX_CUSTOM_ENTRY_TYPES };
