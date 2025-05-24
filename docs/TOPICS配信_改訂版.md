# TOPICS 配信ページ実装 README

## 概要

月次で配信される半導体業界の TOPICS を一覧表示し、各 TOPICS の詳細記事を階層的に表示するページです。クリーンアーキテクチャの原則に従い、責務の分離と依存性の方向を明確にした実装を行います。

## ファイル構成

```
src/
├── app/
│   └── topics/
│       ├── page.tsx                      # TOPICS一覧ページ
│       └── [id]/
│           ├── page.tsx                  # TOPICS詳細ページ
│           └── article/[articleId]/
│               └── page.tsx              # 記事詳細ページ
├── features/
│   └── topics/
│       ├── index.ts                      # 機能のエントリーポイント（エクスポート）
│       ├── components/                   # UI層 (Frameworks & Drivers)
│       │   ├── TopicsFeature.tsx         # メインコンポーネント
│       │   ├── TopicsList.tsx            # TOPICS一覧表示
│       │   ├── TopicCard.tsx             # TOPICSカード
│       │   ├── TopicDetail.tsx           # TOPICS詳細表示
│       │   ├── ArticlesList.tsx          # 記事一覧
│       │   ├── ArticleCard.tsx           # 記事カード
│       │   └── CategorySection.tsx       # カテゴリセクション
│       ├── hooks/                        # Reactフックの層 (Interface Adapters)
│       │   ├── useTopics.ts              # TOPICSデータ取得フック
│       │   └── useArticles.ts            # 記事データ取得フック
│       ├── ports/                        # インターフェース層 (Interface Adapters)
│       │   ├── ITopicsRepository.ts      # リポジトリインターフェース
│       │   └── IArticlesRepository.ts    # 記事リポジトリインターフェース
│       ├── infrastructure/               # インフラ層 (Interface Adapters/Frameworks)
│       │   ├── ApiTopicsRepository.ts    # API実装
│       │   └── ApiArticlesRepository.ts  # 記事API実装
│       └── use-cases/                    # ユースケース層 (Application Business Rules)
│           ├── GetTopicsUseCase.ts       # TOPICSデータ取得ユースケース
│           └── GetArticlesByTopicUseCase.ts # 記事データ取得ユースケース
├── types/                               # エンティティ層 (Enterprise Business Rules)
│   ├── topic.d.ts                       # TOPICS型定義
│   └── article.d.ts                     # 記事型定義
└── libs/
    └── api/
        └── topicsApi.ts                  # API通信ユーティリティ
```

## 実装詳細

### 1. エンティティ層: データモデル定義

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

### 2. インターフェース層: リポジトリインターフェース

```typescript
// features/topics/ports/ITopicsRepository.ts
import { Topic } from "@/types/topic";

export interface GetTopicsParams {
  year?: number;
  page?: number;
  pageSize?: number;
}

export interface GetTopicsResult {
  topics: Topic[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ITopicsRepository {
  getTopics(params: GetTopicsParams): Promise<GetTopicsResult>;
  getTopicById(id: string): Promise<Topic>;
}

// features/topics/ports/IArticlesRepository.ts
import { Article } from "@/types/article";

export interface GetArticlesParams {
  topicId: string;
  categoryId?: string;
}

export interface IArticlesRepository {
  getArticleById(id: string): Promise<Article>;
  getArticlesByTopic(params: GetArticlesParams): Promise<Article[]>;
}
```

### 3. インフラストラクチャ層: リポジトリ実装

```typescript
// features/topics/infrastructure/ApiTopicsRepository.ts
import { topicsApi } from "@/libs/api/topicsApi";
import {
  ITopicsRepository,
  GetTopicsParams,
  GetTopicsResult,
} from "../ports/ITopicsRepository";
import { Topic } from "@/types/topic";

export class ApiTopicsRepository implements ITopicsRepository {
  async getTopics(params: GetTopicsParams): Promise<GetTopicsResult> {
    return await topicsApi.getTopics(params);
  }

  async getTopicById(id: string): Promise<Topic> {
    return await topicsApi.getTopicById(id);
  }
}

// features/topics/infrastructure/ApiArticlesRepository.ts
import { topicsApi } from "@/libs/api/topicsApi";
import {
  IArticlesRepository,
  GetArticlesParams,
} from "../ports/IArticlesRepository";
import { Article } from "@/types/article";

export class ApiArticlesRepository implements IArticlesRepository {
  async getArticleById(id: string): Promise<Article> {
    return await topicsApi.getArticleById(id);
  }

  async getArticlesByTopic(params: GetArticlesParams): Promise<Article[]> {
    return await topicsApi.getArticlesByTopic(
      params.topicId,
      params.categoryId
    );
  }
}
```

### 4. ユースケース層: ビジネスロジック

```typescript
// features/topics/use-cases/GetTopicsUseCase.ts
import {
  ITopicsRepository,
  GetTopicsParams,
  GetTopicsResult,
} from "../ports/ITopicsRepository";

export class GetTopicsUseCase {
  private repository: ITopicsRepository;

  constructor(repository: ITopicsRepository) {
    this.repository = repository;
  }

  async execute(params: GetTopicsParams): Promise<GetTopicsResult> {
    try {
      const response = await this.repository.getTopics(params);

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

// features/topics/use-cases/GetArticlesByTopicUseCase.ts
import {
  IArticlesRepository,
  GetArticlesParams,
} from "../ports/IArticlesRepository";
import { Article } from "@/types/article";

export class GetArticlesByTopicUseCase {
  private repository: IArticlesRepository;

  constructor(repository: IArticlesRepository) {
    this.repository = repository;
  }

  async execute(params: GetArticlesParams): Promise<Article[]> {
    try {
      const articles = await this.repository.getArticlesByTopic(params);

      // ビジネスロジック（例：公開日でソート）
      return articles.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      throw error;
    }
  }
}
```

### 5. フック層: UI と ユースケースの連携

```typescript
// features/topics/hooks/useTopics.ts
import { useMemo } from "react";
import useSWR from "swr";
import { GetTopicsUseCase } from "../use-cases/GetTopicsUseCase";
import { ApiTopicsRepository } from "../infrastructure/ApiTopicsRepository";
import { GetTopicsParams } from "../ports/ITopicsRepository";

interface UseTopicsOptions extends GetTopicsParams {}

export function useTopics(options: UseTopicsOptions = {}) {
  // 依存性注入
  const repository = useMemo(() => new ApiTopicsRepository(), []);
  const getTopicsUseCase = useMemo(
    () => new GetTopicsUseCase(repository),
    [repository]
  );

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

// features/topics/hooks/useArticles.ts
import { useMemo } from "react";
import useSWR from "swr";
import { GetArticlesByTopicUseCase } from "../use-cases/GetArticlesByTopicUseCase";
import { ApiArticlesRepository } from "../infrastructure/ApiArticlesRepository";
import { GetArticlesParams } from "../ports/IArticlesRepository";

interface UseArticlesOptions extends GetArticlesParams {}

export function useArticles({ topicId, categoryId }: UseArticlesOptions) {
  // 依存性注入
  const repository = useMemo(() => new ApiArticlesRepository(), []);
  const getArticlesUseCase = useMemo(
    () => new GetArticlesByTopicUseCase(repository),
    [repository]
  );

  const { data, error } = useSWR(
    topicId ? [`articles-${topicId}`, categoryId] : null,
    () => getArticlesUseCase.execute({ topicId, categoryId }),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    articles: data || [],
    isLoading: !error && !data && !!topicId,
    error,
  };
}
```

### 6. UI 層: ページとコンポーネント

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

// features/topics/components/TopicsFeature.tsx
("use client");

import { useState } from "react";
import { TopicsList } from "./TopicsList";
import { useTopics } from "../hooks/useTopics";
import { YearFilter } from "./YearFilter";
import { ErrorMessage } from "@/components/common/ErrorMessage";

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

### 7. トピックカードコンポーネント

```typescript
// features/topics/components/TopicCard.tsx
import Link from "next/link";
import { Topic } from "@/types/topic";
import { formatDate } from "@/utils/formatDate";

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

### 8. インデックスファイル - 機能のエントリーポイント

```typescript
// features/topics/index.ts
// コンポーネントのエクスポート
export { TopicsFeature } from "./components/TopicsFeature";
export { TopicDetail } from "./components/TopicDetail";
export { ArticleDetail } from "./components/ArticleDetail";

// フックのエクスポート
export { useTopics } from "./hooks/useTopics";
export { useArticles } from "./hooks/useArticles";

// リポジトリのエクスポート（DI用）
export { ApiTopicsRepository } from "./infrastructure/ApiTopicsRepository";
export { ApiArticlesRepository } from "./infrastructure/ApiArticlesRepository";

// インターフェースのエクスポート
export type {
  ITopicsRepository,
  GetTopicsParams,
  GetTopicsResult,
} from "./ports/ITopicsRepository";
export type {
  IArticlesRepository,
  GetArticlesParams,
} from "./ports/IArticlesRepository";
```

## ディレクトリ構造の説明

このプロジェクトはクリーンアーキテクチャに基づいて構造化されています：

1. **エンティティ層**（`/types/`）：

   - ビジネスロジックの中心となるデータモデルを定義
   - どの外部フレームワークにも依存しない

2. **ユースケース層**（`/features/*/use-cases/`）：

   - アプリケーションのビジネスロジックを実装
   - リポジトリインターフェースに依存し、具体的な実装には依存しない

3. **インターフェースアダプター層**：

   - **ポート**（`/features/*/ports/`）：依存性逆転のためのインターフェース定義
   - **リポジトリ実装**（`/features/*/infrastructure/`）：インターフェースの実装
   - **フック**（`/features/*/hooks/`）：ユースケースと UI の橋渡し

4. **フレームワークと外部ツール層**：
   - **UI**（`/features/*/components/`、`/app/`）：ユーザーインターフェース
   - **API 通信**（`/libs/api/`）：外部 API との通信

## テスト計画

### 1. 単体テスト

```typescript
// __tests__/features/topics/use-cases/GetTopicsUseCase.test.ts
describe("GetTopicsUseCase", () => {
  it("should return sorted topics", async () => {
    // モックリポジトリ準備
    const mockRepository: ITopicsRepository = {
      getTopics: jest.fn().mockResolvedValue({
        topics: [
          { id: "1", publishDate: "2025-04-01", title: "4月号" },
          { id: "2", publishDate: "2025-05-01", title: "5月号" },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      }),
      getTopicById: jest.fn(),
    };

    // ユースケースをモックリポジトリで初期化
    const useCase = new GetTopicsUseCase(mockRepository);
    const result = await useCase.execute({ year: 2025 });

    // 5月号が最初にソートされることを確認
    expect(result.topics[0].title).toBe("5月号");
    expect(mockRepository.getTopics).toHaveBeenCalledWith({ year: 2025 });
  });
});
```

### 2. コンポーネントテスト

```typescript
// __tests__/features/topics/components/TopicCard.test.tsx
describe("TopicCard", () => {
  it("should render topic information correctly", () => {
    const mockTopic = {
      id: "1",
      title: "2025年5月号 TOPICS",
      publishDate: "2025-05-01",
      articleCount: 10,
      // ...その他必要なプロパティ
    } as Topic;

    render(<TopicCard topic={mockTopic} />);

    expect(screen.getByText("2025年5月号 TOPICS")).toBeInTheDocument();
    expect(screen.getByText("記事数: 10件")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/topics/1");
  });
});
```

## アクセシビリティ対応

1. **セマンティック HTML**

   - 適切な見出しレベル（h1〜h6）の使用
   - `article`、`section`などの意味的なタグの適切な使用

2. **ARIA サポート**

   - 動的コンテンツには適切な aria-live 属性
   - スクリーンリーダー用の説明文（aria-label）

3. **キーボードナビゲーション**
   - すべての対話要素がキーボード操作可能
   - フォーカス状態の視覚的表示

## まとめ

この TOPICS 配信ページの実装は、クリーンアーキテクチャの原則に従い、以下の利点を持ちます：

1. **テスト容易性** - モックリポジトリを使用した単体テストの実行
2. **依存性の方向性** - 内側の層は外側の層に依存しない
3. **変更への対応力** - データソースの変更（API→ モック →DB）に柔軟に対応可能
4. **関心の分離** - 各層は単一の責任を持つ

これにより、保守性の高い、拡張しやすい実装が実現されます。
