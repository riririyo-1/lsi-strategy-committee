"use client";

import { TrendReport } from "@/types/trendReport";

// 仮のストレージとして使用するローカルストレージキー
const STORAGE_KEY = "admin_trend_reports";

// 初期データ
const dummyReports: TrendReport[] = [
  {
    id: "report-001",
    title: "SS事業部向け講演会: 次世代半導体とLSI戦略",
    summary:
      "シリコンカーバイド(SiC)、窒化ガリウム(GaN)などの次世代材料に関する最新の研究開発動向と市場予測を解説します。",
    publishDate: "2025-05-20",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterUrl: "https://placehold.co/1280x720/111827/ffffff?text=動画1",
    pdfUrl: "dummy_pdf_url_1.pdf",
    speaker: "山田 太郎",
    department: "先端技術研究部",
    agenda: [
      "半導体業界の最新動向とメガトレンド",
      "次世代半導体材料(SiC, GaN)の可能性と課題",
      "AIチップ設計におけるチップレット技術の重要性",
      "当社のLSI戦略と今後の研究開発ロードマップ",
      "質疑応答",
    ],
  },
  {
    id: "report-002",
    title: "AIチップ市場の競争環境分析",
    summary:
      "NVIDIA, Intel, AMDをはじめとする主要プレイヤーの戦略と、新興企業の動向を詳細に分析。今後の市場シェア変動を予測します。",
    publishDate: "2025-04-15",
    videoUrl: "dummy_video_url_2.mp4",
    posterUrl: "https://placehold.co/1280x720/111827/ffffff?text=動画2",
    pdfUrl: "dummy_pdf_url_2.pdf",
    speaker: "佐藤 花子",
    department: "市場分析部門",
    agenda: [
      "主要AIチップメーカーの戦略比較",
      "新興企業の技術的強み",
      "AIチップ市場の将来予測",
    ],
  },
  {
    id: "report-003",
    title: "チップレット技術が切り開く半導体の未来",
    summary:
      "高性能コンピューティングにおけるチップレット技術の採用状況、標準化の動き、および今後の技術的課題について考察します。",
    publishDate: "2025-03-10",
    videoUrl: "dummy_video_url_3.mp4",
    posterUrl: "https://placehold.co/1280x720/111827/ffffff?text=動画3",
    pdfUrl: "dummy_pdf_url_3.pdf",
    speaker: "鈴木 一郎",
    department: "LSI設計部",
    agenda: [
      "チップレット技術の概要とメリット",
      "主要企業の採用事例",
      "標準化動向とエコシステム",
      "技術的課題と今後の展望",
    ],
  },
];

// ResearchReportService クラス
export class ResearchReportService {
  // レポート一覧を取得
  static async getReports(): Promise<TrendReport[]> {
    // ブラウザ環境でない場合はダミーデータを返す
    if (typeof window === "undefined") {
      return dummyReports;
    }

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (!storedData) {
        // 初回アクセス時はダミーデータを保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyReports));
        return dummyReports;
      }
      return JSON.parse(storedData);
    } catch (error) {
      console.error("レポートデータの取得に失敗しました:", error);
      return dummyReports;
    }
  }

  // レポートを1件取得
  static async getReportById(id: string): Promise<TrendReport | null> {
    const reports = await this.getReports();
    const report = reports.find((r) => r.id === id);
    return report || null;
  }

  // レポートを新規作成
  static async createReport(
    report: Omit<TrendReport, "id">
  ): Promise<TrendReport> {
    const reports = await this.getReports();

    // IDの生成（本来はサーバーで生成）
    const newId = `report-${String(Date.now()).slice(-6)}`;

    const newReport: TrendReport = {
      ...report,
      id: newId,
    };

    const updatedReports = [...reports, newReport];
    await this.saveReports(updatedReports);

    return newReport;
  }

  // レポートを更新
  static async updateReport(
    id: string,
    report: Omit<TrendReport, "id">
  ): Promise<TrendReport> {
    const reports = await this.getReports();
    const index = reports.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error("レポートが見つかりません");
    }

    const updatedReport: TrendReport = {
      ...report,
      id,
    };

    reports[index] = updatedReport;
    await this.saveReports(reports);

    return updatedReport;
  }

  // レポートを削除
  static async deleteReport(id: string): Promise<void> {
    const reports = await this.getReports();
    const filteredReports = reports.filter((r) => r.id !== id);

    if (reports.length === filteredReports.length) {
      throw new Error("レポートが見つかりません");
    }

    await this.saveReports(filteredReports);
  }

  // レポート一覧を保存
  private static async saveReports(reports: TrendReport[]): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error("レポートデータの保存に失敗しました:", error);
      throw new Error("レポートデータの保存に失敗しました");
    }
  }
}
