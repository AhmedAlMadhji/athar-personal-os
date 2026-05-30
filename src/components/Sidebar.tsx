"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useTheme } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", labelKey: "dashboard" as const, icon: "dashboard" },
  { href: "/add", labelKey: "addEntry" as const, icon: "add" },
  { href: "/timeline", labelKey: "timeline" as const, icon: "timeline" },
  { href: "/analytics", labelKey: "analytics" as const, icon: "analytics" },
  { href: "/insights", labelKey: "insights" as const, icon: "insights" },
  { href: "/settings", labelKey: "settings" as const, icon: "settings" },
  { href: "/about", labelKey: "about" as const, icon: "about" },
];

function NavIcon({ name }: { name: string }) {
  const props = {
    className: "h-4 w-4 shrink-0",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case "add":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      );
    case "timeline":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
        </svg>
      );
    case "insights":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "about":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
  }
}

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function getMobilePanelClasses(mobileOpen: boolean, isRtl: boolean): string {
  if (mobileOpen) {
    return "translate-x-0 opacity-100 pointer-events-auto";
  }

  const hiddenTransform = isRtl ? "translate-x-full" : "-translate-x-full";
  return `${hiddenTransform} opacity-0 pointer-events-none`;
}

function getDesktopPanelClasses(): string {
  return "translate-x-0 opacity-100 pointer-events-auto";
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const isDesktop = useIsDesktop();
  const isRtl = locale === "ar";
  const { dark, toggleTheme, mounted } = useTheme();
  const tNav = useTranslations("nav");
  const tApp = useTranslations("app");
  const tTheme = useTranslations("theme");
  const tc = useTranslations("common");

  const isMobileOpen = mobileOpen;
  const showOverlay = !isDesktop && isMobileOpen;

  const panelMotionClasses = useMemo(
    () =>
      isDesktop
        ? getDesktopPanelClasses()
        : getMobilePanelClasses(isMobileOpen, isRtl),
    [isDesktop, isMobileOpen, isRtl]
  );

  const overlayClasses = useMemo(
    () =>
      showOverlay
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none",
    [showOverlay]
  );

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-zinc-900/50 transition-opacity duration-200 ease-out lg:hidden ${overlayClasses}`}
        onClick={onClose}
        aria-label={tc("closeMenu")}
        aria-hidden={!showOverlay}
        tabIndex={showOverlay ? 0 : -1}
      />

      <aside
        className={`fixed inset-y-0 inset-inline-start-0 z-50 flex h-dvh max-h-dvh w-64 max-w-[85vw] transform flex-col overflow-hidden border-e border-zinc-200/80 bg-white/95 shadow-xl backdrop-blur-xl transition-[transform,opacity] duration-200 ease-out will-change-[transform,opacity] dark:border-zinc-800/80 dark:bg-zinc-900/95 lg:w-64 lg:max-w-none lg:shadow-none lg:will-change-auto ${panelMotionClasses}`}
      >
        <div className="flex h-full min-h-0 flex-col p-3.5">
          <Link
            href="/dashboard"
            className="mb-3 flex shrink-0 items-center gap-2.5 rounded-lg px-1 py-0.5 transition-colors duration-150 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50"
            onClick={onClose}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white shadow-md shadow-indigo-500/20">
              SP
            </div>
            <div className="min-w-0 text-start">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {tApp("brandSubtitle")}
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {tApp("brandName")}
              </p>
            </div>
          </Link>

          <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto touch-pan-y [-webkit-overflow-scrolling:touch]">
            {navItems.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "border-s-2 border-indigo-500 bg-indigo-50 font-semibold text-indigo-800 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-200"
                      : "border-s-2 border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  <span className="text-start">{tNav(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-2 shrink-0 space-y-1.5 border-t border-zinc-200/80 pt-2.5 dark:border-zinc-800/80">
            {mounted && (
              <button
                type="button"
                onClick={() => void toggleTheme()}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {dark ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  )}
                </svg>
                <span className="text-start">
                  {dark ? tTheme("light") : tTheme("dark")}
                </span>
              </button>
            )}
            <p className="px-2 text-start text-[10px] leading-snug text-zinc-400 dark:text-zinc-500">
              {tApp("dataLocal")}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
