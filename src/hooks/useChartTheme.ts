"use client";

import { useMemo } from "react";
import { APP_FONT_FAMILY } from "@/lib/fonts";
import { useTheme } from "@/lib/utils";

export function useChartTheme() {
  const { dark } = useTheme();
  const fontFamily = APP_FONT_FAMILY;

  return useMemo(
    () => ({
      fontFamily,
      tooltipStyle: {
        borderRadius: "8px",
        border: dark ? "1px solid #3f3f46" : "1px solid #e4e4e7",
        backgroundColor: dark ? "#18181b" : "#ffffff",
        color: dark ? "#f4f4f5" : "#18181b",
        boxShadow: dark
          ? "0 4px 16px rgba(0, 0, 0, 0.45)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
        fontSize: "12px",
        fontFamily,
      },
      tooltipLabelStyle: {
        color: dark ? "#a1a1aa" : "#71717a",
        fontWeight: 500,
        marginBottom: 2,
        fontFamily,
      },
      tooltipItemStyle: {
        color: dark ? "#fafafa" : "#18181b",
        fontFamily,
      },
      axisTick: {
        fontSize: 11,
        fill: dark ? "#a1a1aa" : "#71717a",
        fontFamily,
      },
      gridClassName: dark ? "stroke-zinc-700" : "stroke-zinc-200",
      cursorFill: dark ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0.08)",
    }),
    [dark, fontFamily]
  );
}
