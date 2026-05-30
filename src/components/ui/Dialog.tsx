"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/scrollLock";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledById: string;
  describedById?: string;
  closeOnOverlay?: boolean;
}

export function Dialog({
  open,
  onClose,
  children,
  labelledById,
  describedById,
  closeOnOverlay = true,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    lockBodyScroll();
    document.addEventListener("keydown", handleKeyDown);

    const timer = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR
      );
      focusable?.[0]?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      unlockBodyScroll();
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="font-sans fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="dialog-backdrop-in absolute inset-0 bg-zinc-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={closeOnOverlay ? onClose : undefined}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        aria-describedby={describedById}
        className="dialog-panel-in relative w-full max-w-md rounded-xl border border-zinc-200/80 bg-white p-6 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
