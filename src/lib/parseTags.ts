/** Arabic comma (U+060C) — not split in v1; detected for UX hint only. */
export const ARABIC_COMMA = "\u060C";

export function containsArabicComma(input: string): boolean {
  return input.includes(ARABIC_COMMA);
}

/**
 * Parse a tags input string into normalized tag values.
 * Separator handling is isolated here for future locale support.
 */
export function parseTags(input: string): string[] {
  // TODO: support Arabic comma (،) in future release
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
