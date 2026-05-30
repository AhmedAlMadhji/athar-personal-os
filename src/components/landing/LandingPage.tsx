"use client";

import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";
import { IconCheck } from "@/components/icons/AppIcons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Link } from "@/i18n/navigation";

const GITHUB_URL = "https://github.com/AhmedAlMadhji";

function SectionShell({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32 ${className}`}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-500/35"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl border border-zinc-200/90 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-800 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 hover:bg-white dark:border-zinc-700/90 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-indigo-500/50 dark:hover:bg-zinc-900"
    >
      {children}
    </Link>
  );
}

export function LandingPage() {
  const t = useTranslations("landing");

  const painItems = t.raw("problem.items") as string[];
  const ideaItems = t.raw("idea.items") as {
    icon: string;
    text: string;
  }[];
  const beforeItems = t.raw("transformation.before") as string[];
  const afterItems = t.raw("transformation.after") as string[];
  const steps = t.raw("howItWorks.steps") as {
    icon: string;
    text: string;
  }[];
  const features = t.raw("features.items") as {
    icon: string;
    title: string;
    description: string;
  }[];
  const audiences = t.raw("audience.items") as string[];

  return (
    <div className="relative min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div
        className="landing-gradient pointer-events-none fixed inset-0 -z-10 opacity-60 dark:opacity-40"
        aria-hidden
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-start"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/30">
              أ
            </span>
            <span className="text-sm font-semibold tracking-tight">
              {t("brand")}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-28 sm:w-36">
              <LanguageSwitcher compact />
            </div>
            <PrimaryButton href="/dashboard">{t("nav.cta")}</PrimaryButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <SectionShell className="pb-16 pt-16 sm:pb-24 sm:pt-24 lg:pt-32">
        <div className="animate-fade-in-up text-center">
          <p className="text-start text-xs font-medium uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 sm:text-center">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-4 text-start text-4xl font-bold leading-[1.15] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-center sm:text-5xl lg:text-6xl">
            {t("hero.headline")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-start text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-center sm:text-lg">
            {t("hero.subheadline")}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <PrimaryButton href="/dashboard">{t("hero.ctaPrimary")}</PrimaryButton>
            <SecondaryButton href="/analytics">
              {t("hero.ctaSecondary")}
            </SecondaryButton>
          </div>
          <blockquote className="mx-auto mt-14 max-w-xl border-s-2 border-indigo-400/60 ps-4 text-start text-sm italic leading-relaxed text-zinc-500 dark:border-indigo-500/50 dark:text-zinc-400 sm:text-center sm:border-s-0 sm:ps-0">
            {t("hero.micro")}
          </blockquote>
        </div>
      </SectionShell>

      {/* Problem */}
      <SectionShell
        id="problem"
        className="border-t border-zinc-200/70 bg-white/50 dark:border-zinc-800/70 dark:bg-zinc-900/30"
      >
        <ScrollReveal>
          <h2 className="text-start text-3xl font-bold tracking-tight sm:text-4xl">
            {t("problem.title")}
          </h2>
          <p className="mt-4 text-start text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("problem.intro")}
          </p>
          <ul className="mt-8 space-y-3">
            {painItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-start text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-start text-lg font-medium italic text-zinc-800 dark:text-zinc-200">
            {t("problem.question")}
          </p>
        </ScrollReveal>
      </SectionShell>

      {/* Idea */}
      <SectionShell id="idea">
        <ScrollReveal>
          <h2 className="text-start text-3xl font-bold tracking-tight sm:text-4xl">
            {t("idea.title")}
          </h2>
          <p className="mt-4 text-start text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("idea.intro")}
          </p>
          <p className="mt-2 text-start text-base font-medium text-zinc-800 dark:text-zinc-200">
            {t("idea.subintro")}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {ideaItems.map((item, index) => (
              <ScrollReveal
                key={item.text}
                delayMs={index * 80}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <p className="mt-3 text-start text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                  {item.text}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Before / After */}
      <SectionShell
        id="transformation"
        className="border-t border-zinc-200/70 bg-gradient-to-b from-white/60 to-emerald-50/30 dark:border-zinc-800/70 dark:from-zinc-900/40 dark:to-emerald-950/20"
      >
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/90">
              <h3 className="text-start text-lg font-semibold text-zinc-500 dark:text-zinc-400">
                {t("transformation.beforeTitle")}
              </h3>
              <ul className="mt-5 space-y-3">
                {beforeItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-start text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="text-rose-400" aria-hidden>
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <h3 className="text-start text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                {t("transformation.afterTitle")}
              </h3>
              <ul className="mt-5 space-y-3">
                {afterItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-start text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <IconCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* How it works */}
      <SectionShell id="how">
        <ScrollReveal>
          <h2 className="text-start text-3xl font-bold tracking-tight sm:text-4xl">
            {t("howItWorks.title")}
          </h2>
          <ol className="mt-10 space-y-4">
            {steps.map((step, index) => (
              <li
                key={step.text}
                className="flex items-start gap-4 rounded-2xl border border-zinc-200/70 bg-white p-5 dark:border-zinc-800/70 dark:bg-zinc-900/60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg dark:bg-indigo-950/50">
                  {step.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {t("howItWorks.stepLabel", { step: index + 1 })}
                  </span>
                  <p className="mt-1 text-start text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </SectionShell>

      {/* Features */}
      <SectionShell
        id="features"
        className="border-t border-zinc-200/70 bg-white/40 dark:border-zinc-800/70 dark:bg-zinc-900/20"
      >
        <ScrollReveal>
          <h2 className="text-start text-3xl font-bold tracking-tight sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-3 text-start text-zinc-600 dark:text-zinc-400">
            {t("features.subtitle")}
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delayMs={index * 60}>
                <div className="h-full rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/80">
                  <span className="text-2xl" aria-hidden>
                    {feature.icon}
                  </span>
                  <h3 className="mt-4 text-start text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-start text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Core shift */}
      <SectionShell id="shift">
        <ScrollReveal>
          <div className="rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 text-center dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-violet-950/30 sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("shift.title")}
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("shift.line1")}
            </p>
            <p className="mx-auto mt-2 max-w-lg text-lg font-semibold text-indigo-700 dark:text-indigo-300">
              {t("shift.line2")}
            </p>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("shift.body")}
            </p>
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Creator */}
      <SectionShell
        id="creator"
        className="border-t border-zinc-200/70 dark:border-zinc-800/70"
      >
        <ScrollReveal>
          <div className="max-w-2xl">
            <h2 className="text-start text-2xl font-bold tracking-tight sm:text-3xl">
              {t("creator.title")}
            </h2>
            <div className="mt-6 space-y-4 text-start text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
              <p>{t("creator.p1")}</p>
              <p>{t("creator.p2")}</p>
              <p>{t("creator.p3")}</p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {t("creator.p4")}
              </p>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-indigo-300 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            >
              <FaGithub className="h-4 w-4" aria-hidden />
              {t("creator.github")}
            </a>
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Audience */}
      <SectionShell
        id="audience"
        className="bg-zinc-100/60 dark:bg-zinc-900/40"
      >
        <ScrollReveal>
          <h2 className="text-start text-2xl font-bold tracking-tight sm:text-3xl">
            {t("audience.title")}
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {audiences.map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-200/90 bg-white px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Final CTA */}
      <SectionShell id="cta" className="pb-28">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("final.title")}
            </h2>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <PrimaryButton href="/dashboard">{t("final.ctaPrimary")}</PrimaryButton>
              <SecondaryButton href="/timeline">
                {t("final.ctaSecondary")}
              </SecondaryButton>
            </div>
            <blockquote className="mx-auto mt-14 max-w-xl text-sm italic leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t("final.closing")}
            </blockquote>
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Footer */}
      <footer className="border-t border-zinc-200/70 px-4 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800/70 dark:text-zinc-500">
        <p>{t("footer")}</p>
        <p className="mt-2">
          <Link
            href="/about"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {t("footerAbout")}
          </Link>
        </p>
      </footer>
    </div>
  );
}
