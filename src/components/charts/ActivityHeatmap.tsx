"use client";

import { useTranslations } from "next-intl";
import { InsightCard } from "@/components/charts/InsightCard";
import type { ChartInsightMeta, HeatmapDay } from "@/types/analytics";

interface ActivityHeatmapProps {
  data: HeatmapDay[];
  weeks: number;
  insight: ChartInsightMeta;
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-zinc-100 dark:bg-zinc-800";
  if (count === 1) return "bg-indigo-200 dark:bg-indigo-900";
  if (count === 2) return "bg-indigo-400 dark:bg-indigo-700";
  if (count === 3) return "bg-indigo-500 dark:bg-indigo-600";
  return "bg-indigo-600 dark:bg-indigo-500";
}

export function ActivityHeatmap({ data, weeks, insight }: ActivityHeatmapProps) {
  const t = useTranslations("analytics");

  const maxWeekIndex = Math.max(...data.map((day) => day.weekIndex), 0);
  const weekColumns = Array.from({ length: maxWeekIndex + 1 }, (_, i) => i);

  const grid = new Map<string, number>();
  for (const day of data) {
    grid.set(`${day.weekIndex}-${day.dayOfWeek}`, day.count);
  }

  const totalActivity = data.reduce((sum, day) => sum + day.count, 0);
  const title = t(insight.titleKey, insight.takeawayValues ?? {});
  const description = t(insight.descriptionKey, { weeks });
  const takeaway = t(insight.takeawayKey, insight.takeawayValues ?? {});

  return (
    <InsightCard title={title} description={description} takeaway={takeaway}>
      {totalActivity === 0 ? (
        <div className="flex h-32 items-center justify-center text-xs text-zinc-500">
          {t("heatmapEmpty")}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="chart-ltr inline-flex min-w-full flex-col gap-1" dir="ltr">
              {DAY_KEYS.map((dayKey, dayIndex) => (
                <div key={dayKey} className="flex items-center gap-1">
                  <span className="w-7 shrink-0 text-[10px] text-zinc-500 dark:text-zinc-400">
                    {t(`days.${dayKey}`)}
                  </span>
                  <div className="flex gap-1">
                    {weekColumns.map((week) => {
                      const count = grid.get(`${week}-${dayIndex}`) ?? 0;
                      const dateEntry = data.find(
                        (day) =>
                          day.weekIndex === week && day.dayOfWeek === dayIndex
                      );
                      return (
                        <div
                          key={`${week}-${dayIndex}`}
                          title={
                            dateEntry
                              ? `${dateEntry.date}: ${t("heatmapEntries", { count })}`
                              : t("heatmapEntries", { count })
                          }
                          className={`h-2.5 w-2.5 shrink-0 rounded-sm transition-colors duration-150 ${getIntensityClass(count)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-zinc-500">
            <span>{t("heatmapLess")}</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-2.5 w-2.5 rounded-sm ${getIntensityClass(level)}`}
              />
            ))}
            <span>{t("heatmapMore")}</span>
          </div>
        </>
      )}
    </InsightCard>
  );
}
