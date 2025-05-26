import React from "react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow flex flex-col gap-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h4 className="text-lg font-semibold text-white">{article.title}</h4>
        <span className="text-xs text-gray-400 ml-2">
          {article.source} | {article.publishedAt}
        </span>
      </div>
      <p className="text-gray-300 text-sm">{article.summary}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {article.labels?.map((label) => (
          <span
            key={label}
            className="bg-blue-700 text-xs text-white px-2 py-0.5 rounded"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
