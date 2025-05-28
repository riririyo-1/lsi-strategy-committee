ステップ 1: 環境構築と基本設定
依存パッケージのインストール

@prisma/client と prisma のインストール
必要な環境変数の設定
Docker 環境構築

docker-compose.yml の作成
PostgreSQL コンテナの実行
Prisma の初期設定

スキーマ定義（schema.prisma）
Prisma クライアントの初期化（client.ts）
ステップ 2: データモデル実装
Prisma スキーマの設定

TrendReport モデルの定義
Agenda モデルの定義
リレーションの設定
マイグレーションの実行

初回マイグレーション作成と実行
シードデータの設定と投入
ステップ 3: リポジトリ層実装
リポジトリインターフェースの定義

ITrendReportRepository の実装
Prisma ベースのリポジトリ実装

TrendReportRepository の実装
CRUD 操作のメソッド実装
ステップ 4: ユースケース実装
基本ユースケースの実装
ListTrendReports
GetTrendReport
CreateTrendReport
UpdateTrendReport
DeleteTrendReport
ステップ 5: API ルート実装
API エンドポイント実装
trend-reports ルートの実装
trend-reports/[id] ルートの実装
ステップ 6: フロントエンド更新
サービスクラスの更新
ResearchReportService の更新
ローカルストレージから API 呼び出しへの移行
ステップ 7: ファイルアップロード機能
アップロード API の実装

upload ルートの実装
ファイル保存処理の実装
アップロードコンポーネント実装

FileUploader コンポーネントの作成
フォームとの連携
ステップ 8: テストと動作確認
ユニットテスト実装

リポジトリのテスト
ユースケースのテスト
E2E テスト実装と動作確認

レポートの CRUD 操作
ファイルアップロード機能
