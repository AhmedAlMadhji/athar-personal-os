"use client";

import { useTranslations } from "next-intl";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Link } from "@/i18n/navigation";
import type { DashboardStats } from "@/types/entry";
import type { Entry } from "@/types/entry";

interface ActivityDay {
  date: string;
  count: number;
  label: string;
}

interface DashboardWidgetsProps {
  stats: DashboardStats;
  activity: ActivityDay[];
  strengths: Entry[];
}

export function DashboardWidgets({
  stats,
  activity,
  strengths,
}: DashboardWidgetsProps) {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");

  const growthRatio =
    stats.strengths + stats.weaknesses > 0
      ? Math.round(
          (stats.strengths / (stats.strengths + stats.weaknesses)) * 100
        )
      : 0;

  const maxActivity = Math.max(...activity.map((d) => d.count), 1);

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardWidget title={t("quickStats")}>
        <dl className="space-y-1.5 text-start">
          <div className="flex justify-between gap-2 text-sm">
            <dt className="text-zinc-500">{t("averageRating")}</dt>
            <dd className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.averageRating > 0
                ? tc("ratingOf", { rating: stats.averageRating })
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2 text-sm">
            <dt className="text-zinc-500">{t("strengthRatio")}</dt>
            <dd className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.strengths + stats.weaknesses > 0
                ? `${growthRatio}%`
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2 text-sm">
            <dt className="text-zinc-500">{t("notesCaptured")}</dt>
            <dd className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
              {stats.notes}
            </dd>
          </div>
        </dl>
      </DashboardWidget>

      <DashboardWidget
        title={t("recentActivity")}
        action={
          <Link
            href="/analytics"
            className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            →
          </Link>
        }
      >
        <div className="flex items-end justify-between gap-1.5 h-12">
          {activity.map((day) => (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1"
              title={`${day.label}: ${day.count}`}
            >
              <div
                className="w-full max-w-[28px] rounded-sm bg-indigo-500/80 dark:bg-indigo-500"
                style={{
                  height: `${Math.max(4, (day.count / maxActivity) * 32)}px`,
                }}
              />
              <span className="text-[10px] text-zinc-400">{day.label}</span>
            </div>
          ))}
        </div>
      </DashboardWidget>

      <DashboardWidget title={t("topTags")}>
        {stats.topTags.length === 0 ? (
          <p className="text-start text-xs text-zinc-500">{t("noTagsYet")}</p>
        ) : (
          <ul className="space-y-1">
            {stats.topTags.slice(0, 4).map(({ tag, count }) => (
              <li
                key={tag}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="truncate text-zinc-700 dark:text-zinc-300">
                  #{tag}
                </span>
                <span className="shrink-0 tabular-nums text-xs text-zinc-400">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </DashboardWidget>

      <DashboardWidget
        title={t("topStrengths")}
        action={
          <Link
            href="/timeline"
            className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            →
          </Link>
        }
      >
        {strengths.length === 0 ? (
          <p className="text-start text-xs text-zinc-500">{t("noStrengthsYet")}</p>
        ) : (
          <ul className="space-y-1">
            {strengths.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/entries/${entry.id}`}
                  className="block truncate text-start text-sm text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
                >
                  {entry.title || tc("untitled")}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DashboardWidget>
    </div>
  );
}
