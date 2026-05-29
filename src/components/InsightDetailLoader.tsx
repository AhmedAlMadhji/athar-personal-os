"use client";

import { useTranslations } from "next-intl";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import { DetailLoading } from "@/components/detail/DetailPage";
import { InsightDetailView } from "@/components/InsightDetailView";

interface InsightDetailLoaderProps {
  insightId: string;
}

function InsightDetailLoading() {
  const tc = useTranslations("common");
  return <DetailLoading message={tc("loading")} />;
}

export function InsightDetailLoader({ insightId }: InsightDetailLoaderProps) {
  const t = useTranslations("errors");

  if (!insightId?.trim()) {
    return <InsightDetailLoading />;
  }

  return (
    <ClientErrorBoundary
      fallbackTitle={t("title")}
      fallbackDescription={t("chunkDescription")}
      retryLabel={t("retry")}
      reloadLabel={t("reload")}
    >
      <InsightDetailView insightId={insightId.trim()} />
    </ClientErrorBoundary>
  );
}
