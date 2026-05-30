"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { InsightCard } from "@/components/charts/InsightCard";
import type { ChartInsightMeta, HeatmapDay } from "@/types/analytics";

interface ActivityHeatmapProps {
  data: HeatmapDay[];
  weeks: number;
  insight: ChartInsightMeta;
}

/** Fixed Sun(0) → Sat(6) — must match Date.getDay() and computeActivityHeatmap */
const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6] as const;
const DAY_LABEL_KEYS = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;

const CELL_CLASS =
  "box-border h-[11px] w-[11px] shrink-0 rounded-[2px] transition-colors duration-150";

function getIntensityClass(count: number): string {
  if (count <= 0) return "bg-[#ebedf0] dark:bg-[#161b22]";
  if (count === 1) return "bg-[#9be9a8] dark:bg-[#0e4429]";
  if (count === 2) return "bg-[#40c463] dark:bg-[#006d32]";
  if (count === 3) return "bg-[#30a14e] dark:bg-[#26a641]";
  return "bg-[#216e39] dark:bg-[#39d353]";
}

function buildWeekMonthLabels(
  data: HeatmapDay[],
  weekCount: number,
  locale: string
): (string | null)[] {
  const labels: (string | null)[] = [];
  let lastMonth = -1;

  for (let week = 0; week < weekCount; week++) {
    const anchor =
      data.find((d) => d.weekIndex === week && d.dayOfWeek === 0) ??
      data.find((d) => d.weekIndex === week);

    if (!anchor) {
      labels.push(null);
      continue;
    }

    const date = new Date(`${anchor.date}T12:00:00`);
    const month = date.getMonth();

    if (month !== lastMonth) {
      labels.push(
        date.toLocaleDateString(locale, { month: "short" }).replace(/\.$/, "")
      );
      lastMonth = month;
    } else {
      labels.push(null);
    }
  }

  return labels;
}

export function ActivityHeatmap({ data, weeks, insight }: ActivityHeatmapProps) {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const weekCount = Math.max(
    weeks,
    ...data.map((d) => d.weekIndex + 1),
    1
  );
  const weekColumns = Array.from({ length: weekCount }, (_, i) => i);

  const grid = useMemo(() => {
    const map = new Map<string, number>();
    for (const day of data) {
      if (day.dayOfWeek < 0 || day.dayOfWeek > 6) continue;
      map.set(`${day.weekIndex}-${day.dayOfWeek}`, day.count);
    }
    return map;
  }, [data]);

  const monthLabels = useMemo(
    () => buildWeekMonthLabels(data, weekCount, locale),
    [data, weekCount, locale]
  );

  const totalActivity = data.reduce((sum, day) => sum + day.count, 0);
  const title = t(insight.titleKey, insight.takeawayValues ?? {});
  const description = t(insight.descriptionKey, { weeks });
  const takeaway = t(insight.takeawayKey, insight.takeawayValues ?? {});

  return (
    <InsightCard
      title={title}
      description={description}
      takeaway={takeaway}
      bodyClassName="px-3 pt-3 pb-4 sm:px-4"
    >
      {totalActivity === 0 ? (
        <p className="py-10 text-center text-xs text-zinc-500">
          {t("heatmapEmpty")}
        </p>
      ) : (
        <div className="chart-ltr w-full min-w-0" dir="ltr">
          <div className="w-full overflow-x-auto">
            <div
              className="heatmap-frame"
              style={{ ["--heatmap-weeks" as string]: String(weekCount) }}
            >
              <div className="heatmap-months" aria-hidden>
                {weekColumns.map((week) => (
                  <div key={`m-${week}`} className="heatmap-month-cell">
                    {monthLabels[week] ? (
                      <span className="heatmap-month-label">
                        {monthLabels[week]}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              {DAY_INDICES.map((dayIndex, row) => (
                <span
                  key={`label-${dayIndex}`}
                  className="heatmap-day-label"
                  style={{ gridRow: row + 2 }}
                >
                  {t(`days.${DAY_LABEL_KEYS[dayIndex]}`)}
                </span>
              ))}

              <div
                className="contribution-heatmap-grid heatmap-cells"
                role="img"
                aria-label={description}
              >
                {weekColumns.map((week) =>
                  DAY_INDICES.map((dayIndex) => {
                    const count = grid.get(`${week}-${dayIndex}`) ?? 0;
                    const dateEntry = data.find(
                      (d) =>
                        d.weekIndex === week && d.dayOfWeek === dayIndex
                    );
                    return (
                      <div
                        key={`${week}-${dayIndex}`}
                        title={
                          dateEntry
                            ? `${dateEntry.date}: ${t("heatmapEntries", { count })}`
                            : t("heatmapEntries", { count })
                        }
                        className={`${CELL_CLASS} ${getIntensityClass(count)}`}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="heatmap-legend mt-3">
            <span>{t("heatmapLess")}</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`${CELL_CLASS} ${getIntensityClass(level)}`}
              />
            ))}
            <span>{t("heatmapMore")}</span>
          </div>
        </div>
      )}
    </InsightCard>
  );
}
