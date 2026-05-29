"use client";

import { useId } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Dialog } from "@/components/ui/Dialog";

export type ConfirmVariant = "default" | "danger";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: ConfirmVariant;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "danger",
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  const confirmClasses =
    variant === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledById={titleId}
      describedById={description ? descriptionId : undefined}
      closeOnOverlay
    >
      <div className="flex gap-4">
        <FaExclamationTriangle
          className="mt-0.5 h-10 w-10 shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2
            id={titleId}
            className="text-start text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {title}
          </h2>
          {description && (
            <p
              id={descriptionId}
              className="mt-2 whitespace-pre-line text-start text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {description}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-50 dark:border-zinc-700/80 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700/80"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${confirmClasses}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
