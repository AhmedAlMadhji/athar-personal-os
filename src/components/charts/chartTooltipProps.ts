import type { useChartTheme } from "@/hooks/useChartTheme";

export function getChartTooltipProps(theme: ReturnType<typeof useChartTheme>) {
  return {
    contentStyle: theme.tooltipStyle,
    labelStyle: theme.tooltipLabelStyle,
    itemStyle: theme.tooltipItemStyle,
  };
}
