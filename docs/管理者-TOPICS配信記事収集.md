## サイトマップ

└─ TOPICS 配信 管理 (/admin/topics)
├─ TOPICSカード一覧ビュー
│ ├─ ヘッダー
│ │ ├─ タイトル「TOPICS配信管理」
│ │ ├─ 合計TOPICS件数表示
│ │ └─ 「新規TOPICS作成」ボタン
│ ├─ 検索フィールド
│ ├─ TOPICSカード一覧
│ │ ├─ カードごとの表示内容
│ │ │ ├─ タイトル
│ │ │ ├─ サマリ
│ │ │ ├─ 公開日
│ │ │ ├─ 記事数
│ │ │ ├─ カテゴリタグ
│ │ │ └─ アクションボタン（編集、記事収集、削除）
│ │ └─ レスポンシブグリッド（小画面:1列、中画面:2列、大画面:3列）
│ └─ ページネーション
│
├─ 個別TOPICS編集ビュー (/admin/topics/[id])
│ ├─ ヘッダー
│ │ ├─ タイトル「TOPICS編集」
│ │ └─ 「一覧へ戻る」ボタン
│ ├─ 基本情報編集
│ │ ├─ タイトル入力フィールド
│ │ ├─ 公開日設定
│ │ └─ サマリ入力（マークダウン対応エディタ）
│ ├─ タブナビゲーション
│ │ ├─ タブ1: 記事選択
│ │ │ ├─ 左側パネル: 記事DB
│ │ │ │ ├─ 検索・フィルター機能
│ │ │ │ ├─ 記事カード表示
│ │ │ │ └─ 記事選択ボタン
│ │ │ └─ 右側パネル: 選択済み記事
│ │ │   ├─ 並べ替え機能
│ │ │   ├─ 選択解除ボタン
│ │ │   └─ カテゴリ割り当て
│ │ ├─ タブ2: カテゴリ設定
│ │ │ ├─ カテゴリの追加・編集・削除
│ │ │ ├─ カテゴリの並び替え
│ │ │ └─ 記事のカテゴリ分類
│ │ └─ タブ3: プレビュー
│ │   ├─ HTML形式プレビュー表示
│ │   ├─ PDFエクスポートボタン
│ │   └─ HTMLコード表示/コピー機能
│ └─ 保存・公開ボタン
│
└─ 新規TOPICS作成ビュー (/admin/topics/create)
  ├─ ヘッダー
  │ ├─ タイトル「新規TOPICS作成」
  │ └─ 「一覧へ戻る」ボタン
  └─ 以下、編集ビューと同様の構成

---

## 設計と実装詳細

### 1. コンポーネント構成 (特徴的な実装)

#### カード一覧ビュー
- レスポンシブデザイン
  - モバイル: 1列表示
  - タブレット: 2列表示
  - デスクトップ: 3列表示
- ダークモード対応
- 国際化対応 (i18n)
- ページネーション機能
- 検索機能

#### TOPICS編集画面
- タブ型ナビゲーション
- ドラッグアンドドロップでの記事並び替え
- リアルタイムプレビュー
- マークダウン対応サマリーエディタ
- レスポンシブな2カラムレイアウト

### 2. クリーンアーキテクチャ実装

以下の層に分割して実装:

#### A. エンティティ層
- `/src/types/topic.d.ts` - TOPICの基本データモデル定義

#### B. ユースケース層
- `/src/features/admin/topics/use-cases/TopicsUseCases.ts`
  - `GetTopicsUseCase`
  - `GetTopicByIdUseCase`
  - `CreateTopicUseCase`
  - `UpdateTopicUseCase`
  - `DeleteTopicUseCase`

#### C. インターフェースアダプター層
- `/src/features/admin/topics/ports/ITopicsRepository.ts` - リポジトリインターフェース
- `/src/features/admin/topics/hooks/useTopics.ts` - UIとユースケースの連携

#### D. フレームワーク・ドライバー層
- `/src/features/admin/topics/infrastructure/ApiTopicsRepository.ts` - APIアクセス実装
- `/src/features/admin/topics/components/` - UIコンポーネント
  - `TopicsAdminClient.tsx` - メインクライアントコンポーネント
  - `TopicCard.tsx` - 個別TOPICカードコンポーネント

#### E. 依存性注入
- `index.ts` エクスポートファイルでの依存関係の露出
- フックによる依存性の簡易注入パターン

### 3. 主要コンポーネント設計

#### TopicsAdminClient
- 全体のコンテナコンポーネント
- TOPICS一覧表示、検索、ページネーション機能
- 削除確認モーダル

#### TopicCard
- 個別TOPICの表示
- 編集・記事収集・削除のアクション

#### TopicEditor (計画中)
- タブ型UI
- 記事選択・カテゴリ設定・プレビュー機能

### 4. 状態管理

- React Hooksを利用したローカル状態管理
  - 検索状態
  - ページネーション状態
  - ローディング状態
  - エラー状態

### 5. 国際化 (i18n) 対応

- `useI18n` フックによる翻訳機能
- 日英両言語対応
- 翻訳キー管理:
  - `admin.topics.*` - 管理者TOPICS関連翻訳
  - `common.*` - 共通部品の翻訳

### 6. テーマ対応

- ダークモード/ライトモード対応
- CSS変数による配色管理:
  - `--color-background` - 背景色
  - `--color-foreground` - 文字色
  - `--color-card` - カード背景色
  - など
