interface CompactStatProps {
  label: string;
  value: string | number;
  accent?: "indigo" | "emerald" | "rose" | "sky";
}

const accents = {
  indigo: "text-indigo-600 dark:text-indigo-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  rose: "text-rose-600 dark:text-rose-400",
  sky: "text-sky-600 dark:text-sky-400",
};

export function CompactStat({
  label,
  value,
  accent = "indigo",
}: CompactStatProps) {
  return (
    <div className="rounded-md border border-zinc-200/80 bg-white px-2.5 py-2 dark:border-zinc-800/80 dark:bg-zinc-900/90">
      <p className="text-start text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p
        className={`mt-0.5 text-start text-lg font-semibold tabular-nums tracking-tight ${accents[accent]}`}
      >
        {value}
      </p>
    </div>
  );
}
