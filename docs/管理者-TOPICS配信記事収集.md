管理者 - TOPICS 配信記事収集ページ実装 README
概要
RSS フィードからの自動収集と手動追加により記事を収集し、LLM による要約・ラベル付けを行う管理画面です。
ファイル構成
frontend/
├── app/
│ └── admin/
│ └── topics/
│ └── collect/
│ └── page.tsx # 記事収集ページ
├── features/
│ └── admin/
│ └── topics/
│ └── collect/
│ ├── index.ts
│ ├── components/
│ │ ├── ArticleCollection.tsx # メインコンポーネント
│ │ ├── RSSCollector.tsx # RSS 収集タブ
│ │ ├── ManualCollector.tsx # 手動追加タブ
│ │ ├── CollectionResults.tsx # 収集結果表示
│ │ ├── ArticlePreview.tsx # 記事プレビュー
│ │ └── LLMProcessModal.tsx # LLM 処理モーダル
│ ├── hooks/
│ │ ├── useRSSCollection.ts # RSS 収集フック
│ │ ├── useArticleSummarize.ts # 要約処理フック
│ │ └── useCollectionHistory.ts # 収集履歴
│ └── use-cases/
│ ├── CollectArticlesFromRSSUseCase.ts
│ ├── AddManualArticleUseCase.ts
│ └── SummarizeArticlesUseCase.ts
├── types/
│ └── articleCollection.d.ts # 収集関連型定義
└── libs/
└── api/
└── collectionApi.ts # 収集 API
実装詳細

1. 型定義 (types/articleCollection.d.ts)
   typescriptexport interface RSSSource {
   id: string;
   name: string;
   url: string;
   category: string;
   isActive: boolean;
   }

export interface CollectionConfig {
startDate: string;
endDate: string;
sources: string[];
keywords?: string[];
}

export interface CollectedArticle {
id: string;
title: string;
source: string;
sourceUrl: string;
publishedAt: string;
originalUrl: string;
content: string;
status: 'collected' | 'summarized' | 'error';
summary?: string;
labels?: string[];
thumbnailUrl?: string;
error?: string;
}

export interface CollectionResult {
sessionId: string;
totalArticles: number;
successCount: number;
errorCount: number;
articles: CollectedArticle[];
startedAt: string;
completedAt?: string;
}

export interface LLMProcessingConfig {
model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3';
temperature: number;
maxTokens: number;
customPrompt?: string;
} 2. メインコンポーネント
typescript// features/admin/topics/collect/components/ArticleCollection.tsx
'use client';

import { useState } from 'react';
import { RSSCollector } from './RSSCollector';
import { ManualCollector } from './ManualCollector';
import { CollectionResults } from './CollectionResults';
import { TabNavigation } from '@/components/ui/TabNavigation';

export function ArticleCollection() {
const [activeTab, setActiveTab] = useState<'rss' | 'manual'>('rss');
const [currentSession, setCurrentSession] = useState<CollectionResult | null>(null);

const tabs = [
{ id: 'rss', label: 'RSS 収集', icon: 'Rss' },
{ id: 'manual', label: '手動追加', icon: 'Plus' },
];

return (
<div className="min-h-screen bg-gray-900 py-8 px-4">
<div className="max-w-7xl mx-auto">
<div className="admin-content-card p-6">
<h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
TOPICS 配信 - 記事収集
</h1>

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-6">
            {activeTab === 'rss' ? (
              <RSSCollector onCollectionComplete={setCurrentSession} />
            ) : (
              <ManualCollector onArticleAdded={setCurrentSession} />
            )}
          </div>

          {currentSession && (
            <div className="mt-8">
              <CollectionResults
                session={currentSession}
                onUpdate={setCurrentSession}
              />
            </div>
          )}
        </div>
      </div>
    </div>

);
} 3. RSS 収集コンポーネント
