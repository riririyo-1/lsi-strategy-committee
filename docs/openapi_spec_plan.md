# OpenAPI 仕様（雛形案）

## 基本情報

```yaml
openapi: 3.0.3
info:
  title: LSI Strategie API
  version: 1.0.0
  description: |
    LSI StrategieのAPI仕様（設計段階の雛形）
servers:
  - url: http://localhost:3000
tags:
  - name: System
    description: システム確認・稼働状態
  - name: Articles
    description: 記事取得・削除API
  - name: Batch
    description: 要約・収集のバッチAPI
  - name: Topics
    description: TOPICS配信関連API
```

## パス定義（概要のみ）

```yaml
paths:
  /api/health:
    get:
      tags: [System]
      summary: ヘルスチェック
      description: サーバーの稼働状態を確認する

  /api/articles:
    get:
      tags: [Articles]
      summary: 記事一覧を取得
      description: 記事のリストを取得する
    delete:
      tags: [Articles]
      summary: 複数IDの記事を一括削除
      description: 指定したIDの記事を一括削除する

  /api/articles/{id}:
    get:
      tags: [Articles]
      summary: 単一記事を取得
      description: 指定IDの記事を取得する
    delete:
      tags: [Articles]
      summary: 単一記事削除
      description: 指定IDの記事を削除する

  /api/articles/labels:
    get:
      tags: [Articles]
      summary: 全記事のラベル一覧を取得
      description: 全記事のラベル一覧を取得する

  /api/summarize:
    post:
      tags: [Batch]
      summary: 記事要約・ラベル付けバッチ
      description: 記事の要約・ラベル付けをバッチで実行

  /api/crawl:
    post:
      tags: [Batch]
      summary: 記事収集バッチ
      description: 記事収集をバッチで実行

  /api/topics:
    get:
      tags: [Topics]
      summary: TOPICS一覧取得
      description: TOPICSのリストを取得
    post:
      tags: [Topics]
      summary: 新規TOPICS作成
      description: 新しいTOPICSを作成

  /api/topics/{id}:
    get:
      tags: [Topics]
      summary: 特定のTOPICS取得
      description: 指定IDのTOPICSを取得
    put:
      tags: [Topics]
      summary: TOPICS更新
      description: 指定IDのTOPICSを更新

  /api/topics/{id}/article/{article_id}/category:
    patch:
      tags: [Topics]
      summary: 記事ごとのカテゴリ編集
      description: 記事ごとのカテゴリを編集

  /api/topics/{id}/article/{article_id}/categorize:
    post:
      tags: [Topics]
      summary: 記事カテゴリの自動分類
      description: 記事カテゴリを自動分類

  /api/topics/{id}/categorize:
    post:
      tags: [Topics]
      summary: LLM自動分類
      description: LLMによる自動分類

  /api/topics/{id}/export:
    post:
      tags: [Topics]
      summary: 配信テンプレートHTML出力
      description: 配信テンプレートHTMLを出力

  /api/topics/{id}/summary:
    post:
      tags: [Topics]
      summary: 月次まとめ自動生成
      description: 月次まとめを自動生成
```

---

この内容で `/docs/openapi.yaml` を作成してよいかご確認ください。
