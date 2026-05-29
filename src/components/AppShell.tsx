"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useIsDesktop } from "@/hooks/useIsDesktop";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const tApp = useTranslations("app");
  const tc = useTranslations("common");

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  useEffect(() => {
    if (isDesktop) {
      setMobileOpen(false);
    }
  }, [isDesktop]);

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-50/90 dark:bg-zinc-900">
      <Sidebar mobileOpen={mobileOpen} onClose={closeMobile} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:ps-64">
        <header className="z-30 flex shrink-0 items-center gap-3 border-b border-zinc-200/80 bg-white/90 px-4 py-2 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90 lg:hidden">
          <button
            type="button"
            onClick={openMobile}
            className="rounded-md p-2 text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
            aria-label={tc("openMenu")}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <span className="flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {tApp("mobileTitle")}
          </span>
          <div className="w-32">
            <LanguageSwitcher compact />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
            {children}
          </div>
        </main>

        <footer className="shrink-0 border-t border-zinc-200/80 py-2 text-center text-[11px] text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
          {tApp("footer")}
        </footer>
      </div>
    </div>
  );
}
