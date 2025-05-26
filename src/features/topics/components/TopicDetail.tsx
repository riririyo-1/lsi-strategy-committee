import React from "react";
import type { Topic, TopicCategory } from "@/types/topic";
import { CategorySection } from "./CategorySection";
import { useI18n } from "@/features/i18n/hooks/useI18n";

interface TopicDetailProps {
  topic: Topic;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({ topic }) => {
  const { t } = useI18n();
  return (
    <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl p-8 mt-24 shadow-lg">
      <h1 className="text-4xl font-bold text-yellow-300 mb-2">{topic.title}</h1>
      <p className="text-gray-400 mb-2">
        {t("topics.publishDate", { date: topic.publishDate })}
      </p>
      <p className="mb-6 text-gray-200">{topic.summary}</p>
      <div className="mb-8 flex justify-end">
        <a
          href="/topics"
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
        >
          TOPICS配信一覧へ戻る
        </a>
      </div>
      <h2 className="text-2xl font-semibold text-blue-200 mb-4">
        今月の記事一覧
      </h2>
      <div>
        {topic.categories.map((cat: TopicCategory) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
