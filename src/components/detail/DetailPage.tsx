"use client";

import { Link } from "@/i18n/navigation";

export function DetailPageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl space-y-6">{children}</div>;
}

export function DetailBackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex text-sm font-medium text-zinc-600 transition-colors duration-150 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      {children}
    </Link>
  );
}

export function DetailLoading({ message }: { message: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
      {message}
    </div>
  );
}

export function DetailNotFound({
  title,
  hint,
  backHref,
  backLabel,
}: {
  title: string;
  hint?: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-4 text-center">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h1>
      {hint && (
        <p className="text-zinc-600 dark:text-zinc-400">{hint}</p>
      )}
      <Link
        href={backHref}
        className="inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
      >
        {backLabel}
      </Link>
    </div>
  );
}

export function DetailEditHeader({
  title,
  cancelLabel,
  onCancel,
}: {
  title: string;
  cancelLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h1>
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-medium text-zinc-600 transition-colors duration-150 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        {cancelLabel}
      </button>
    </div>
  );
}

export function DetailArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
      {children}
    </article>
  );
}

export function DetailMetaRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>
  );
}

export function DetailTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-start text-2xl font-bold text-zinc-900 dark:text-zinc-50">
      {children}
    </h1>
  );
}

export function DetailBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 whitespace-pre-wrap text-start text-zinc-700 dark:text-zinc-300">
      {children}
    </p>
  );
}

export function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-start">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
        {children}
      </dd>
    </div>
  );
}

export function DetailFields({ children }: { children: React.ReactNode }) {
  return <dl className="mt-6 space-y-4 text-start">{children}</dl>;
}

export function DetailTimestamps({
  createdLabel,
  createdAt,
  updatedLabel,
  updatedAt,
}: {
  createdLabel: string;
  createdAt: string;
  updatedLabel: string;
  updatedAt: string;
}) {
  return (
    <dl className="mt-6 grid gap-2 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
      <div className="flex justify-between gap-4">
        <dt className="text-zinc-500 dark:text-zinc-400">{createdLabel}</dt>
        <dd className="text-zinc-700 dark:text-zinc-300">{createdAt}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-zinc-500 dark:text-zinc-400">{updatedLabel}</dt>
        <dd className="text-zinc-700 dark:text-zinc-300">{updatedAt}</dd>
      </div>
    </dl>
  );
}

export function DetailActions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}

export function DetailPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function DetailDangerButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/50"
    >
      {children}
    </button>
  );
}

export function DetailMetaBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent";
}) {
  const classes =
    variant === "accent"
      ? "rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
      : "rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

  return <span className={classes}>{children}</span>;
}
