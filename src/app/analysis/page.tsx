// filepath: /src/app/analysis/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

const earningsLinks = [
  {
    name: "TSMC",
    url: "https://investor.tsmc.com/english/quarterly-results",
    color: "indigo",
    description:
      "台湾積体電路製造（TSMC）は、世界最大の半導体ファウンドリです。",
    button: "bg-indigo-500 hover:bg-indigo-600",
    title: "text-indigo-700",
  },
  {
    name: "UMC",
    url: "https://www.umc.com/en/IR/financial_reports.asp",
    color: "green",
    description:
      "聯華電子（UMC）は、台湾を拠点とする大手半導体ファウンドリです。",
    button: "bg-green-500 hover:bg-green-600",
    title: "text-green-700",
  },
  {
    name: "Samsung Electronics",
    url: "https://www.samsung.com/global/ir/financial-information/earnings-release/",
    color: "blue",
    description:
      "サムスン電子は、メモリ半導体やシステムLSIなどを手がける韓国の総合電機メーカーです。",
    button: "bg-blue-500 hover:bg-blue-600",
    title: "text-blue-700",
  },
  {
    name: "GlobalFoundries",
    url: "https://investors.gf.com/financials/quarterly-results",
    color: "red",
    description:
      "GFとしても知られるGlobalFoundriesは、米国を拠点とする大手半導体ファウンドリです。",
    button: "bg-red-500 hover:bg-red-600",
    title: "text-red-700",
  },
  {
    name: "SK hynix",
    url: "https://www.skhynix.com/eng/ir/financialInfo/earningsRelease.jsp",
    color: "orange",
    description:
      "SKハイニックスは、韓国を拠点とする大手メモリ半導体メーカーです。",
    button: "bg-orange-500 hover:bg-orange-600",
    title: "text-orange-700",
  },
  {
    name: "Micron Technology",
    url: "https://investors.micron.com/financials/quarterly-results",
    color: "purple",
    description:
      "マイクロン・テクノロジーは、米国を拠点とする大手メモリおよびストレージソリューションメーカーです。",
    button: "bg-purple-500 hover:bg-purple-600",
    title: "text-purple-700",
  },
];

export default function AnalysisPage() {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-8 pt-24 md:pt-28">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-600">
          半導体企業 四半期決算資料リンク集
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          主要な半導体メーカーの最新決算情報へアクセスできます。
        </p>
        <div className="mt-6 flex justify-center">
          <button
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow transition"
            onClick={() => router.push("/analysis/MapGlobe")}
          >
            拠点マップで表示
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {earningsLinks.map((company) => (
          <div
            key={company.name}
            className="company-card bg-white dark:bg-gray-800/90 p-6 rounded-lg shadow-md flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <h2 className={`text-2xl font-semibold mb-3 ${company.title}`}>
                {company.name}
              </h2>
              <p className="text-gray-600 mb-4">{company.description}</p>
            </div>
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block ${company.button} text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 h-12 flex items-center justify-center mt-auto`}
            >
              決算資料ページへ
            </a>
          </div>
        ))}
      </div>

      <footer className="text-center mt-12 py-6 border-t border-gray-300">
        <p className="text-gray-600 text-sm">
          各社のIR情報は予告なく変更される場合があります。最新の情報は各社のウェブサイトでご確認ください。
        </p>
        <p className="text-gray-500 text-xs mt-1">最終確認日: 2025年5月26日</p>
      </footer>
    </main>
  );
}
