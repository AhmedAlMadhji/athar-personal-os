"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DetailActions,
  DetailArticle,
  DetailBackLink,
  DetailDangerButton,
  DetailEditHeader,
  DetailLoading,
  DetailMetaBadge,
  DetailMetaRow,
  DetailNotFound,
  DetailPageShell,
  DetailPrimaryButton,
  DetailTimestamps,
  DetailTitle,
} from "@/components/detail/DetailPage";
import { EntryForm } from "@/components/EntryForm";
import { useConfirm } from "@/components/ui/DialogProvider";
import { TypeBadge } from "@/components/TypeBadge";
import { useRouter } from "@/i18n/navigation";
import {
  deleteEntry,
  getEntryById,
  updateEntry,
} from "@/lib/entriesService";
import { formatDateTime } from "@/lib/utils";
import type { Entry, EntryInput } from "@/types/entry";

interface EntryDetailViewProps {
  entryId: string;
}

export function EntryDetailView({ entryId }: EntryDetailViewProps) {
  const t = useTranslations("entryDetail");
  const tc = useTranslations("common");
  const td = useTranslations("dialog");
  const confirm = useConfirm();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getEntryById(entryId);
      if (cancelled) return;

      if (!data) {
        setNotFound(true);
      } else {
        setEntry(data);
      }
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [entryId]);

  async function handleUpdate(input: EntryInput) {
    const updated = await updateEntry(entryId, input);
    if (updated) {
      setEntry(updated);
      setEditing(false);
    }
  }

  async function handleDelete() {
    if (!entry) return;

    const confirmed = await confirm({
      title: td("deleteTitle"),
      description: t("deleteConfirm"),
      confirmLabel: tc("delete"),
      cancelLabel: tc("cancel"),
      variant: "danger",
    });
    if (!confirmed) return;

    setDeleting(true);
    const success = await deleteEntry(entryId);
    if (success) {
      router.push("/timeline");
    } else {
      setDeleting(false);
    }
  }

  if (loading) {
    return <DetailLoading message={tc("loadingEntry")} />;
  }

  if (notFound || !entry) {
    return (
      <DetailNotFound
        title={t("notFound")}
        hint={t("notFoundHint")}
        backHref="/timeline"
        backLabel={tc("backToTimeline")}
      />
    );
  }

  if (editing) {
    return (
      <DetailPageShell>
        <DetailEditHeader
          title={t("editTitle")}
          cancelLabel={tc("cancel")}
          onCancel={() => setEditing(false)}
        />
        <EntryForm
          initial={entry}
          onSubmit={handleUpdate}
          submitLabel={t("update")}
        />
      </DetailPageShell>
    );
  }

  return (
    <DetailPageShell>
      <DetailBackLink href="/timeline">{tc("backToTimeline")}</DetailBackLink>

      <DetailArticle>
        <DetailMetaRow>
          <TypeBadge type={entry.type} />
          <DetailMetaBadge>
            {tc("rating")}: {tc("ratingOf", { rating: entry.rating })}
          </DetailMetaBadge>
        </DetailMetaRow>

        <DetailTitle>{entry.title || tc("untitled")}</DetailTitle>

        <p className="mt-4 whitespace-pre-wrap text-start text-zinc-700 dark:text-zinc-300">
          {entry.description}
        </p>

        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-50 px-2 py-0.5 text-sm text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <DetailTimestamps
          createdLabel={tc("created")}
          createdAt={formatDateTime(entry.createdAt)}
          updatedLabel={tc("updated")}
          updatedAt={formatDateTime(entry.updatedAt)}
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
