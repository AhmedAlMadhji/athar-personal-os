"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { AlertDialog, type AlertVariant } from "@/components/ui/AlertDialog";
import { ConfirmDialog, type ConfirmVariant } from "@/components/ui/ConfirmDialog";

export interface AlertOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: AlertVariant;
}

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface DialogContextValue {
  alert: (options: AlertOptions) => Promise<void>;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

type ActiveDialog =
  | { type: "alert"; options: AlertOptions; resolve: () => void }
  | {
      type: "confirm";
      options: ConfirmOptions;
      resolve: (value: boolean) => void;
    }
  | null;

export function DialogProvider({ children }: { children: ReactNode }) {
  const td = useTranslations("dialog");
  const [active, setActive] = useState<ActiveDialog>(null);

  const alert = useCallback((options: AlertOptions) => {
    return new Promise<void>((resolve) => {
      setActive({ type: "alert", options, resolve });
    });
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setActive({ type: "confirm", options, resolve });
    });
  }, []);

  const closeAlert = useCallback(() => {
    if (active?.type === "alert") {
      active.resolve();
      setActive(null);
    }
  }, [active]);

  const closeConfirm = useCallback(
    (confirmed: boolean) => {
      if (active?.type === "confirm") {
        active.resolve(confirmed);
        setActive(null);
      }
    },
    [active]
  );

  const value = useMemo(() => ({ alert, confirm }), [alert, confirm]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {active?.type === "alert" && (
        <AlertDialog
          open
          onClose={closeAlert}
          title={active.options.title}
          description={active.options.description}
          confirmLabel={active.options.confirmLabel ?? td("ok")}
          variant={active.options.variant}
        />
      )}
      {active?.type === "confirm" && (
        <ConfirmDialog
          open
          onClose={() => closeConfirm(false)}
          onConfirm={() => closeConfirm(true)}
          title={active.options.title}
          description={active.options.description}
          confirmLabel={active.options.confirmLabel ?? td("confirm")}
          cancelLabel={active.options.cancelLabel ?? td("cancel")}
          variant={active.options.variant ?? "danger"}
        />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return ctx;
}

export function useConfirm() {
  return useDialog().confirm;
}

export function useAlert() {
  return useDialog().alert;
}
