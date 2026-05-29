"use client";

import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPlaceholder, ChartWrapper } from "@/components/charts/ChartWrapper";
import { getChartTooltipProps } from "@/components/charts/chartTooltipProps";
import { InsightCard } from "@/components/charts/InsightCard";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { ChartInsightMeta, GrowthDataPoint } from "@/types/analytics";

interface GrowthLineChartProps {
  data: GrowthDataPoint[];
  insight: ChartInsightMeta;
}

export function GrowthLineChart({ data, insight }: GrowthLineChartProps) {
  const t = useTranslations("analytics");
  const tc = useTranslations("common");
  const chartTheme = useChartTheme();
  const tooltipProps = getChartTooltipProps(chartTheme);

  const title = t(insight.titleKey, insight.takeawayValues ?? {});
  const description = t(insight.descriptionKey);
  const takeaway = t(insight.takeawayKey, insight.takeawayValues ?? {});

  if (data.length === 0) {
    return (
      <InsightCard title={title} description={description}>
        <ChartPlaceholder>
          <span className="text-xs text-zinc-500">{t("growthEmpty")}</span>
        </ChartPlaceholder>
      </InsightCard>
    );
  }

  return (
    <InsightCard title={title} description={description} takeaway={takeaway}>
      <ChartWrapper>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              className={chartTheme.gridClassName}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={chartTheme.axisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[1, 10]}
              tick={chartTheme.axisTick}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              {...tooltipProps}
              formatter={(value) => [
                tc("ratingOf", { rating: Number(value) }),
                t("avgRating"),
              ]}
              labelFormatter={(label) => t("weekOf", { label })}
            />
            <Line
              type="monotone"
              dataKey="averageRating"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: "#6366f1", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "#8b5cf6" }}
              animationDuration={400}
            />
          </LineChart>
      </ChartWrapper>
    </InsightCard>
  );
}
