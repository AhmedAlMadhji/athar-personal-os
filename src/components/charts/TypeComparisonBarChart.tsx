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
import { useEntryTypes } from "@/hooks/useEntryTypes";
import { useChartTheme } from "@/hooks/useChartTheme";
import { isCoreEntryType, resolveTypeLabel } from "@/lib/entryTypesService";
import type { BarComparisonPoint, ChartInsightMeta } from "@/types/analytics";
import type { CoreEntryType } from "@/types/entry";

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
  const { customTypes } = useEntryTypes();
  const chartTheme = useChartTheme();
  const tooltipProps = getChartTooltipProps(chartTheme);

  const labelFor = (typeId: string) =>
    resolveTypeLabel(typeId, customTypes, (core) => te(core as CoreEntryType));

  const dominantType = insight.takeawayValues?.type as string | undefined;
  const title = t(insight.titleKey, insight.takeawayValues ?? {});
  const description = t(insight.descriptionKey);
  const takeawayValues = insight.takeawayValues ?? {};
  const typeLabel =
    typeof takeawayValues.type === "string"
      ? isCoreEntryType(takeawayValues.type)
        ? te(takeawayValues.type as CoreEntryType)
        : labelFor(takeawayValues.type)
      : dominantType
        ? labelFor(dominantType)
        : "";
  const takeaway = t(insight.takeawayKey, {
    ...takeawayValues,
    type: typeLabel,
  });

  const chartData = data.map((item) => ({
    ...item,
    label: labelFor(item.type),
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
            width={88}
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
