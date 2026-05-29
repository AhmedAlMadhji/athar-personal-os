"use client";

import { AppShell } from "@/components/AppShell";
import { usePathname } from "@/i18n/navigation";

const MARKETING_PATHS = new Set(["/", "/landing"]);

function isMarketingPath(pathname: string): boolean {
  if (MARKETING_PATHS.has(pathname)) return true;
  return pathname.endsWith("/landing");
}

export function ConditionalAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (isMarketingPath(pathname)) {
    return (
      <div className="fixed inset-0 overflow-x-hidden overflow-y-auto overscroll-contain">
        {children}
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
