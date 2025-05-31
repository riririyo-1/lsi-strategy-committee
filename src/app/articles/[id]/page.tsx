import { Metadata } from "next";
import ArticleDetail from "@/features/articles/components/ArticleDetail";

export const generateMetadata = async ({ params }) => {
  // 実際の実装では記事情報をAPIから取得し、メタデータを生成する
  return {
    title: "記事詳細 - LSI戦略コミッティ",
    description: "半導体業界の記事詳細を表示します",
  } as Metadata;
};

export default function ArticleDetailPage({ params }) {
  const { id } = params;
  return <ArticleDetail articleId={id} />;
}
