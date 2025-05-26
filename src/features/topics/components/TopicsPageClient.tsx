"use client";

import { useI18n } from "@/features/i18n/hooks/useI18n";
import { useState } from "react";
import { Topic } from "@/types/topic.d";
import { TopicCard } from "./TopicCard";

const dummyTopics: Topic[] = [
  {
    id: "topic-001",
    title: "次世代半導体材料の動向 2025",
    summary: "SiCやGaNなど次世代材料の最新動向と市場予測を解説。",
    publishDate: "2025-05-15",
    articleCount: 12,
    categories: [
      {
        id: "cat-1",
        name: "材料",
        displayOrder: 1,
        articles: [{ id: "a1" }],
      },
      {
        id: "cat-2",
        name: "市場",
        displayOrder: 2,
        articles: [{ id: "a2" }],
      },
    ],
    createdAt: "2025-05-01",
    updatedAt: "2025-05-10",
  },
  {
    id: "topic-002",
    title: "AIチップ市場の競争環境分析",
    summary:
      "主要プレイヤーの戦略と新興企業の動向、今後の市場シェア変動を予測。",
    publishDate: "2025-04-28",
    articleCount: 8,
    categories: [
      {
        id: "cat-3",
        name: "AI",
        displayOrder: 1,
        articles: [{ id: "a3" }],
      },
      {
        id: "cat-4",
        name: "チップ",
        displayOrder: 2,
        articles: [{ id: "a4" }],
      },
    ],
    createdAt: "2025-04-01",
    updatedAt: "2025-04-10",
  },
  {
    id: "topic-003",
    title: "チップレット技術の最新トレンドと将来展望",
    summary: "チップレット技術の採用状況、標準化動向、今後の技術的課題を考察。",
    publishDate: "2025-03-10",
    articleCount: 5,
    categories: [
      {
        id: "cat-5",
        name: "チップレット",
        displayOrder: 1,
        articles: [{ id: "a5" }],
      },
    ],
    createdAt: "2025-03-01",
    updatedAt: "2025-03-10",
  },
];

const TopicsPageClient = () => {
  const { t } = useI18n();
  const [topics] = useState<Topic[]>(dummyTopics);

  return (
    <div
      className="content-overlay relative z-1 flex flex-col items-center min-h-[calc(100vh-120px)] pt-[90px] pb-5 px-5 text-white"
      style={{
        backgroundImage: "url(/images/topics.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white text-shadow">
        {t("topics.title") || "TOPICS配信"}
      </h1>
      <p className="text-xl mb-8 text-center max-w-4xl">
        {t("topics.description") || "半導体業界の月次トピックス配信"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
      {topics.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>{t("topics.noData") || "トピックスが見つかりません"}</p>
        </div>
      )}
    </div>
  );
};

export default TopicsPageClient;
