import { Metadata } from "next";
import ArticlesFeature from "@/features/articles/components/ArticlesFeature";

export const metadata: Metadata = {
  title: "記事一覧 - LSI戦略コミッティ",
  description: "半導体業界の最新記事を掲載しています",
};

export default function ArticlesPage() {
  // SSR時にモックデータを生成
  const initialArticles = [
    {
      id: "1",
      title: "次世代半導体：3nmプロセスの量産化が始まる",
      source: "EE Times Japan",
      publishedAt: "2025-05-15",
      summary:
        "台湾のTSMCが3nmプロセスの量産を開始。次世代チップの省電力化と高性能化に期待が高まっています。",
      labels: ["製造プロセス", "TSMC", "微細化"],
      thumbnailUrl: "https://placehold.co/600x400?text=3nm+Process",
      articleUrl: "https://example.com/article1",
      createdAt: "2025-05-15",
      updatedAt: "2025-05-15",
    },
    {
      id: "2",
      title: "車載半導体市場：2025年は過去最高を記録へ",
      source: "日経エレクトロニクス",
      publishedAt: "2025-05-10",
      summary:
        "自動運転技術とEV化の進展により、車載半導体の市場規模が拡大。2025年は過去最高の出荷額を記録する見込み。",
      labels: ["市場動向", "車載", "EV"],
      thumbnailUrl: "https://placehold.co/600x400?text=Auto+Semiconductor",
      articleUrl: "https://example.com/article2",
      createdAt: "2025-05-10T14:30:00Z",
      updatedAt: "2025-05-10T14:30:00Z",
    },
    {
      id: "3",
      title: "量子コンピューティング向けLSI開発の最新動向",
      source: "IT Media",
      publishedAt: "2025-05-08T00:00:00Z",
      summary:
        "量子ビットの制御に特化したLSIの開発が進行中。従来のCMOSプロセスとの互換性を維持しつつ、低温動作に対応。",
      labels: ["量子コンピューティング", "研究開発"],
      thumbnailUrl: "https://placehold.co/600x400?text=Quantum+LSI",
      articleUrl: "https://example.com/article3",
      createdAt: "2025-05-08T09:15:00Z",
      updatedAt: "2025-05-08T09:15:00Z",
    },
    {
      id: "4",
      title: "サステナブル半導体製造：カーボンニュートラルへの取り組み",
      source: "マイナビニュース",
      publishedAt: "2025-05-05T00:00:00Z",
      summary:
        "半導体大手が製造プロセスのカーボンニュートラル化を加速。再生可能エネルギーの活用と製造効率の改善に注力。",
      labels: ["サステナビリティ", "環境", "製造"],
      thumbnailUrl: "https://placehold.co/600x400?text=Green+Semiconductor",
      articleUrl: "https://example.com/article4",
      createdAt: "2025-05-05T16:20:00Z",
      updatedAt: "2025-05-05T16:20:00Z",
    },
    {
      id: "5",
      title: "EUVリソグラフィ：次世代技術の課題と展望",
      source: "NHK",
      publishedAt: "2025-05-01T00:00:00Z",
      summary:
        "最先端のEUVリソグラフィ技術の現状と課題を解説。半導体の微細化限界への挑戦と将来展望を専門家が語る。",
      labels: ["リソグラフィ", "技術動向", "EUV"],
      thumbnailUrl: "https://placehold.co/600x400?text=EUV+Lithography",
      articleUrl: "https://example.com/article5",
      createdAt: "2025-05-01T11:00:00Z",
      updatedAt: "2025-05-01T11:00:00Z",
    },
  ];

  return <ArticlesFeature initialArticles={initialArticles} />;
}
