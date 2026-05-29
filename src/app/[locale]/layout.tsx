import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ConditionalAppShell } from "@/components/ConditionalAppShell";
import { LocaleSync } from "@/components/LocaleSync";
import { DialogProvider } from "@/components/ui/DialogProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import { routing } from "@/i18n/routing";
import { tajawal } from "@/lib/fonts";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${tajawal.variable} ${tajawal.className}`}
    >
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <SettingsProvider>
            <DialogProvider>
              <ToastProvider>
                <LocaleSync />
                <ConditionalAppShell>{children}</ConditionalAppShell>
              </ToastProvider>
            </DialogProvider>
          </SettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
