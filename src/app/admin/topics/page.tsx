"use client";

import { useState } from "react";

type Article = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  status: "collected" | "summarized" | "error";
  summary?: string;
  labels?: string[];
};

const dummyArticles: Article[] = [
  {
    id: "a1",
    title: "次世代半導体材料の動向 2025",
    source: "Tech News",
    publishedAt: "2025-05-20",
    status: "summarized",
    summary: "SiCやGaNなど次世代材料の最新動向を解説。",
    labels: ["半導体", "材料", "SiC", "GaN"],
  },
  {
    id: "a2",
    title: "AIチップ市場の競争環境分析",
    source: "AI Times",
    publishedAt: "2025-04-15",
    status: "collected",
  },
  {
    id: "a3",
    title: "チップレット技術の最新トレンド",
    source: "Chiplet Journal",
    publishedAt: "2025-03-10",
    status: "error",
  },
];

export default function TopicsAdminPage() {
  const [activeTab, setActiveTab] = useState<"rss" | "manual">("rss");
  const [articles, setArticles] = useState(dummyArticles);

  return (
    <div className="min-h-screen bg-[#181e29] py-0 px-0">
      <div className="pt-[90px] pb-12 flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="bg-[#232b39] rounded-2xl shadow p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-6">
              TOPICS配信 記事管理
            </h1>
            <div className="flex gap-2 mb-6">
              <button
                className={`px-4 py-2 rounded transition text-sm font-semibold ${
                  activeTab === "rss"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
                onClick={() => setActiveTab("rss")}
              >
                RSS収集
              </button>
              <button
                className={`px-4 py-2 rounded transition text-sm font-semibold ${
                  activeTab === "manual"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
                onClick={() => setActiveTab("manual")}
              >
                手動追加
              </button>
              <button className="ml-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition text-sm">
                新規記事作成
              </button>
            </div>
            <div className="mb-6">
              <input
                type="text"
                className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none placeholder-gray-400"
                placeholder="記事タイトルで検索..."
                // 検索機能は省略
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#2d3646] rounded-xl shadow p-6 flex flex-col"
                >
                  <div className="text-lg font-semibold text-blue-200 mb-2 truncate">
                    {article.title}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    ソース: {article.source}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    公開日: {article.publishedAt}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    ステータス:{" "}
                    {article.status === "summarized"
                      ? "要約済"
                      : article.status === "collected"
                      ? "収集済"
                      : "エラー"}
                  </div>
                  {article.summary && (
                    <div className="text-xs text-gray-300 mb-2">
                      要約: {article.summary}
                    </div>
                  )}
                  {article.labels && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.labels.map((label) => (
                        <span
                          key={label}
                          className="bg-blue-700 text-xs text-white px-2 py-0.5 rounded"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
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
            {articles.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>記事が見つかりません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
