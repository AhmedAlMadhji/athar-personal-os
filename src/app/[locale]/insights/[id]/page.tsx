import { InsightDetailLoader } from "@/components/InsightDetailLoader";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || typeof id !== "string" || !id.trim()) {
    notFound();
  }

  return <InsightDetailLoader insightId={id} />;
}
