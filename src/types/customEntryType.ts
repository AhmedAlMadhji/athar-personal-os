export const MAX_CUSTOM_ENTRY_TYPES = 5;

export const CUSTOM_ENTRY_TYPE_PREFIX = "custom:" as const;

export type CustomTypeColorKey =
  | "violet"
  | "teal"
  | "orange"
  | "pink"
  | "slate";

export interface CustomEntryType {
  id: string;
  label: string;
  colorKey: CustomTypeColorKey;
  createdAt: string;
}

export const CUSTOM_TYPE_COLOR_KEYS: CustomTypeColorKey[] = [
  "violet",
  "teal",
  "orange",
  "pink",
  "slate",
];
