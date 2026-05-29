import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { detectLocaleFromHeader } from "@/lib/detectLocale";

export default async function RootPage() {
  const headersList = await headers();
  const locale = detectLocaleFromHeader(headersList.get("accept-language"));
  redirect(`/${locale}/landing`);
}
