"use client";

import { useTranslations } from "next-intl";
import { EntryForm } from "@/components/EntryForm";
import { PageHeader } from "@/components/PageHeader";
import { useRouter } from "@/i18n/navigation";
import { createEntry } from "@/lib/entriesService";
import type { EntryInput } from "@/types/entry";

export default function AddEntryPage() {
  const t = useTranslations("addEntry");
  const router = useRouter();

  async function handleSubmit(input: EntryInput) {
    const entry = await createEntry(input);
    router.push(`/entries/${entry.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <EntryForm onSubmit={handleSubmit} submitLabel={t("save")} />
    </div>
  );
}
