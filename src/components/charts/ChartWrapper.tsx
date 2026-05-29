"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

export const CHART_HEIGHT = {
  sm: 208,
  md: 260,
  lg: 288,
} as const;

export type ChartHeight = keyof typeof CHART_HEIGHT | number;

function resolveHeight(height: ChartHeight): number {
  return typeof height === "number" ? height : CHART_HEIGHT[height];
}

interface ChartWrapperProps {
  children: ReactElement;
  height?: ChartHeight;
  className?: string;
  ltr?: boolean;
}

export function ChartWrapper({
  children,
  height = "sm",
  className = "",
  ltr = true,
}: ChartWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const px = resolveHeight(height);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`w-full min-h-0 min-w-0 ${ltr ? "chart-ltr" : ""} ${className}`}
      style={{ height: px, minHeight: px }}
      dir={ltr ? "ltr" : undefined}
    >
      {mounted ? (
        <ResponsiveContainer width="100%" height={px}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}

/** Shared empty-state shell matching chart dimensions. */
export function ChartPlaceholder({
  height = "sm",
  children,
  className = "",
}: {
  height?: ChartHeight;
  children: ReactNode;
  className?: string;
}) {
  const px = resolveHeight(height);

  return (
    <div
      className={`flex w-full items-center justify-center ${className}`}
      style={{ height: px, minHeight: px }}
    >
      {children}
    </div>
  );
}
