# TOPICS 配信ページ実装 README

## 概要

月次で配信される半導体業界の TOPICS を一覧表示し、各 TOPICS の詳細記事を階層的に表示するページです。

## ファイル構成

```
frontend/
├── app/
│   └── topics/
│       ├── page.tsx                      # TOPICS一覧ページ
│       └── [id]/
│           ├── page.tsx                  # TOPICS詳細ページ
│           └── article/[articleId]/
│               └── page.tsx              # 記事詳細ページ
├── features/
│   └── topics/
│       ├── index.ts
│       ├── components/
│       │   ├── TopicsList.tsx           # TOPICS一覧
│       │   ├── TopicCard.tsx            # TOPICSカード
│       │   ├── TopicDetail.tsx          # TOPICS詳細
│       │   ├── ArticlesList.tsx         # 記事一覧
│       │   ├── ArticleCard.tsx          # 記事カード
│       │   └── CategorySection.tsx      # カテゴリセクション
│       ├── hooks/
│       │   ├── useTopics.ts             # TOPICSデータ取得
│       │   └── useArticles.ts           # 記事データ取得
│       └── use-cases/
│           ├── GetTopicsUseCase.ts
│           └── GetArticlesByTopicUseCase.ts
├── types/
│   ├── topic.d.ts                       # TOPICS型定義
│   └── article.d.ts                     # 記事型定義
└── libs/
    └── api/
        └── topicsApi.ts                  # API通信
```

## 実装詳細

### 1. 型定義

```typescript
// types/topic.d.ts
export interface Topic {
  id: string;
  title: string;
  publishDate: string;
  summary: string;
  articleCount: number;
  categories: TopicCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface TopicCategory {
  id: string;
  name: string;
  displayOrder: number;
  articles: TopicArticle[];
}

export interface TopicArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  subCategory: string;
  summary: string;
  labels: string[];
  articleUrl: string;
}

// types/article.d.ts
export interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  labels: string[];
  thumbnailUrl?: string;
  articleUrl: string;
  fullText?: string;
  category?: string;
  subCategory?: string;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

### 2. 一覧ページ

```typescript
// app/topics/page.tsx
import { Metadata } from "next";
import { TopicsFeature } from "@/features/topics";

export const metadata: Metadata = {
  title: "TOPICS配信 - LSI戦略コミッティ",
  description: "半導体業界の月次トピックス配信",
};

export default function TopicsPage() {
  return <TopicsFeature />;
}
```

### 3. Feature 実装

```typescript
// features/topics/components/TopicsFeature.tsx
"use client";

import { useState } from "react";
import { TopicsList } from "./TopicsList";
import { useTopics } from "../hooks/useTopics";
import { YearFilter } from "./YearFilter";

export function TopicsFeature() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { topics, isLoading, error } = useTopics({
    year: selectedYear,
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white">
          半導体TOPICS配信
        </h1>

        <YearFilter
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableYears={[2023, 2024, 2025]}
        />

        <TopicsList topics={topics} isLoading={isLoading} />
      </div>
    </div>
  );
}
```

### 4. TOPICS カード

```typescript
// features/topics/components/TopicCard.tsx
import Link from "next/link";
import { Topic } from "@/types/topic";
import { formatDate } from "@/libs/utils/dateFormatter";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  // カテゴリ別記事数の集計
  const categorySummary = topic.categories
    .slice(0, 3)
    .map((cat) => `${cat.name}(${cat.articles.length}件)`)
    .join("、");

  return (
    <div className="report-card p-6 flex flex-col hover:transform hover:scale-105 transition-all">
      <h2 className="text-2xl font-semibold mb-3 text-green-300">
        {topic.title}
      </h2>

      <div className="text-gray-300 mb-4 flex-grow">
        <p className="mb-2 line-clamp-3">{topic.summary}</p>
        <p className="text-sm text-gray-400">カテゴリ: {categorySummary}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400">
          配信日: {formatDate(topic.publishDate)}
        </p>
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
```

### 5. TOPICS 詳細ページ

```typescript
// features/topics/components/TopicDetail.tsx
"use client";

import { Topic } from "@/types/topic";
import { CategorySection } from "./CategorySection";
import { BackButton } from "@/components/ui/BackButton";

interface TopicDetailProps {
  topic: Topic;
}

export function TopicDetail({ topic }: TopicDetailProps) {
  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="detail-content-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">
              {topic.title}
            </h1>
            <BackButton href="/topics" label="TOPICS配信一覧へ戻る" />
          </div>

          <p className="text-sm text-gray-400 mb-4">
            配信日: {formatDate(topic.publishDate)}
          </p>

          <div className="prose prose-invert max-w-none text-gray-200 mb-8">
            <p>{topic.summary}</p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-sky-300">
            今月の記事一覧
          </h2>

          <div className="space-y-8">
            {topic.categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                topicId={topic.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6. カテゴリセクション

```typescript
// features/topics/components/CategorySection.tsx
import Link from "next/link";
import { TopicCategory } from "@/types/topic";

interface CategorySectionProps {
  category: TopicCategory;
  topicId: string;
}

export function CategorySection({ category, topicId }: CategorySectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-blue-300 mb-3">
        {category.name}
      </h3>

      <div className="ml-4 space-y-4">
        {category.articles.map((article) => (
          <article
            key={article.id}
            className="pb-3 border-b border-gray-700 last:border-b-0"
          >
            <Link
              href={`/topics/${topicId}/article/${article.id}`}
              className="group"
            >
              <h4 className="font-medium text-lg text-gray-100 mb-1 group-hover:text-blue-300 transition">
                {article.title}
              </h4>
            </Link>

            <p className="text-xs text-gray-400 mb-1">
              {article.source} | {formatDate(article.publishedAt)} -{" "}
              {article.subCategory}
            </p>

            <p className="text-sm text-gray-300 leading-relaxed mb-2">
              {article.summary}
            </p>

            <div className="flex flex-wrap gap-2">
              {article.labels.map((label) => (
                <span
                  key={label}
                  className="text-xs bg-sky-600 text-sky-100 px-2 py-0.5 rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### 7. カスタムフック

```typescript
// features/topics/hooks/useTopics.ts
import useSWR from "swr";
import { GetTopicsUseCase } from "../use-cases/GetTopicsUseCase";

interface UseTopicsOptions {
  year?: number;
  page?: number;
  pageSize?: number;
}

export function useTopics(options: UseTopicsOptions = {}) {
  const getTopicsUseCase = new GetTopicsUseCase();

  const { data, error, mutate } = useSWR(
    ["topics", options],
    () => getTopicsUseCase.execute(options),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    topics: data?.topics || [],
    total: data?.total || 0,
    isLoading: !error && !data,
    error,
    mutate,
  };
}
```

### 8. Use Case 実装

```typescript
// features/topics/use-cases/GetTopicsUseCase.ts
import { topicsApi } from "@/libs/api/topicsApi";
import { Topic } from "@/types/topic";

interface GetTopicsParams {
  year?: number;
  page?: number;
  pageSize?: number;
}

interface GetTopicsResult {
  topics: Topic[];
  total: number;
  page: number;
  pageSize: number;
}

export class GetTopicsUseCase {
  async execute(params: GetTopicsParams): Promise<GetTopicsResult> {
    try {
      const response = await topicsApi.getTopics(params);

      // ビジネスロジック（例：配信日でソート）
      const sortedTopics = response.topics.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );

      return {
        ...response,
        topics: sortedTopics,
      };
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      throw error;
    }
  }
}
```

## 状態管理

```typescript
// store/topics/topicsStore.ts
import { create } from "zustand";
import { Topic, Article } from "@/types";

interface TopicsStore {
  topics: Topic[];
  selectedTopic: Topic | null;
  selectedArticle: Article | null;
  filters: {
    year: number;
    category?: string;
  };
  setTopics: (topics: Topic[]) => void;
  setSelectedTopic: (topic: Topic | null) => void;
  setSelectedArticle: (article: Article | null) => void;
  updateFilters: (filters: Partial<TopicsStore["filters"]>) => void;
}

export const useTopicsStore = create<TopicsStore>((set) => ({
  topics: [],
  selectedTopic: null,
  selectedArticle: null,
  filters: {
    year: new Date().getFullYear(),
  },
  setTopics: (topics) => set({ topics }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  setSelectedArticle: (article) => set({ selectedArticle: article }),
  updateFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
}));
```

## パフォーマンス最適化

1. **データ取得の最適化**

   - SWR によるキャッシュとバックグラウンド更新
   - ページネーション実装
   - 検索の最適化（デバウンス）

2. **レンダリング最適化**
   - React.memo によるコンポーネントの最適化
   - 仮想スクロールの実装（大量記事対応）
   - 遅延読み込み

## テスト計画

### Unit Tests

```typescript
// __tests__/features/topics/TopicCard.test.tsx
describe("TopicCard", () => {
  it("TOPICS情報を正しく表示", () => {
    const mockTopic = {
      id: "1",
      title: "2025年5月号 TOPICS",
      publishDate: "2025-05-01",
      articleCount: 10,
      // ...
    };

    render(<TopicCard topic={mockTopic} />);
    expect(screen.getByText("2025年5月号 TOPICS")).toBeInTheDocument();
    expect(screen.getByText("記事数: 10件")).toBeInTheDocument();
  });
});
```

## アクセシビリティ

1. **階層構造の明確化**

   - 適切な見出しレベル
   - ARIA ラベルの設定

2. **キーボードナビゲーション**
   - Tab 順序の適切な設定
   - Enter キーでのリンク操作
