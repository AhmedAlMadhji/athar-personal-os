import { getTranslations, setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/landing/LandingPage";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  return {
    title: t("brand"),
    description: t("hero.subheadline"),
  };
}

/** Locale root (`/en`, `/ar`) — marketing entry point. */
export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage />;
}
