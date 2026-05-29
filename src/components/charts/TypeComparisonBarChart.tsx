"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPlaceholder, ChartWrapper } from "@/components/charts/ChartWrapper";
import { getChartTooltipProps } from "@/components/charts/chartTooltipProps";
import { InsightCard } from "@/components/charts/InsightCard";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { BarComparisonPoint, ChartInsightMeta } from "@/types/analytics";
import type { EntryType } from "@/types/entry";

interface TypeComparisonBarChartProps {
  data: BarComparisonPoint[];
  insight: ChartInsightMeta;
}

export function TypeComparisonBarChart({
  data,
  insight,
}: TypeComparisonBarChartProps) {
  const t = useTranslations("analytics");
  const te = useTranslations("entryTypes");
  const chartTheme = useChartTheme();
  const tooltipProps = getChartTooltipProps(chartTheme);

  const dominantType = (insight.takeawayValues?.type as EntryType) ?? "strength";
  const title = t(insight.titleKey, {
    type: te(dominantType),
    ...(insight.takeawayValues ?? {}),
  });
  const description = t(insight.descriptionKey);
  const takeaway = t(insight.takeawayKey, {
    type: te(dominantType),
    ...(insight.takeawayValues ?? {}),
  });

  const chartData = data.map((item) => ({
    ...item,
    label: te(item.type),
  }));

  if (data.length === 0) {
    return (
      <InsightCard title={title} description={description}>
        <ChartPlaceholder>
          <span className="text-xs text-zinc-500">{t("typeComparisonEmpty")}</span>
        </ChartPlaceholder>
      </InsightCard>
    );
  }

  return (
    <InsightCard title={title} description={description} takeaway={takeaway}>
      <ChartWrapper>
        <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className={chartTheme.gridClassName}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={chartTheme.axisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={chartTheme.axisTick}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip
              {...tooltipProps}
              cursor={{ fill: chartTheme.cursorFill }}
              formatter={(value) => [value, t("entryCount")]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {chartData.map((entry) => (
                <Cell key={entry.type} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
      </ChartWrapper>
    </InsightCard>
  );
}
