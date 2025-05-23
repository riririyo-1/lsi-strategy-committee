import { TrendReport } from "@/types/trendReport";

// ダミーデータ（ResearchPageClient.tsxと同じ内容に統一）
const dummyReports: TrendReport[] = [
  {
    id: "report-001",
    title: "次世代半導体材料の動向 2025",
    summary:
      "シリコンカーバイド(SiC)、窒化ガリウム(GaN)などの次世代材料に関する最新の研究開発動向と市場予測を解説します。",
    publishDate: "2025年5月15日",
    videoUrl: "dummy_video_url_1.mp4",
    posterUrl: "https://placehold.co/1280x720/111827/ffffff?text=動画1",
    pdfUrl: "dummy_pdf_url_1.pdf",
    speaker: "山田 太郎",
    department: "先端技術研究部",
    agenda: [
      "SiC材料の最新トレンド",
      "GaN技術の市場応用",
      "次世代材料の課題と展望",
    ],
  },
  {
    id: "report-002",
    title: "AIチップ市場の競争環境分析",
    summary:
      "NVIDIA, Intel, AMDをはじめとする主要プレイヤーの戦略と、新興企業の動向を詳細に分析。今後の市場シェア変動を予測します。",
    publishDate: "2025年4月28日",
    videoUrl: "dummy_video_url_2.mp4",
    posterUrl: "https://placehold.co/1280x720/111827/ffffff?text=動画2",
    pdfUrl: "dummy_pdf_url_2.pdf",
    speaker: "鈴木 一郎",
    department: "市場分析部門",
    agenda: [
      "主要AIチップメーカーの戦略比較",
      "新興企業の技術的強み",
      "AIチップ市場の将来予測",
    ],
  },
  {
    id: "report-003",
    title: "チップレット技術の最新トレンドと将来展望",
    summary:
      "高性能コンピューティングにおけるチップレット技術の採用状況、標準化の動き、および今後の技術的課題について考察します。",
    publishDate: "2025年3月10日",
    videoUrl: "dummy_video_url_3.mp4",
    posterUrl: "https://placehold.co/1280x720/111827/ffffff?text=動画3",
    pdfUrl: "dummy_pdf_url_3.pdf",
    speaker: "佐藤 花子",
    department: "LSI設計部",
    agenda: [
      "チップレット技術の概要とメリット",
      "主要企業の採用事例",
      "標準化動向とエコシステム",
      "技術的課題と今後の展望",
    ],
  },
];

export async function getResearchReportById(
  id: string
): Promise<TrendReport | null> {
  // 本来はAPIやDBから取得する処理
  return dummyReports.find((r) => r.id === id) || null;
}
