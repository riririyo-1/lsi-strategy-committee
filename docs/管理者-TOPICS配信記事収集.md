## サイトマップ

└─ TOPICS 配信 管理 (/admin/topics)
├─ TOPICS カード一覧ビュー
│ ├─ ヘッダー
│ │ ├─ タイトル「TOPICS 配信管理」
│ │ ├─ 合計 TOPICS 件数表示
│ │ └─ 「新規 TOPICS 作成」ボタン
│ ├─ 検索フィールド
│ ├─ TOPICS カード一覧
│ │ ├─ カードごとの表示内容
│ │ │ ├─ タイトル
│ │ │ ├─ サマリ
│ │ │ ├─ 公開日
│ │ │ ├─ 記事数
│ │ │ ├─ カテゴリタグ
│ │ │ └─ アクションボタン（編集、記事収集、削除）
│ │ └─ レスポンシブグリッド（小画面:1 列、中画面:2 列、大画面:3 列）
│ └─ ページネーション
│
├─ 個別 TOPICS 編集ビュー (/admin/topics/[id])
│ ├─ ヘッダー
│ │ ├─ タイトル「TOPICS 編集」
│ │ └─ 「一覧へ戻る」ボタン
│ ├─ 基本情報編集
│ │ ├─ タイトル入力フィールド
│ │ ├─ 公開日設定
│ │ └─ サマリ入力（マークダウン対応エディタ）
│ ├─ タブナビゲーション
│ │ ├─ タブ 1: 記事選択
│ │ │ ├─ 左側パネル: 記事 DB
│ │ │ │ ├─ 検索・フィルター機能
│ │ │ │ ├─ 記事カード表示
│ │ │ │ └─ 記事選択ボタン
│ │ │ └─ 右側パネル: 選択済み記事
│ │ │ ├─ 並べ替え機能
│ │ │ ├─ 選択解除ボタン
│ │ │ └─ カテゴリ割り当て
│ │ ├─ タブ 2: カテゴリ設定
│ │ │ ├─ カテゴリの追加・編集・削除
│ │ │ ├─ カテゴリの並び替え
│ │ │ └─ 記事のカテゴリ分類
│ │ └─ タブ 3: プレビュー
│ │ ├─ HTML 形式プレビュー表示
│ │ ├─ PDF エクスポートボタン
│ │ └─ HTML コード表示/コピー機能
│ └─ 保存・公開ボタン
│
└─ 新規 TOPICS 作成ビュー (/admin/topics/create)
├─ ヘッダー
│ ├─ タイトル「新規 TOPICS 作成」
│ └─ 「一覧へ戻る」ボタン
└─ 以下、編集ビューと同様の構成

---

## 設計と実装詳細

### 1. コンポーネント構成 (特徴的な実装)

#### カード一覧ビュー

- レスポンシブデザイン
  - モバイル: 1 列表示
  - タブレット: 2 列表示
  - デスクトップ: 3 列表示
- ダークモード対応
- 国際化対応 (i18n)
- ページネーション機能
- 検索機能

#### TOPICS 編集画面

- タブ型ナビゲーション
- ドラッグアンドドロップでの記事並び替え
- リアルタイムプレビュー
- マークダウン対応サマリーエディタ
- レスポンシブな 2 カラムレイアウト

### 2. クリーンアーキテクチャ実装

以下の層に分割して実装:

#### A. エンティティ層

- `/src/types/topic.d.ts` - TOPIC の基本データモデル定義

#### B. ユースケース層

- `/src/features/admin/topics/use-cases/TopicsUseCases.ts`
  - `GetTopicsUseCase`
  - `GetTopicByIdUseCase`
  - `CreateTopicUseCase`
  - `UpdateTopicUseCase`
  - `DeleteTopicUseCase`

#### C. インターフェースアダプター層

- `/src/features/admin/topics/ports/ITopicsRepository.ts` - リポジトリインターフェース
- `/src/features/admin/topics/hooks/useTopics.ts` - UI とユースケースの連携

#### D. フレームワーク・ドライバー層

- `/src/features/admin/topics/infrastructure/ApiTopicsRepository.ts` - API アクセス実装
- `/src/features/admin/topics/components/` - UI コンポーネント
  - `TopicsAdminClient.tsx` - メインクライアントコンポーネント
  - `TopicCard.tsx` - 個別 TOPIC カードコンポーネント

#### E. 依存性注入

- `index.ts` エクスポートファイルでの依存関係の露出
- フックによる依存性の簡易注入パターン

### 3. 主要コンポーネント設計

#### TopicsAdminClient

- 全体のコンテナコンポーネント
- TOPICS 一覧表示、検索、ページネーション機能
- 削除確認モーダル

#### TopicCard

- 個別 TOPIC の表示
- 編集・記事収集・削除のアクション

#### TopicEditor (計画中)

- タブ型 UI
- 記事選択・カテゴリ設定・プレビュー機能

### 4. 状態管理

- React Hooks を利用したローカル状態管理
  - 検索状態
  - ページネーション状態
  - ローディング状態
  - エラー状態

### 5. 国際化 (i18n) 対応

- `useI18n` フックによる翻訳機能
- 日英両言語対応
- 翻訳キー管理:
  - `admin.topics.*` - 管理者 TOPICS 関連翻訳
  - `common.*` - 共通部品の翻訳

### 6. テーマ対応

- ダークモード/ライトモード対応
- CSS 変数による配色管理:
  - `--color-background` - 背景色
  - `--color-foreground` - 文字色
  - `--color-card` - カード背景色
  - など
