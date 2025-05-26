import Link from "next/link";
import type { Topic, TopicCategory } from "@/types/topic.d";
import { useI18n } from "@/features/i18n/hooks/useI18n";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const { t } = useI18n();
  // カテゴリ別記事数の集計（最大3カテゴリ表示）
  const categorySummary = topic.categories
    ? topic.categories
        .slice(0, 3)
        .map((cat: TopicCategory) => `${cat.name}(${cat.articles.length}件)`)
        .join("、")
    : "";

  return (
    <div className="report-card w-full p-4 flex flex-col gap-2 bg-gray-800 bg-opacity-75 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-3 text-green-300 text-shadow-sm">
        {topic.title}
      </h2>
      <p className="text-gray-300 mb-4 flex-grow text-sm">{topic.summary}</p>
      <p className="text-sm text-gray-400 mb-1">カテゴリ: {categorySummary}</p>
      <p className="text-xs text-gray-400 mb-1">
        {t("topics.publishDate", { date: topic.publishDate })}
      </p>
      <p className="text-xs text-gray-400 mb-4">
        {t("topics.articleCount", { count: String(topic.articleCount) })}
      </p>
      <Link
        href={`/topics/${topic.id}`}
        className="mt-auto self-start bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm"
      >
        {t("topics.readThisMonth")}
      </Link>
    </div>
  );
}
