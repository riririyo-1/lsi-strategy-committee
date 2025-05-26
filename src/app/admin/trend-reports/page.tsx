"use client";

import { useState } from "react";

type Report = {
  id: string;
  title: string;
  speaker: string;
  publishDate: string;
  updatedAt: string;
};

const dummyReports: Report[] = [
  {
    id: "1",
    title: "SS事業部向け講演会: 次世代半導体とLSI戦略",
    speaker: "山田 太郎",
    publishDate: "2025-05-20",
    updatedAt: "2025-05-21",
  },
  {
    id: "2",
    title: "AIチップ市場の競争環境と将来予測",
    speaker: "佐藤 花子",
    publishDate: "2025-04-15",
    updatedAt: "2025-04-18",
  },
  {
    id: "3",
    title: "チップレット技術が切り開く半導体の未来",
    speaker: "鈴木 一郎",
    publishDate: "2025-03-10",
    updatedAt: "2025-03-12",
  },
];

export default function TrendReportsAdminPage() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState(dummyReports);

  const filtered = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#181e29] py-0 px-0">
      <div className="pt-[90px] pb-12 flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="bg-[#232b39] rounded-2xl shadow p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
                動向調査レポート 管理
              </h1>
              <div className="flex gap-2">
                <button className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded transition text-sm">
                  管理者ページへ戻る
                </button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition text-sm">
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
                    公開日: {report.publishDate}
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    最終更新日: {report.updatedAt}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition text-sm">
                      編集
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition text-sm">
                      削除
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
      </div>
    </div>
  );
}
