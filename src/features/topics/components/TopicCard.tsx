import Link from "next/link";
import type { Topic, TopicCategory } from "@/types/topic.d";
// import { formatDate } from "@/utils/formatDate";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  // カテゴリ別記事数の集計（最大3カテゴリ表示）
  const categorySummary = topic.categories
    ? topic.categories
        .slice(0, 3)
        .map((cat: TopicCategory) => `${cat.name}(${cat.articles.length}件)`)
        .join("、")
    : "";

  return (
    <div className="report-card p-6 flex flex-col hover:transform hover:scale-105 transition-all bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-3 text-green-300">
        {topic.title}
      </h2>
      <div className="text-gray-300 mb-4 flex-grow">
        <p className="mb-2 line-clamp-3">{topic.summary}</p>
        <p className="text-sm text-gray-400">カテゴリ: {categorySummary}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-400">配信日: {topic.publishDate}</p>
        <p className="text-sm text-gray-400">記事数: {topic.articleCount}件</p>
      </div>
      <Link
        href={`/topics/${topic.id}`}
        className="mt-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-center"
      >
        今月号を読む
      </Link>
    </div>
  );
}
