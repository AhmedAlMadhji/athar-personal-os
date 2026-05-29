"use client";

import { useTranslations } from "next-intl";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import { DetailLoading } from "@/components/detail/DetailPage";
import { EntryDetailView } from "@/components/EntryDetailView";

interface EntryDetailLoaderProps {
  entryId: string;
}

function EntryDetailLoading() {
  const tc = useTranslations("common");
  return <DetailLoading message={tc("loadingEntry")} />;
}

export function EntryDetailLoader({ entryId }: EntryDetailLoaderProps) {
  const t = useTranslations("errors");

  if (!entryId?.trim()) {
    return <EntryDetailLoading />;
  }

  return (
    <ClientErrorBoundary
      fallbackTitle={t("title")}
      fallbackDescription={t("chunkDescription")}
      retryLabel={t("retry")}
      reloadLabel={t("reload")}
    >
      <EntryDetailView entryId={entryId.trim()} />
    </ClientErrorBoundary>
  );
}
