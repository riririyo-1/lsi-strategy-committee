import { ResearchReportDetailClient } from "@/features/research/components/ResearchReportDetailClient";
import { getResearchReportById } from "@/features/research/usecases/getResearchReportById";
import { notFound } from "next/navigation";

interface ResearchDetailPageProps {
  params: { id: string };
}

export default async function ResearchDetailPage({
  params,
}: ResearchDetailPageProps) {
  const report = await getResearchReportById(params.id);
  if (!report) return notFound();
  return <ResearchReportDetailClient report={report} />;
}
