import { getTranslations } from "next-intl/server";
import { DetailLoading } from "@/components/detail/DetailPage";

export default async function EntryDetailLoadingPage() {
  const tc = await getTranslations("common");
  return <DetailLoading message={tc("loadingEntry")} />;
}
