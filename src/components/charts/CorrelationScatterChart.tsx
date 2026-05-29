"use client";

import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { getChartTooltipProps } from "@/components/charts/chartTooltipProps";
import { InsightCard } from "@/components/charts/InsightCard";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { ChartInsightMeta, CorrelationPoint } from "@/types/analytics";

interface CorrelationScatterChartProps {
  data: CorrelationPoint[];
  insight: ChartInsightMeta;
}

export function CorrelationScatterChart({
  data,
  insight,
}: CorrelationScatterChartProps) {
  const t = useTranslations("analytics");
  const tc = useTranslations("common");
  const chartTheme = useChartTheme();
  const tooltipProps = getChartTooltipProps(chartTheme);

  const title = t(insight.titleKey);
  const description = t(insight.descriptionKey);
  const takeaway = t(insight.takeawayKey);

  if (data.length < 2) {
    return (
      <InsightCard title={title} description={description}>
        <div className="flex h-52 items-center justify-center text-xs text-zinc-500">
          {t("correlationEmpty")}
        </div>
      </InsightCard>
    );
  }

  return (
    <InsightCard title={title} description={description} takeaway={takeaway}>
      <div className="chart-ltr h-52 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              className={chartTheme.gridClassName}
            />
            <XAxis
              type="number"
              dataKey="effort"
              name={t("effortAxis")}
              tick={chartTheme.axisTick}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="number"
              dataKey="outcome"
              name={t("outcomeAxis")}
              domain={[1, 10]}
              tick={chartTheme.axisTick}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip
              {...tooltipProps}
              cursor={{ strokeDasharray: "3 3", stroke: chartTheme.axisTick.fill }}
              formatter={(value, name) => {
                if (name === t("outcomeAxis")) {
                  return [tc("ratingOf", { rating: Number(value) }), name];
                }
                return [value, name];
              }}
            />
            <Scatter data={data} fill="#6366f1" animationDuration={400} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </InsightCard>
  );
}
