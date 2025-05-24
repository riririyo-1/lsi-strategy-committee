"use client";

import { useState } from "react";
import { TopicsList } from "./TopicsList";
import { useTopics } from "../hooks/useTopics";
import PageWithBackground from "@/components/common/PageWithBackground";

export function TopicsFeature() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { topics, isLoading, error } = useTopics({
    year: selectedYear,
  });

  // エラーメッセージは後で共通化
  if (error) {
    return (
      <PageWithBackground className="min-h-screen">
        <div className="text-red-500 text-center py-8">
          データの取得に失敗しました
        </div>
      </PageWithBackground>
    );
  }

  return (
    <PageWithBackground className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white">
          半導体TOPICS配信
        </h1>
        {/* <YearFilter selectedYear={selectedYear} onYearChange={setSelectedYear} availableYears={[2023, 2024, 2025]} /> */}
        <TopicsList topics={topics} isLoading={isLoading} />
      </div>
    </PageWithBackground>
  );
}
