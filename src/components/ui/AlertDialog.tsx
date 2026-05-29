"use client";

import { useId } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { Dialog } from "@/components/ui/Dialog";

export type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  variant?: AlertVariant;
}

const variantStyles: Record<
  AlertVariant,
  { icon: typeof FaInfoCircle; className: string }
> = {
  info: { icon: FaInfoCircle, className: "text-indigo-600 dark:text-indigo-400" },
  success: {
    icon: FaCheckCircle,
    className: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    icon: FaExclamationCircle,
    className: "text-amber-600 dark:text-amber-400",
  },
  error: {
    icon: FaExclamationCircle,
    className: "text-rose-600 dark:text-rose-400",
  },
};

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  variant = "info",
}: AlertDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { icon: Icon, className } = variantStyles[variant];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledById={titleId}
      describedById={description ? descriptionId : undefined}
    >
      <div className="flex gap-4">
        <Icon className={`mt-0.5 h-10 w-10 shrink-0 ${className}`} aria-hidden />
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
              className="mt-2 text-start text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {description}
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700 sm:w-auto"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
