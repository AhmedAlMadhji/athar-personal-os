interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function DashboardWidget({
  title,
  children,
  action,
  className = "",
}: DashboardWidgetProps) {
  return (
    <div
      className={`rounded-md border border-zinc-200/80 bg-white p-2.5 dark:border-zinc-800/80 dark:bg-zinc-900/90 ${className}`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h3 className="text-start text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
