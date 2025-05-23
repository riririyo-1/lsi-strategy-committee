"use client";

import { TrendReport } from "@/types/trendReport";
import Link from "next/link";
import { useI18n } from "@/features/i18n/hooks/useI18n";

interface ReportCardProps {
  report: TrendReport;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { t } = useI18n();
  return (
    <div className="report-card p-6 flex flex-col bg-gray-800 bg-opacity-75 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-3 text-blue-300 text-shadow-sm">
        {report.title}
      </h2>
      <p className="text-gray-300 mb-4 flex-grow text-sm">{report.summary}</p>
      <p className="text-xs text-gray-400 mb-4">
        {t("research.publishDate", { date: report.publishDate })}
      </p>
      <Link href={`/research/${report.id}`} legacyBehavior>
        <a className="mt-auto self-start bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm">
          {t("research.readMore")}
        </a>
      </Link>
    </div>
  );
};

export default ReportCard;
