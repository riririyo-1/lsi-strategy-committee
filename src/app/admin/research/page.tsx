"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResearchReportService } from "@/features/admin/services/ResearchReportService";
import { TrendReport } from "@/types/trendReport";
import PageWithBackground from "@/components/common/PageWithBackground";

export default function TrendReportsAdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<TrendReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await ResearchReportService.getReports();
        setReports(data);
      } catch (err) {
        setError("レポート一覧の取得に失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      try {
        await ResearchReportService.deleteReport(id);
        setReports(reports.filter((report) => report.id !== id));
        setConfirmDelete(null);
      } catch (err) {
        console.error("削除に失敗しました:", err);
        alert("削除に失敗しました");
      }
    } else {
      setConfirmDelete(id);
    }
  };

  const filtered = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  return (
    <PageWithBackground>
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-[#232b39] rounded-2xl shadow p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
              動向調査レポート 管理
            </h1>
            <div className="flex gap-2">
              <button
                className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded transition text-sm"
                onClick={() => router.push("/admin")}
              >
                管理者ページへ戻る
              </button>
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition text-sm"
                onClick={() => router.push("/admin/research/create")}
              >
                新規レポート作成
              </button>
            </div>
          </div>
          <div className="mb-6">
            <input
              type="text"
              className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none placeholder-gray-400"
              placeholder="レポートタイトルで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((report) => (
              <div
                key={report.id}
                className="bg-[#2d3646] rounded-xl shadow p-6 flex flex-col"
              >
                <div className="text-lg font-semibold text-blue-200 mb-2 truncate">
                  {report.title}
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  講演者: {report.speaker}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  公開日: {formatDate(report.publishDate)}
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  {/* 最終更新日: {report.updatedAt} */}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition text-sm"
                    onClick={() =>
                      router.push(`/admin/research/edit/${report.id}`)
                    }
                  >
                    編集
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition text-sm"
                    onClick={() => handleDelete(report.id)}
                  >
                    {confirmDelete === report.id ? "本当に削除？" : "削除"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>レポートが見つかりません</p>
            </div>
          )}
        </div>
      </div>
    </PageWithBackground>
  );
}
