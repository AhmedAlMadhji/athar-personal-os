interface InsightCardProps {
  title: string;
  description: string;
  takeaway?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function InsightCard({
  title,
  description,
  takeaway,
  children,
  className = "",
  bodyClassName = "",
}: InsightCardProps) {
  return (
    <article
      className={`flex min-h-0 flex-col rounded-lg border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/90 ${className}`}
    >
      <header className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800/80">
        <h3 className="text-start text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <p className="mt-0.5 text-start text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </header>

      <div
        className={`min-h-0 px-4 pb-5 pt-4 ${bodyClassName}`.trim()}
      >
        {children}
      </div>

      {takeaway && (
        <footer className="mt-auto border-t border-zinc-100 bg-zinc-50/80 px-4 py-3.5 dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <p className="text-start text-xs font-medium leading-relaxed text-indigo-700 dark:text-indigo-300">
            {takeaway}
          </p>
        </footer>
      )}
    </article>
  );
}

