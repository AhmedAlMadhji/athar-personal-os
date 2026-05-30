"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { FaCheckCircle } from "react-icons/fa";

export interface ToastProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  durationMs?: number;
}

export function Toast({
  open,
  title,
  description,
  onClose,
  durationMs = 4500,
}: ToastProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, durationMs, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="font-sans pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex justify-center p-4 sm:justify-end sm:p-6"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        aria-labelledby={titleId}
        className="pointer-events-auto flex w-full max-w-sm gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900"
      >
        <FaCheckCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p
            id={titleId}
            className="text-start text-sm font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {title}
          </p>
          {description && (
            <p className="mt-1 text-start text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label="Dismiss"
        >
          <span aria-hidden className="text-sm leading-none">
            ×
          </span>
        </button>
      </div>
    </div>,
    document.body
  );
}
