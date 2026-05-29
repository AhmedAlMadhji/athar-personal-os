"use client";

import { useEffect, useState } from "react";

interface AnimatedStatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  accent?: "indigo" | "emerald" | "rose" | "sky" | "amber";
  delay?: number;
}

const accentStyles = {
  indigo: {
    ring: "ring-indigo-500/20",
    gradient: "from-indigo-500/10 to-violet-500/5",
    value: "text-indigo-600 dark:text-indigo-400",
  },
  emerald: {
    ring: "ring-emerald-500/20",
    gradient: "from-emerald-500/10 to-teal-500/5",
    value: "text-emerald-600 dark:text-emerald-400",
  },
  rose: {
    ring: "ring-rose-500/20",
    gradient: "from-rose-500/10 to-pink-500/5",
    value: "text-rose-600 dark:text-rose-400",
  },
  sky: {
    ring: "ring-sky-500/20",
    gradient: "from-sky-500/10 to-cyan-500/5",
    value: "text-sky-600 dark:text-sky-400",
  },
  amber: {
    ring: "ring-amber-500/20",
    gradient: "from-amber-500/10 to-orange-500/5",
    value: "text-amber-600 dark:text-amber-400",
  },
};

export function AnimatedStatCard({
  label,
  value,
  hint,
  accent = "indigo",
  delay = 0,
}: AnimatedStatCardProps) {
  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | number>(value);
  const styles = accentStyles[accent];

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    if (!visible) return;

    const target = value;
    const duration = 600;
    const start = performance.now();
    let frame: number;

    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, visible]);

  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-gradient-to-br ${styles.gradient} p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(99,102,241,0.06)] ring-1 ${styles.ring} transition-all duration-500 dark:border-zinc-800/80 dark:bg-zinc-900/50 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${styles.value}`}>
        {displayValue}
      </p>
      {hint && (
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-500">{hint}</p>
      )}
    </div>
  );
}
