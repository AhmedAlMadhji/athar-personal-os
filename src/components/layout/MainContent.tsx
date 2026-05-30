import type { ReactNode } from "react";

/**
 * App shell content spacing only — do not add page-level footer padding elsewhere.
 * Bottom padding keeps the last card clear of the global footer in AppShell.
 */
export const MAIN_CONTENT_CLASS =
  "mx-auto min-h-0 w-full max-w-6xl flex-1 px-4 pt-3 pb-16 sm:px-5 sm:pt-4 sm:pb-20 lg:px-6 lg:pb-24";

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className = "" }: MainContentProps) {
  return (
    <div className={`${MAIN_CONTENT_CLASS} ${className}`.trim()}>{children}</div>
  );
}
