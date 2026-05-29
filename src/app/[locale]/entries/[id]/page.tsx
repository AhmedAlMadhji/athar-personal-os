import { EntryDetailLoader } from "@/components/EntryDetailLoader";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || typeof id !== "string" || !id.trim()) {
    notFound();
  }

  return <EntryDetailLoader entryId={id} />;
}
