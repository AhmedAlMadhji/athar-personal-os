"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Prevents duplicate async form submissions (double-click / Enter spam).
 * Stays locked after success until the component unmounts (e.g. navigation).
 */
export function useFormSubmitGuard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lockRef = useRef(false);

  const run = useCallback(async (fn: () => Promise<void>): Promise<boolean> => {
    if (lockRef.current) return false;

    lockRef.current = true;
    setIsSubmitting(true);

    try {
      await fn();
      return true;
    } catch {
      lockRef.current = false;
      setIsSubmitting(false);
      return false;
    }
  }, []);

  return { isSubmitting, run };
}
