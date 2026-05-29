"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DetailActions,
  DetailArticle,
  DetailBackLink,
  DetailDangerButton,
  DetailEditHeader,
  DetailField,
  DetailFields,
  DetailLoading,
  DetailMetaBadge,
  DetailMetaRow,
  DetailNotFound,
  DetailPageShell,
  DetailPrimaryButton,
  DetailTimestamps,
  DetailTitle,
} from "@/components/detail/DetailPage";
import { PersonalInsightForm } from "@/components/PersonalInsightForm";
import { useConfirm } from "@/components/ui/DialogProvider";
import { useRouter } from "@/i18n/navigation";
import {
  deletePersonalInsight,
  getPersonalInsightById,
  updatePersonalInsight,
} from "@/lib/personalInsightsService";
import { formatDateTime } from "@/lib/utils";
import type { PersonalInsight, PersonalInsightInput } from "@/types/personalInsight";

interface InsightDetailViewProps {
  insightId: string;
}

export function InsightDetailView({ insightId }: InsightDetailViewProps) {
  const t = useTranslations("insightsJournal");
  const tc = useTranslations("common");
  const td = useTranslations("dialog");
  const confirm = useConfirm();
  const router = useRouter();
  const [insight, setInsight] = useState<PersonalInsight | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getPersonalInsightById(insightId);
      if (cancelled) return;

      if (!data) {
        setNotFound(true);
      } else {
        setInsight(data);
      }
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [insightId]);

  async function handleUpdate(input: PersonalInsightInput) {
    const updated = await updatePersonalInsight(insightId, input);
    if (updated) {
      setInsight(updated);
      setEditing(false);
    }
  }

  async function handleDelete() {
    if (!insight) return;

    const confirmed = await confirm({
      title: td("deleteTitle"),
      description: t("deleteConfirm"),
      confirmLabel: tc("delete"),
      cancelLabel: tc("cancel"),
      variant: "danger",
    });
    if (!confirmed) return;

    setDeleting(true);
    const ok = await deletePersonalInsight(insightId);
    if (ok) {
      router.push("/insights");
    } else {
      setDeleting(false);
    }
  }

  if (loading) {
    return <DetailLoading message={tc("loading")} />;
  }

  if (notFound || !insight) {
    return (
      <DetailNotFound
        title={t("notFound")}
        hint={t("notFoundHint")}
        backHref="/insights"
        backLabel={t("backToInsights")}
      />
    );
  }

  if (editing) {
    return (
      <DetailPageShell>
        <DetailEditHeader
          title={t("editInsight")}
          cancelLabel={tc("cancel")}
          onCancel={() => setEditing(false)}
        />
        <PersonalInsightForm
          initial={insight}
          onSubmit={handleUpdate}
          submitLabel={t("saveInsight")}
        />
      </DetailPageShell>
    );
  }

  return (
    <DetailPageShell>
      <DetailBackLink href="/insights">{t("backToInsights")}</DetailBackLink>

      <DetailArticle>
        <DetailMetaRow>
          <DetailMetaBadge variant="accent">
            {t(`form.categories.${insight.category}`)}
          </DetailMetaBadge>
          <DetailMetaBadge>
            {tc("rating")}: {tc("ratingOf", { rating: insight.confidenceLevel })}
          </DetailMetaBadge>
        </DetailMetaRow>

        <DetailTitle>{insight.title}</DetailTitle>

        <DetailFields>
          <DetailField label={t("form.realization")}>
            {insight.realization}
          </DetailField>
          {insight.cause && (
            <DetailField label={t("form.cause")}>{insight.cause}</DetailField>
          )}
          {insight.solution && (
            <DetailField label={t("form.solution")}>
              {insight.solution}
            </DetailField>
          )}
        </DetailFields>

        <DetailTimestamps
          createdLabel={tc("created")}
          createdAt={formatDateTime(insight.createdAt)}
          updatedLabel={tc("updated")}
          updatedAt={formatDateTime(insight.updatedAt)}
        />
      </DetailArticle>

      <DetailActions>
        <DetailPrimaryButton onClick={() => setEditing(true)}>
          {tc("edit")}
        </DetailPrimaryButton>
        <DetailDangerButton onClick={() => void handleDelete()} disabled={deleting}>
          {deleting ? tc("deleting") : tc("delete")}
        </DetailDangerButton>
      </DetailActions>
    </DetailPageShell>
  );
}
