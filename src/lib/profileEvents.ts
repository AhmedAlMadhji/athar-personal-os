export const PROFILE_IMPORTED_EVENT = "profile-imported";

export function dispatchProfileImported(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROFILE_IMPORTED_EVENT));
}
