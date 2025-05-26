"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageWithBackground from "@/components/common/PageWithBackground";
import ResearchReportForm from "@/features/admin/components/ResearchReportForm";
import { ResearchReportService } from "@/features/admin/services/ResearchReportService";
import { TrendReport } from "@/types/trendReport";

interface ResearchReportEditPageProps {
  params: {
    id?: string;
  };
}

export default function ResearchReportEditPage({
  params,
}: ResearchReportEditPageProps) {
  const router = useRouter();
  const [report, setReport] = useState<TrendReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!params.id;

  useEffect(() => {
    async function loadReport() {
      if (isEditing) {
        try {
          const loadedReport = await ResearchReportService.getReportById(
            params.id!
          );
          if (!loadedReport) {
            setError("レポートが見つかりません");
            return;
          }
          setReport(loadedReport);
        } catch (err) {
          setError("レポート情報の取得に失敗しました");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    loadReport();
  }, [isEditing, params.id]);

  const handleSave = async (reportData: TrendReport) => {
    try {
      if (isEditing) {
        await ResearchReportService.updateReport(params.id!, reportData);
      } else {
        await ResearchReportService.createReport(reportData);
      }
      // 保存成功したら一覧ページへ戻る
      router.push("/admin/research");
    } catch (err) {
      throw new Error("レポートの保存に失敗しました");
    }
  };

  const handleCancel = () => {
    // 一覧ページへ戻る
    router.push("/admin/research");
  };

  return (
    <PageWithBackground>
      <div className="w-full max-w-5xl mx-auto">
        {loading ? (
          <div className="bg-[#232b39] rounded-2xl shadow p-8 text-center text-gray-300">
            <p>読み込み中...</p>
          </div>
        ) : error ? (
          <div className="bg-[#232b39] rounded-2xl shadow p-8">
            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded mb-6">
              {error}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/admin/research")}
                className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded transition"
              >
                戻る
              </button>
            </div>
          </div>
        ) : (
          <ResearchReportForm
            report={report || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </PageWithBackground>
  );
}
