"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getChartTooltipProps } from "@/components/charts/chartTooltipProps";
import { InsightCard } from "@/components/charts/InsightCard";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { ChartInsightMeta, TagDistributionPoint } from "@/types/analytics";

interface TagsBreakdownPieChartProps {
  data: TagDistributionPoint[];
  insight: ChartInsightMeta;
}

export function TagsBreakdownPieChart({
  data,
  insight,
}: TagsBreakdownPieChartProps) {
  const t = useTranslations("analytics");
  const chartTheme = useChartTheme();
  const tooltipProps = getChartTooltipProps(chartTheme);

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        name: `#${item.tag}`,
        value: item.count,
        fill: item.fill,
      })),
    [data]
  );

  const title = t(insight.titleKey, insight.takeawayValues ?? {});
  const description = t(insight.descriptionKey);
  const takeaway = t(insight.takeawayKey, insight.takeawayValues ?? {});

  return (
    <InsightCard title={title} description={description} takeaway={takeaway}>
      <div className="chart-ltr h-52 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              animationDuration={400}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip {...tooltipProps} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 px-1">
        {chartData.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            {item.name} ({item.value})
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}
