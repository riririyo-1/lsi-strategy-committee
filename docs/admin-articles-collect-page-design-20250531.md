# 管理者記事収集ページ設計ドキュメント (2025 年 5 月 31 日)

## 1. 概要

管理者向けの記事収集ページは、以下の 2 つの主要機能を提供します：

1. **RSS 収集**: RSS フィードから記事を自動的に収集し、LLM で要約・ラベル付けを行います
2. **手動追加**: 管理者が個別の記事を手動で追加し、同様に LLM で処理を行います

このページは、記事収集のワークフローを効率化し、コンテンツ管理を容易にすることを目的としています。

## 2. アーキテクチャ

### 2.1 フロントエンド構成

フロントエンドは、Next.js の App Router を使用し、React Components で構築されます。

```
/app/admin/articles/collect/
  ├── page.tsx                     # メインページコンポーネント
  └── loading.tsx                  # ローディング表示用コンポーネント
```

```
/features/admin/articles/collect/
  ├── components/
  │   ├── ArticleCollectionTabs.tsx         # タブコンポーネント（RSS収集/手動追加）
  │   ├── RssCollectionForm.tsx             # RSS収集フォーム
  │   ├── ManualArticleForm.tsx             # 手動記事追加フォーム
  │   └── CollectedArticlesTable.tsx        # 収集済み記事一覧表
  ├── hooks/
  │   ├── useRssCollection.ts               # RSS収集のロジック
  │   ├── useManualArticleAddition.ts       # 手動記事追加のロジック
  │   └── useCollectedArticles.ts           # 収集済み記事管理のロジック
  ├── infrastructure/
  │   └── ArticleCollectionApiClient.ts     # API通信クライアント
  ├── ports/
  │   └── IArticleCollectionRepository.ts   # リポジトリインターフェース
  └── types/
      └── articleCollection.d.ts            # 型定義
```

### 2.2 バックエンド構成 (Python)

バックエンドは、Python を使用して src/pipeline ディレクトリに実装します。

```
/src/pipeline/
  ├── collectors/
  │   ├── rss_collector.py                  # RSSフィードからの記事収集
  │   └── manual_collector.py               # 手動追加記事の処理
  ├── processors/
  │   ├── llm_processor.py                  # LLMによる要約・ラベル付け
  │   └── content_extractor.py              # 記事本文抽出
  ├── repositories/
  │   └── article_repository.py             # 記事データの保存・取得
  ├── api/
  │   └── article_collection_api.py         # API エンドポイント定義
  └── utils/
      ├── date_utils.py                     # 日付処理ユーティリティ
      └── logger.py                         # ログ処理
```

### 2.3 API エンドポイント

以下の API エンドポイントを定義します：

```
POST /api/articles/collect/rss          # RSSフィードからの記事収集
POST /api/articles/collect/manual       # 手動での記事追加
POST /api/articles/summarize            # 記事の要約・ラベル付け
GET  /api/articles/collected            # 収集済み記事の取得
DELETE /api/articles/{id}               # 記事の削除
```

## 3. データモデル

### 3.1 記事収集リクエスト (RSS)

```typescript
interface RssCollectionRequest {
  startDate: string; // YYYY-MM-DD形式
  endDate: string; // YYYY-MM-DD形式
  sources: string[]; // 選択されたソース (例: ["EE Times", "IT media", "NHK", "マイナビ"])
  processingOptions?: {
    summarize: boolean; // 要約を生成するかどうか
    labelArticles: boolean; // ラベル付けを行うかどうか
  };
}
```

### 3.2 記事収集リクエスト (手動)

```typescript
interface ManualArticleRequest {
  title: string; // 記事タイトル
  url: string; // 記事URL
  publishedAt?: string; // 公開日 (YYYY-MM-DD形式、任意)
  source?: string; // 出典元 (任意)
  processingOptions?: {
    summarize: boolean; // 要約を生成するかどうか
    labelArticles: boolean; // ラベル付けを行うかどうか
  };
}
```

### 3.3 収集済み記事

```typescript
interface CollectedArticle {
  id: string; // 記事ID
  title: string; // 記事タイトル
  source: string; // 出典元
  publishedAt: string; // 公開日
  summary?: string; // 要約 (LLM生成)
  labels?: string[]; // ラベル (LLM生成)
  url: string; // 記事URL
  thumbnailUrl?: string; // サムネイルURL (あれば)
  createdAt: string; // 収集日時
  updatedAt: string; // 最終更新日時
  status: "pending" | "processed" | "failed"; // 処理ステータス
}
```

## 4. コンポーネント設計

### 4.1 ArticleCollectionTabs.tsx

記事収集方法を選択するためのタブコンポーネント。

- `tabs`: "RSS 収集" と "手動追加" の 2 つのタブ
- タブ切り替え時の状態管理

### 4.2 RssCollectionForm.tsx

RSS フィードから記事を収集するためのフォーム。

- 日付範囲選択（開始日・終了日）
- ソース選択（チェックボックス）
  - EE Times
  - IT Media
  - NHK
  - マイナビ
- 記事収集ボタン
- 要約・ラベル付け（LLM 実行）ボタン
- 進行状況インジケーター

### 4.3 ManualArticleForm.tsx

手動で記事を追加するためのフォーム。

- タイトル入力フィールド
- URL 入力フィールド
- 公開日選択（オプション）
- 出典元入力フィールド（オプション）
- 追加ボタン
- 要約・ラベル付け（LLM 実行）ボタン

### 4.4 CollectedArticlesTable.tsx

収集済みの記事を表示するテーブル。

- 記事一覧（ページネーション付き）
  - タイトル
  - 出典元
  - 公開日
  - 収集日
  - 処理ステータス
  - アクション（削除、詳細表示）
- フィルタリング・ソート機能
- 選択した記事の一括処理

## 5. バックエンド処理フロー

### 5.1 RSS 収集フロー

1. フロントエンドから収集リクエストを受信
2. 指定されたソースの RSS フィードを取得
3. 日付範囲でフィルタリング
4. 記事情報を抽出（タイトル、URL、公開日など）
5. すでに収集済みの記事を除外
6. データベースに保存
7. LLM 処理（要約・ラベル付け）をリクエストに応じて実行
8. 処理結果をフロントエンドに返却

### 5.2 手動追加フロー

1. フロントエンドから記事情報を受信
2. URL からコンテンツ抽出
3. メタデータ補完（公開日や出典元が未指定の場合）
4. データベースに保存
5. LLM 処理（要約・ラベル付け）をリクエストに応じて実行
6. 処理結果をフロントエンドに返却

### 5.3 LLM 処理フロー

1. 記事本文を抽出
2. LLM に要約生成をリクエスト
3. LLM にラベル付けをリクエスト
4. 結果をデータベースに保存
5. 処理ステータスを更新

## 6. エラーハンドリング

- RSS 取得失敗時の再試行メカニズム
- URL 無効時のエラー表示
- LLM 処理タイムアウト対策
- 部分的に処理が成功した場合の結果保存

## 7. セキュリティ考慮事項

- 外部 URL アクセス時の HTTP リクエスト検証
- API エンドポイントの認証・認可
- 入力値のサニタイズ
- レート制限の設定

## 8. 実装手順

1. フロントエンドコンポーネントの作成

   - page.tsx の実装
   - 各 UI コンポーネントの実装
   - API クライアントの実装

2. Python バックエンドの実装

   - RSS コレクターの実装
   - コンテンツ抽出処理の実装
   - LLM プロセッサーの実装
   - リポジトリ層の実装
   - API エンドポイントの実装

3. テスト

   - 各コンポーネントの単体テスト
   - エンドツーエンドテスト

4. デプロイ
   - 環境変数の設定
   - サーバーへのデプロイ
   - 動作確認

## 9. 今後の拡張性

- 追加のソース対応
- 高度なフィルタリングオプション
- スケジュール収集
- 記事の重複検出アルゴリズム改善
