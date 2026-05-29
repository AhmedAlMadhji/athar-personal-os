"use client";

import { useTranslations } from "next-intl";
import { PersonalInsightForm } from "@/components/PersonalInsightForm";
import { PageHeader } from "@/components/PageHeader";
import { useRouter } from "@/i18n/navigation";
import { createPersonalInsight } from "@/lib/personalInsightsService";
import type { PersonalInsightInput } from "@/types/personalInsight";

export default function AddInsightPage() {
  const t = useTranslations("insightsJournal");
  const router = useRouter();

  async function handleSubmit(input: PersonalInsightInput) {
    const insight = await createPersonalInsight(input);
    router.push(`/insights/${insight.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title={t("addInsight")} description={t("addDescription")} />
      <PersonalInsightForm onSubmit={handleSubmit} submitLabel={t("saveInsight")} />
    </div>
  );
}
