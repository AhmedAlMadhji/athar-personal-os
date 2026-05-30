"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useOnProfileImported } from "@/hooks/useOnProfileImported";
import { IconTrophy } from "@/components/icons/AppIcons";
import { PageHeader } from "@/components/PageHeader";
import { getEarnedAchievements } from "@/lib/achievementsService";
import type { AchievementCategory, EarnedAchievement } from "@/types/achievement";

const CATEGORY_ORDER: AchievementCategory[] = [
  "commitment",
  "consistency",
  "growth",
  "awareness",
];

const categoryStyles: Record<
  AchievementCategory,
  { border: string; bg: string; icon: string }
> = {
  commitment: {
    border: "border-indigo-200/80 dark:border-indigo-800/60",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/25",
    icon: "text-indigo-600 dark:text-indigo-400",
  },
  consistency: {
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/25",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  growth: {
    border: "border-violet-200/80 dark:border-violet-800/60",
    bg: "bg-violet-50/50 dark:bg-violet-950/25",
    icon: "text-violet-600 dark:text-violet-400",
  },
  awareness: {
    border: "border-amber-200/80 dark:border-amber-800/60",
    bg: "bg-amber-50/50 dark:bg-amber-950/25",
    icon: "text-amber-600 dark:text-amber-400",
  },
};

export default function AchievementsPage() {
  const t = useTranslations("achievements");
  const tc = useTranslations("common");
  const [earned, setEarned] = useState<EarnedAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await getEarnedAchievements();
    setEarned(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useOnProfileImported(() => {
    void load();
  });

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: earned.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />

      {earned.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200/90 bg-zinc-50/60 px-6 py-12 text-center dark:border-zinc-700/80 dark:bg-zinc-900/40">
          <IconTrophy className="mx-auto h-10 w-10 text-zinc-400" />
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            {t("empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ category, items }) => {
            const style = categoryStyles[category];
            return (
              <section key={category}>
                <h2 className="mb-3 text-start text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t(`categories.${category}`)}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={`rounded-xl border p-4 ${style.border} ${style.bg}`}
                    >
                      <div className="flex items-start gap-3">
                        <IconTrophy
                          className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`}
                        />
                        <div className="min-w-0 text-start">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {t(`items.${item.messageKey}`)}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                            {t(`items.${item.messageKey}Desc`)}
                          </p>
                          <p className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-500">
                            {tc("earnedOn", {
                              date: new Date(item.earnedAt).toLocaleDateString(),
                            })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
