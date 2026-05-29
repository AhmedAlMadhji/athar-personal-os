"use client";

import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";

const GITHUB_URL = "https://github.com/AhmedAlMadhji";

function GitHubIcon() {
  return <FaGithub className="h-4 w-4 shrink-0" aria-hidden />;
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900/90 sm:p-6 ${className}`}
    >
      <h2 className="text-start text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-start text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");

  const problems = [
    t("problem.items.lost"),
    t("problem.items.noTracking"),
    t("problem.items.noProgress"),
    t("problem.items.memory"),
    t("problem.items.noOs"),
  ];

  const solutions = [
    { title: t("solution.items.entries.title"), desc: t("solution.items.entries.desc") },
    { title: t("solution.items.insights.title"), desc: t("solution.items.insights.desc") },
    { title: t("solution.items.analytics.title"), desc: t("solution.items.analytics.desc") },
    { title: t("solution.items.timeline.title"), desc: t("solution.items.timeline.desc") },
  ];

  const principles = [
    t("philosophy.items.data"),
    t("philosophy.items.measurable"),
    t("philosophy.items.system"),
    t("philosophy.items.datapoint"),
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-4">
      <header className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-gradient-to-br from-white via-white to-indigo-50/40 p-6 dark:border-zinc-800/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/30 sm:p-8">
        <p className="text-start text-[11px] font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mt-2 text-start text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {t("hero.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-start text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          {t("hero.subtext")}
        </p>
        <p className="mt-4 text-start text-xs italic text-zinc-500 dark:text-zinc-500">
          {t("hero.tagline")}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-start font-medium text-zinc-800 dark:text-zinc-200">
            {t("hero.creator")}
          </span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300/90 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm transition-colors duration-150 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
          >
            <GitHubIcon />
            <span>{t("hero.github")}</span>
          </a>
        </div>
      </header>

      <Section title={t("problem.title")}>
        <p>{t("problem.intro")}</p>
        <ul className="list-disc space-y-1.5 ps-5 marker:text-zinc-400">
          {problems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t("solution.title")}>
        <p>{t("solution.intro")}</p>
        <p className="font-medium text-zinc-800 dark:text-zinc-200">
          {t("solution.osLabel")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {solutions.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800/80 dark:bg-zinc-950/40"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("philosophy.title")}>
        <p>{t("philosophy.intro")}</p>
        <ul className="space-y-2">
          {principles.map((item) => (
            <li
              key={item}
              className="border-s-2 border-indigo-400/70 ps-3 text-start dark:border-indigo-500/60"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t("creator.title")}>
        <p>{t("creator.story")}</p>
        <p>{t("creator.background")}</p>
        <p>{t("creator.motivation")}</p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-300/90 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-800 transition-colors duration-150 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
        >
          <GitHubIcon />
          <span>{t("creator.githubCta")}</span>
          <span className="text-indigo-600 dark:text-indigo-400" aria-hidden>
            ↗
          </span>
        </a>
      </Section>

      <footer className="rounded-lg border border-indigo-200/60 bg-indigo-50/50 px-5 py-6 text-center dark:border-indigo-900/50 dark:bg-indigo-950/20">
        <p className="text-base font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
          {t("closing.quote")}
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
          {t("closing.note")}
        </p>
      </footer>
    </div>
  );
}
