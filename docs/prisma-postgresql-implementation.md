# Prisma + PostgreSQL を使った動向調査レポート機能の実装設計書

## 1. 概要

このドキュメントは、LSI 戦略サイトにおける「動向調査レポート」機能をローカルストレージベースの仮実装から PostgreSQL データベースを使用した本格的な実装に移行するための設計書です。Prisma ORM を採用し、Next.js アプリケーションからデータベースへの安全かつ型安全なアクセスを実現します。

## 2. 技術スタック

- **データベース**: PostgreSQL
- **ORM**: Prisma
- **アプリケーション**: Next.js
- **認証**: NextAuth.js（管理者ユーザー認証用）

## 3. データモデル定義

### 3.1. 動向調査レポート (TrendReport)

```prisma
model TrendReport {
  id          String    @id @default(uuid())
  title       String
  summary     String    @db.Text
  content     String?   @db.Text
  publishDate DateTime
  videoUrl    String?
  posterUrl   String?
  pdfUrl      String?
  speaker     String?
  department  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  agendaItems Agenda[]
}

model Agenda {
  id            String      @id @default(uuid())
  content       String
  order         Int
  trendReport   TrendReport @relation(fields: [trendReportId], references: [id], onDelete: Cascade)
  trendReportId String
}
```

## 4. ディレクトリ構造

現在のプロジェクト構造を拡張して、以下のディレクトリ・ファイルを追加します：

```
/prisma
  schema.prisma     # Prismaスキーマ定義
  migrations/       # マイグレーションファイル
  seed.ts           # 初期データ投入用スクリプト

/src
  /libs
    /prisma
      client.ts     # Prismaクライアント初期化

  /features
    /admin
      /research
        /infrastructure
          TrendReportRepository.ts  # Prismaを使用したリポジトリ実装
        /ports
          ITrendReportRepository.ts # リポジトリのインターフェース
        /use-cases
          CreateTrendReport.ts      # ユースケース実装
          UpdateTrendReport.ts
          DeleteTrendReport.ts
          GetTrendReport.ts
          ListTrendReports.ts
```

## 5. 実装ステップ

### 5.1. 依存パッケージのインストール

```bash
npm install @prisma/client
npm install -D prisma
```

### 5.2. Prisma の初期設定

```bash
npx prisma init
```

### 5.3. PostgreSQL のセットアップ

1. Docker Compose ファイルの作成 (`docker-compose.yml`)

```yaml
version: "3"
services:
  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: lsi_strategy
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. 環境変数の設定 (`.env`)

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lsi_strategy?schema=public"
```

### 5.4. Prisma スキーマの定義

`prisma/schema.prisma` ファイルに上記のデータモデルを定義します。

### 5.5. マイグレーション実行

```bash
npx prisma migrate dev --name init
```

### 5.6. シードデータの作成

既存のダミーデータをシードデータとして使用します。

`prisma/seed.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 既存のダミーデータを投入
  const reports = [
    {
      title: "SS事業部向け講演会: 次世代半導体とLSI戦略",
      summary:
        "シリコンカーバイド(SiC)、窒化ガリウム(GaN)などの次世代材料に関する最新の研究開発動向と市場予測を解説します。",
      publishDate: new Date("2025-05-20"),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      posterUrl: "https://placehold.co/1280x720/111827/ffffff?text=動画1",
      pdfUrl: "dummy_pdf_url_1.pdf",
      speaker: "山田 太郎",
      department: "先端技術研究部",
      agendaItems: {
        create: [
          { content: "半導体業界の最新動向とメガトレンド", order: 0 },
          { content: "次世代半導体材料(SiC, GaN)の可能性と課題", order: 1 },
          { content: "AIチップ設計におけるチップレット技術の重要性", order: 2 },
          { content: "当社のLSI戦略と今後の研究開発ロードマップ", order: 3 },
          { content: "質疑応答", order: 4 },
        ],
      },
    },
    // 他のダミーデータも同様に追加
  ];

  for (const report of reports) {
    await prisma.trendReport.create({
      data: report,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 6. クライアント・サイド実装

### 6.1. Prisma クライアント初期化

`src/libs/prisma/client.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 6.2. リポジトリインターフェース

`src/features/admin/research/ports/ITrendReportRepository.ts`

```typescript
import { TrendReport } from "@/types/trendReport";

export interface ITrendReportRepository {
  findAll(): Promise<TrendReport[]>;
  findById(id: string): Promise<TrendReport | null>;
  create(data: Omit<TrendReport, "id">): Promise<TrendReport>;
  update(id: string, data: Omit<TrendReport, "id">): Promise<TrendReport>;
  delete(id: string): Promise<void>;
}
```

### 6.3. リポジトリ実装

`src/features/admin/research/infrastructure/TrendReportRepository.ts`

```typescript
import { prisma } from "@/libs/prisma/client";
import type { TrendReport } from "@/types/trendReport";
import { ITrendReportRepository } from "../ports/ITrendReportRepository";

export class TrendReportRepository implements ITrendReportRepository {
  async findAll(): Promise<TrendReport[]> {
    const reports = await prisma.trendReport.findMany({
      include: {
        agendaItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return reports.map((report) => ({
      id: report.id,
      title: report.title,
      summary: report.summary,
      publishDate: report.publishDate.toISOString(),
      content: report.content || undefined,
      videoUrl: report.videoUrl || undefined,
      posterUrl: report.posterUrl || undefined,
      pdfUrl: report.pdfUrl || undefined,
      speaker: report.speaker || undefined,
      department: report.department || undefined,
      agenda: report.agendaItems.map((item) => item.content),
    }));
  }

  async findById(id: string): Promise<TrendReport | null> {
    const report = await prisma.trendReport.findUnique({
      where: { id },
      include: {
        agendaItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!report) {
      return null;
    }

    return {
      id: report.id,
      title: report.title,
      summary: report.summary,
      publishDate: report.publishDate.toISOString(),
      content: report.content || undefined,
      videoUrl: report.videoUrl || undefined,
      posterUrl: report.posterUrl || undefined,
      pdfUrl: report.pdfUrl || undefined,
      speaker: report.speaker || undefined,
      department: report.department || undefined,
      agenda: report.agendaItems.map((item) => item.content),
    };
  }

  async create(data: Omit<TrendReport, "id">): Promise<TrendReport> {
    const { agenda, ...reportData } = data;

    const agendaItems =
      agenda?.map((item, index) => ({
        content: item,
        order: index,
      })) || [];

    const createdReport = await prisma.trendReport.create({
      data: {
        ...reportData,
        publishDate: new Date(reportData.publishDate),
        agendaItems: {
          create: agendaItems,
        },
      },
      include: {
        agendaItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return {
      id: createdReport.id,
      title: createdReport.title,
      summary: createdReport.summary,
      publishDate: createdReport.publishDate.toISOString(),
      content: createdReport.content || undefined,
      videoUrl: createdReport.videoUrl || undefined,
      posterUrl: createdReport.posterUrl || undefined,
      pdfUrl: createdReport.pdfUrl || undefined,
      speaker: createdReport.speaker || undefined,
      department: createdReport.department || undefined,
      agenda: createdReport.agendaItems.map((item) => item.content),
    };
  }

  async update(
    id: string,
    data: Omit<TrendReport, "id">
  ): Promise<TrendReport> {
    const { agenda, ...reportData } = data;

    // 既存のアジェンダアイテムを削除
    await prisma.agenda.deleteMany({
      where: { trendReportId: id },
    });

    // 新しいアジェンダアイテムを作成
    const agendaItems =
      agenda?.map((item, index) => ({
        content: item,
        order: index,
      })) || [];

    const updatedReport = await prisma.trendReport.update({
      where: { id },
      data: {
        ...reportData,
        publishDate: new Date(reportData.publishDate),
        agendaItems: {
          create: agendaItems,
        },
      },
      include: {
        agendaItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return {
      id: updatedReport.id,
      title: updatedReport.title,
      summary: updatedReport.summary,
      publishDate: updatedReport.publishDate.toISOString(),
      content: updatedReport.content || undefined,
      videoUrl: updatedReport.videoUrl || undefined,
      posterUrl: updatedReport.posterUrl || undefined,
      pdfUrl: updatedReport.pdfUrl || undefined,
      speaker: updatedReport.speaker || undefined,
      department: updatedReport.department || undefined,
      agenda: updatedReport.agendaItems.map((item) => item.content),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.trendReport.delete({
      where: { id },
    });
  }
}
```

### 6.4. ユースケース実装

`src/features/admin/research/use-cases/ListTrendReports.ts`

```typescript
import { TrendReport } from "@/types/trendReport";
import { ITrendReportRepository } from "../ports/ITrendReportRepository";
import { TrendReportRepository } from "../infrastructure/TrendReportRepository";

export class ListTrendReports {
  private repository: ITrendReportRepository;

  constructor(repository?: ITrendReportRepository) {
    this.repository = repository || new TrendReportRepository();
  }

  async execute(): Promise<TrendReport[]> {
    return this.repository.findAll();
  }
}
```

(他のユースケースも同様に実装)

### 6.5. API ルートの実装

`src/app/api/trend-reports/route.ts`

```typescript
import { NextResponse } from "next/server";
import { ListTrendReports } from "@/features/admin/research/use-cases/ListTrendReports";
import { CreateTrendReport } from "@/features/admin/research/use-cases/CreateTrendReport";

// GET /api/trend-reports
export async function GET() {
  try {
    const useCase = new ListTrendReports();
    const reports = await useCase.execute();
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to fetch trend reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch trend reports" },
      { status: 500 }
    );
  }
}

// POST /api/trend-reports
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const useCase = new CreateTrendReport();
    const report = await useCase.execute(data);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Failed to create trend report:", error);
    return NextResponse.json(
      { error: "Failed to create trend report" },
      { status: 500 }
    );
  }
}
```

`src/app/api/trend-reports/[id]/route.ts`

```typescript
import { NextResponse } from "next/server";
import { GetTrendReport } from "@/features/admin/research/use-cases/GetTrendReport";
import { UpdateTrendReport } from "@/features/admin/research/use-cases/UpdateTrendReport";
import { DeleteTrendReport } from "@/features/admin/research/use-cases/DeleteTrendReport";

// GET /api/trend-reports/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const useCase = new GetTrendReport();
    const report = await useCase.execute(params.id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error(`Failed to fetch trend report ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch trend report" },
      { status: 500 }
    );
  }
}

// PUT /api/trend-reports/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const useCase = new UpdateTrendReport();
    const report = await useCase.execute(params.id, data);

    return NextResponse.json(report);
  } catch (error) {
    console.error(`Failed to update trend report ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update trend report" },
      { status: 500 }
    );
  }
}

// DELETE /api/trend-reports/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const useCase = new DeleteTrendReport();
    await useCase.execute(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete trend report ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete trend report" },
      { status: 500 }
    );
  }
}
```

### 6.6. フロントエンド実装の更新

既存の `ResearchReportService.ts` を更新して、ローカルストレージの代わりに API エンドポイントを使用するように変更します。

`src/features/admin/services/ResearchReportService.ts`

```typescript
"use client";

import { TrendReport } from "@/types/trendReport";

// API URL
const API_BASE_URL = "/api/trend-reports";

export class ResearchReportService {
  // レポート一覧を取得
  static async getReports(): Promise<TrendReport[]> {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("レポートデータの取得に失敗しました:", error);
      throw error;
    }
  }

  // レポートを1件取得
  static async getReportById(id: string): Promise<TrendReport | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("レポートデータの取得に失敗しました:", error);
      throw error;
    }
  }

  // レポートを新規作成
  static async createReport(
    report: Omit<TrendReport, "id">
  ): Promise<TrendReport> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("レポートの作成に失敗しました:", error);
      throw error;
    }
  }

  // レポートを更新
  static async updateReport(
    id: string,
    report: Omit<TrendReport, "id">
  ): Promise<TrendReport> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("レポートの更新に失敗しました:", error);
      throw error;
    }
  }

  // レポートを削除
  static async deleteReport(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error("レポートの削除に失敗しました:", error);
      throw error;
    }
  }
}
```

## 7. ファイルアップロード機能

動向調査レポートには、PDF や動画ファイルを添付することができます。これらのファイルを扱うためのアップロード機能を追加します。

### 7.1. アップロード API の作成

`src/app/api/upload/route.ts`

```typescript
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ファイルをバイナリデータに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 保存先のディレクトリを決定（ファイルタイプに基づく）
    let uploadDir = "public/uploads/";
    const fileType = file.type.split("/")[0];

    if (fileType === "video") {
      uploadDir += "videos/";
    } else if (fileType === "application" && file.type.includes("pdf")) {
      uploadDir += "pdfs/";
    } else if (fileType === "image") {
      uploadDir += "images/";
    } else {
      uploadDir += "others/";
    }

    // ユニークなファイル名を生成（タイムスタンプを使用）
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split(".").pop();
    const fileName = `${timestamp}.${extension}`;

    // ファイルを保存
    const filePath = path.join(process.cwd(), uploadDir, fileName);
    await writeFile(filePath, buffer);

    // ファイルのURLパスを返す
    const urlPath = `/uploads/${
      fileType === "video"
        ? "videos"
        : fileType === "application" && file.type.includes("pdf")
        ? "pdfs"
        : fileType === "image"
        ? "images"
        : "others"
    }/${fileName}`;

    return NextResponse.json(
      {
        url: urlPath,
        originalName,
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
```

### 7.2. フォームコンポーネントの拡張

`src/features/admin/components/FileUploader.tsx`

```tsx
"use client";

import { useState } from "react";

interface FileUploaderProps {
  accept?: string;
  onUpload: (url: string) => void;
  label: string;
  currentValue?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  onUpload,
  label,
  currentValue,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress(30);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(90);

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      onUpload(data.url);
      setProgress(100);
    } catch (err) {
      console.error("Upload error:", err);
      setError("ファイルのアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="flex items-center">
        <input
          type="file"
          accept={accept}
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
          id={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
        />

        <label
          htmlFor={`file-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? "アップロード中..." : "ファイルを選択"}
        </label>

        {currentValue && !isUploading && (
          <span className="ml-3 text-sm text-gray-600 truncate max-w-xs">
            {currentValue.split("/").pop()}
          </span>
        )}
      </div>

      {isUploading && (
        <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploader;
```

ResearchReportForm コンポーネントを更新して、FileUploader コンポーネントを使用するようにします。

## 8. 環境構築手順

### 8.1. プロジェクトセットアップ

1. 依存パッケージのインストール:

```bash
npm install @prisma/client
npm install -D prisma
```

2. PostgreSQL の起動（Docker 使用の場合）:

```bash
docker-compose up -d
```

3. Prisma マイグレーション実行:

```bash
npx prisma migrate dev --name init
```

4. シードデータの投入:

```bash
npx prisma db seed
```

5. 開発サーバーの起動:

```bash
npm run dev
```

## 9. デプロイメント考慮事項

- **本番環境データベース**: 本番環境ではマネージド PostgreSQL サービス（例：AWS RDS、Heroku Postgres）の利用を推奨します。
- **マイグレーション**: デプロイメント時にマイグレーションを実行する仕組みを整える必要があります。
- **環境変数**: 本番環境用のデータベース URL を環境変数として設定します。
- **ファイルストレージ**: 本番環境では、アップロードされたファイルを S3 などのオブジェクトストレージに保存する実装に変更することを検討します。

## 10. 今後の拡張案

1. **フルテキスト検索**: PostgreSQL のフルテキスト検索機能を使用して、動向調査レポートの内容を検索できるようにする。
2. **タグ付け**: レポートにタグを付けて分類できるようにする。
3. **複数言語対応**: i18n 対応を強化し、レポートのタイトルや内容を複数言語で登録できるようにする。
4. **アクセス権限管理**: 閲覧可能なユーザーを制限するための権限管理機能を追加する。
5. **統計情報**: レポートの閲覧数や人気度などの統計情報を収集・表示する機能を追加する。
