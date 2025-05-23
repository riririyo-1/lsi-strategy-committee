# LSI 戦略コミッティ - 全体設計 README

## プロジェクト概要

LSI 戦略コミッティは、半導体業界の動向調査、TOPICS 配信、分析データを提供する Web アプリケーションです。Clean Architecture の原則に基づき、モダンな TypeScript/Next.js 環境で構築されます。

## 技術スタック

### フロントエンド

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (any 禁止)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: SWR / React Query
- **i18n**: next-i18next
- **Theme**: next-themes (ダークモード対応)
- **UI Components**: shadcn/ui

### バックエンド

- **Runtime**: Node.js 20+
- **Framework**: Express / Fastify
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod / Joi

### インフラ

- **Container**: Docker & Docker Compose
- **Pipeline**: Python (データ収集・要約処理)

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  Next.js Pages / Components / Styles                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  Features / Use Cases / Business Logic                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  Entities / Domain Services / Repository Interfaces         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
│  API Clients / Database / External Services                 │
└─────────────────────────────────────────────────────────────┘
```

## 主要機能

### 公開ページ

1. **ホーム** - ウェルカムページ、サービス概要
2. **動向調査** - 半導体業界レポート一覧・詳細表示
3. **TOPICS 配信** - 月次トピックス一覧・詳細表示
4. **分析** - アクセス統計、注目キーワード表示
5. **お問い合わせ** - アクセス権申請、問い合わせフォーム

### 管理者ページ

1. **動向調査管理** - レポートの CRUD 操作
2. **TOPICS 配信管理**
   - 記事収集 (RSS/手動)
   - 記事一覧管理
   - TOPICS 作成・編集

## API 設計概要

### Articles API

- `GET /api/articles` - 記事一覧取得
- `GET /api/articles/{id}` - 記事詳細取得
- `POST /api/articles` - 記事作成
- `PUT /api/articles/{id}` - 記事更新
- `DELETE /api/articles/{id}` - 記事削除

### Topics API

- `GET /api/topics` - TOPICS 一覧取得
- `GET /api/topics/{id}` - TOPICS 詳細取得
- `POST /api/topics` - TOPICS 作成
- `PUT /api/topics/{id}` - TOPICS 更新
- `DELETE /api/topics/{id}` - TOPICS 削除

### Trend Reports API

- `GET /api/trend-reports` - レポート一覧取得
- `GET /api/trend-reports/{id}` - レポート詳細取得
- `POST /api/trend-reports` - レポート作成
- `PUT /api/trend-reports/{id}` - レポート更新
- `DELETE /api/trend-reports/{id}` - レポート削除

### Batch API

- `POST /api/crawl` - RSS 記事収集
- `POST /api/summarize` - 記事要約・ラベル付け

## データモデル

### Article

```typescript
interface Article {
  id: string;
  title: string;
  source: string;
  publishedAt: Date;
  summary: string;
  labels: string[];
  thumbnailUrl?: string;
  articleUrl: string;
  fullText?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Topic

```typescript
interface Topic {
  id: string;
  title: string;
  publishDate: Date;
  summary: string;
  categories: TopicCategory[];
  createdAt: Date;
  updatedAt: Date;
}

interface TopicCategory {
  id: string;
  name: string;
  topicId: string;
  articles: TopicArticle[];
}
```

### TrendReport

```typescript
interface TrendReport {
  id: string;
  title: string;
  speaker: string;
  department: string;
  agenda: string[];
  videoUrl: string;
  posterUrl?: string;
  pdfUrl?: string;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## セキュリティ要件

1. **認証・認可**

   - JWT token による認証
   - Role-based access control (RBAC)
   - 管理者ページへのアクセス制限

2. **データ保護**

   - HTTPS 通信の強制
   - SQL インジェクション対策
   - XSS 対策
   - CSRF 対策

3. **環境変数管理**
   - `.env`ファイルによる機密情報管理
   - 環境別設定の分離

## 開発ガイドライン

### コーディング規約

1. TypeScript の`any`型は使用禁止
2. 全ての関数・変数に適切な型定義を付与
3. ESLint/Prettier によるコード整形
4. コンポーネントは単一責任の原則に従う

### Git 運用

1. Feature branch workflow
2. Pull Request 必須
3. Code review を経てマージ
4. Semantic versioning に従う

### テスト戦略

1. Unit tests (Jest)
2. Integration tests
3. E2E tests (Playwright/Cypress)
4. 最低 80%のカバレッジ目標

## 環境構築手順

```bash
# リポジトリのクローン
git clone <repository-url>
cd lsi-strategy-committee

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集

# Dockerコンテナの起動
docker-compose up -d

# データベースマイグレーション
npm run db:migrate

# 開発サーバーの起動
npm run dev
```

## デプロイメント

### 本番環境

```bash
# ビルド
npm run build

# 本番サーバー起動
npm run start
```

### Docker

```bash
# イメージビルド
docker-compose build

# コンテナ起動
docker-compose up -d
```

## 監視・ログ

1. **アプリケーションログ**

   - Winston/Pino による構造化ログ
   - ログレベル別出力

2. **パフォーマンス監視**

   - Core Web Vitals
   - API response time
   - Error rate monitoring

3. **アラート**
   - エラー率閾値超過時の通知
   - システムリソース監視
