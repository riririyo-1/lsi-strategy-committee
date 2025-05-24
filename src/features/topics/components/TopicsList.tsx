import type { Topic } from "@/types/topic.d";
import { TopicCard } from "./TopicCard";

interface TopicsListProps {
  topics: Topic[];
  isLoading?: boolean;
}

export function TopicsList({ topics, isLoading }: TopicsListProps) {
  if (isLoading) {
    return <div className="text-center py-8 text-white">読み込み中...</div>;
  }
  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-8 text-white">データがありません</div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
