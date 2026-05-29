"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
} from "recharts";
import { ChartCard } from "@/components/charts/ChartCard";
import { ChartPlaceholder, ChartWrapper } from "@/components/charts/ChartWrapper";
import { getChartTooltipProps } from "@/components/charts/chartTooltipProps";
import { useChartTheme } from "@/hooks/useChartTheme";
import type { DistributionDataPoint } from "@/types/analytics";
import type { EntryType } from "@/types/entry";

interface DistributionPieChartProps {
  data: DistributionDataPoint[];
}

export function DistributionPieChart({ data }: DistributionPieChartProps) {
  const t = useTranslations("analytics");
  const te = useTranslations("entryTypes");
  const chartTheme = useChartTheme();
  const tooltipProps = getChartTooltipProps(chartTheme);

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        name: te(item.name as EntryType),
      })),
    [data, te]
  );

  if (data.length === 0) {
    return (
      <ChartCard title={t("distribution")} description={t("distributionDesc")}>
        <ChartPlaceholder height="lg">
          <span className="text-sm text-zinc-500">{t("distributionEmpty")}</span>
        </ChartPlaceholder>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={t("distribution")} description={t("distributionDesc")}>
      <ChartWrapper height="lg">
        <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry) => (
                <Cell key={entry.type} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip {...tooltipProps} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {value}
                </span>
              )}
            />
          </PieChart>
      </ChartWrapper>
    </ChartCard>
  );
}
