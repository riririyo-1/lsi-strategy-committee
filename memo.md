# memo.md

## メモ

### 環境構築

node セットアップ

```shell
npm install
cp .env.example .env
docker compose up -d
```

db セットアップ

```shell
npx prisma migrate deploy
# または
npx prisma migrate dev     # 開発環境用（新しいマイグレーションも作成）
npx prisma db seed   # 初期データ投入（必要な場合）
```

立上げ

```shell
npm run dev
```

### 完成後にしたいこと

- [ ] メンバー紹介欄の作成
- [ ] ファブのキャパシティ推測などの管理
- [ ] ログの収集
