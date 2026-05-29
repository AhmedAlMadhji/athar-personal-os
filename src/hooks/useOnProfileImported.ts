"use client";

import { useEffect } from "react";
import { PROFILE_IMPORTED_EVENT } from "@/lib/profileEvents";

export function useOnProfileImported(onImported: () => void) {
  useEffect(() => {
    window.addEventListener(PROFILE_IMPORTED_EVENT, onImported);
    return () => window.removeEventListener(PROFILE_IMPORTED_EVENT, onImported);
  }, [onImported]);
}
