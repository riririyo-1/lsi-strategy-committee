import React, { useState, useEffect, useRef, useCallback } from "react";

// Tailwind CSSのCDNを読み込むためのスクリプト
// Three.jsとOrbitControls、GSAPのCDNは立体表示削除のため不要
const TailwindScript = () => (
  <>
    <script src="https://cdn.tailwindcss.com"></script>
    {/* Three.js, OrbitControls, GSAP は立体表示削除のためコメントアウトまたは削除 */}
    {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script> */}
    {/* <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script> */}
    {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script> */}
  </>
);

// 共通のサンプル記事データ
const articlesData = [
  {
    id: "1",
    thumbnail: "https://placehold.co/600x400/A7D9D9/2E4057?text=Web+Trends",
    title: "Web開発の未来を拓くトレンド技術",
    source: "Tech Insights",
    date: "2025年5月28日",
    summary:
      "AI駆動型開発、WebAssemblyの進化、そして分散型ウェブ技術が今後のWeb開発をどのように変えるかを探ります。",
    content:
      "Web開発のトレンドに関する詳細な記事内容がここに表示されます。AI、WebAssembly、分散型ウェブなど、具体的な技術要素や将来の展望について深く掘り下げて解説します。それぞれの技術がどのように連携し、開発プロセスやユーザー体験を向上させるのかを詳細に記述します。例えば、AIによるコード生成やテスト自動化、WebAssemblyによる高速なクライアントサイド処理、ブロックチェーン技術を活用したデータ管理など。",
    labels: ["Web開発", "AI", "WebAssembly", "トレンド"],
    url: "https://example.com/web-trends-1", // 元リンクを追加
  },
  {
    id: "2",
    thumbnail: "https://placehold.co/600x400/C8E6C9/38474B?text=Next.js+Guide",
    title: "Next.js完全ガイド: パフォーマンスと開発効率",
    source: "Code Journal",
    date: "2025年5月20日",
    summary:
      "App Router、サーバーコンポーネント、画像最適化など、Next.jsの最新機能を活用して、超高速なウェブサイトを構築するための実践ガイド。",
    content:
      "Next.jsの最新バージョンにおけるApp Router、サーバーコンポーネントの概念、そして静的サイト生成(SSG)とサーバーサイドレンダリング(SSR)の使い分けについて詳細に解説します。画像の最適化やバンドルサイズの削減といったパフォーマンスチューニングのベストプラクティスも紹介し、開発者がNext.jsを最大限に活用できるよう具体的なコード例を交えながら説明します。",
    labels: ["Next.js", "React", "パフォーマンス"],
    url: "https://example.com/nextjs-guide-2", // 元リンクを追加
  },
  {
    id: "3",
    thumbnail: "https://placehold.co/600x400/FFE0B2/4B3621?text=Cloud+Native",
    title: "クラウドネイティブ時代の到来：コンテナとサーバーレス",
    source: "Cloud Architect",
    date: "2025年5月15日",
    summary:
      "Kubernetes、Docker、AWS Lambdaなどの技術がもたらす開発の変化と、クラウドネイティブアーキテクチャの設計原則を深掘りします。",
    content:
      "クラウドネイティブ技術の進化は、アプリケーション開発とデプロイの方法を根本から変えつつあります。本記事では、コンテナ技術の代表であるDockerとKubernetes、そしてサーバーレスコンピューティングの概念と主要なプラットフォーム（AWS Lambda, Google Cloud Functionsなど）について、そのメリットとデメリット、そして実際のユースケースを交えて詳細に解説します。",
    labels: ["クラウド", "コンテナ", "サーバーレス"],
    url: "https://example.com/cloud-native-3", // 元リンクを追加
  },
  {
    id: "4",
    thumbnail: "https://placehold.co/600x400/E1BEE7/311B92?text=Design+System",
    title: "デザインシステム構築のベストプラクティス",
    source: "UX Magazine",
    date: "2025年5月10日",
    summary:
      "一貫性のあるユーザー体験を提供するためのデザインシステム構築手法。FigmaとStorybookを活用した効率的なワークフロー。",
    content:
      "デザインシステムは、大規模なプロダクト開発において一貫性と効率性を高めるための重要なツールです。本記事では、デザインシステムの構成要素、構築プロセス、そしてFigmaやStorybookといったツールをどのように活用して、デザインと開発の連携をスムーズにするかについて、具体的な事例を交えて解説します。",
    labels: ["デザインシステム", "UX/UI", "Figma"],
    url: "https://example.com/design-system-4", // 元リンクを追加
  },
  {
    id: "5",
    thumbnail: "https://placehold.co/600x400/BBDEFB/0D47A1?text=AI+Ethics",
    title: "AI倫理と責任あるAI開発への道",
    source: "AI Forum",
    date: "2025年5月8日",
    summary:
      "公平性、透明性、説明可能性といったAI倫理の重要性と、企業が責任あるAI開発に取り組むためのガイドライン。",
    content:
      "AI技術の急速な発展に伴い、倫理的な問題や社会への影響が懸念されています。本記事では、AI倫理の主要な原則である公平性、透明性、説明可能性について深く掘り下げ、企業が責任あるAI開発を行うための具体的なガイドラインやフレームワークを紹介します。AIの悪用を防ぎ、社会に貢献するAIを開発するための考察を深めます。",
    labels: ["AI", "倫理", "ガバナンス"],
    url: "https://example.com/ai-ethics-5", // 元リンクを追加
  },
  {
    id: "6",
    thumbnail: "https://placehold.co/600x400/FFCDD2/B71C1C?text=Cybersecurity",
    title: "最新のサイバーセキュリティ脅威と対策",
    source: "Security Today",
    date: "2025年5月3日",
    summary:
      "ランサムウェア、フィッシング詐欺、ゼロデイ攻撃など、進化するサイバー脅威からシステムを守るための最新の対策と戦略。",
    content:
      "サイバー空間における脅威は日々進化しており、個人から企業まであらゆる組織がそのリスクに直面しています。本記事では、最新のランサムウェア攻撃の手口、巧妙化するフィッシング詐欺、そして未知の脆弱性を狙うゼロデイ攻撃といった主要なサイバー脅威について解説します。さらに、これらの脅威からシステムとデータを守るための最新の対策技術や組織的な戦略を紹介します。",
    labels: ["セキュリティ", "脅威", "対策"],
    url: "https://example.com/cybersecurity-6", // 元リンクを追加
  },
];

// --- 各表示形式のコンポーネント ---

// カード形式
const ArticleCard = ({ article, onArticleClick }) => {
  return (
    <div
      className={`max-w-sm mx-4 my-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col transform hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-3xl transition-all duration-300 cursor-pointer`}
      onClick={() => onArticleClick(article.id)}
    >
      <img
        src={article.thumbnail}
        alt={article.title}
        className="w-full h-52 object-cover rounded-t-xl"
        style={{ viewTransitionName: `article-image-${article.id}` }} // View Transition Name
      />
      <div className="p-5 flex-grow flex flex-col">
        <h3
          className="text-xl font-semibold mb-2 leading-tight text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          style={{ viewTransitionName: `article-title-${article.id}` }} // View Transition Name
        >
          {article.title}
        </h3>
        {/* 出典と日付の文字色をダークモード対応し、"|" で区切る */}
        <p className={`text-sm mb-2 text-gray-600 dark:text-gray-400`}>
          {article.source} | {article.date}
        </p>
        <p
          className={`text-base mb-4 line-clamp-3 text-gray-700 dark:text-gray-300`}
        >
          {article.summary}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {article.labels.map((label, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// 表形式
const ArticleTable = ({ articles, onArticleClick }) => {
  return (
    <div
      className={`overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100`}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={`bg-gray-100 dark:bg-gray-700`}>
          <tr>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300`}
            >
              タイトル
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300`}
            >
              出典
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300`}
            >
              日付
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300`}
            >
              ラベル
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {articles.map((article) => (
            <tr
              key={article.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              onClick={() => onArticleClick(article.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {article.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* 出典の文字色をダークモード対応 */}
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  {article.source}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* 日付の文字色をダークモード対応 */}
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  {article.date}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {article.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 立体表示コンポーネントは削除されます

// 記事詳細画面
const ArticleDetail = ({ article, onBackClick }) => {
  if (!article) {
    return (
      <div className="flex justify-center items-center h-96 text-xl text-gray-700 dark:text-gray-300">
        記事が見つかりません。
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 my-8">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
          style={{ viewTransitionName: `article-image-${article.id}` }} // View Transition Name
        />
        <h1
          className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-gray-100"
          style={{ viewTransitionName: `article-title-${article.id}` }} // View Transition Name
        >
          {article.title}
        </h1>
        {/* 出典と日付の文字色をダークモード対応 */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {article.source} - {article.date}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {article.labels.map((label, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          <p>{article.content}</p>
        </div>

        {/* ボタンコンテナ */}
        <div className="flex justify-between items-center mt-8">
          {" "}
          {/* justify-betweenで左右に配置 */}
          <button
            onClick={onBackClick}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md text-base font-semibold"
          >
            <svg
              className="mr-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            戻る
          </button>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 shadow-md text-base font-semibold dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              aria-label="元記事を開く"
              title="元記事を開く" // ホバー時のツールチップ
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// --- メインのAppコンポーネント ---
function App() {
  const [activeTab, setActiveTab] = useState("card"); // デフォルトはカードタブ
  const [isDarkMode, setIsDarkMode] = useState(false); // デフォルトはライトモード
  const [selectedArticleId, setSelectedArticleId] = useState(null); // 選択された記事のID

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleArticleClick = (id) => {
    // View Transitions APIがサポートされているかチェック
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setSelectedArticleId(id);
      });
    } else {
      setSelectedArticleId(id);
    }
  };

  const handleBackToList = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setSelectedArticleId(null);
      });
    } else {
      setSelectedArticleId(null);
    }
  };

  // メインのコンテナにdarkクラスを条件付きで追加
  const mainContainerClasses = `font-sans antialiased min-h-screen ${
    isDarkMode ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
  }`;
  // ヘッダーの背景とテキストの色をダークモードに応じて変更
  const headerBgClass = isDarkMode
    ? "bg-gray-800 text-gray-100 border-b border-gray-700"
    : "bg-white text-gray-900 border-b border-gray-200";

  const selectedArticle = articlesData.find(
    (article) => article.id === selectedArticleId
  );

  return (
    <div className={mainContainerClasses}>
      <TailwindScript />

      {/* グローバルスタイル */}
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          /* View Transitions のCSS */
          /* ブラウザがView Transitionsをサポートしている場合に適用されます */
          ::view-transition-old(article-title),
          ::view-transition-new(article-title),
          ::view-transition-old(article-image),
          ::view-transition-new(article-image) {
            animation-duration: 0.3s; /* アニメーションの速度を調整 */
            animation-timing-function: ease-in-out; /* イージング関数 */
          }

          /* タイトルと画像のクロスフェードアニメーション */
          ::view-transition-old(article-title) {
            animation-name: fade-out;
          }
          ::view-transition-new(article-title) {
            animation-name: fade-in;
          }
          ::view-transition-old(article-image) {
            animation-name: fade-out;
          }
          ::view-transition-new(article-image) {
            animation-name: fade-in;
          }

          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}
      </style>

      {/* 共通のヘッダー */}
      <header className={`shadow-sm py-5 mb-10 ${headerBgClass}`}>
        <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            記事一覧デモ
          </h1>
          {/* ダークモード切り替えボタン */}
          <button
            onClick={toggleDarkMode}
            className={`px-5 py-2.5 rounded-full text-base font-medium transition-colors duration-200 shadow-sm
              ${
                isDarkMode
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {isDarkMode ? "🌞 ライトモード" : "🌙 ダークモード"}
          </button>
        </div>
        <p
          className={`text-center mt-3 text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Tailwind CSS で実現する多様な表示と View Transitions
        </p>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10 pb-12">
        {selectedArticleId ? ( // 記事が選択されている場合
          <ArticleDetail
            article={selectedArticle}
            onBackClick={handleBackToList}
          />
        ) : (
          // 記事一覧が表示されている場合
          <>
            {/* タブボタン */}
            <div className="flex justify-center mb-10 space-x-4">
              <button
                onClick={() => setActiveTab("card")}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md
                  ${
                    activeTab === "card"
                      ? "bg-blue-600 text-white transform scale-105"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                カード表示
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md
                  ${
                    activeTab === "table"
                      ? "bg-emerald-600 text-white transform scale-105"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                表形式
              </button>
              {/* 立体表示タブは削除 */}
              {/* <button
                onClick={() => setActiveTab('3d')}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-md
                  ${activeTab === '3d'
                    ? 'bg-purple-600 text-white transform scale-105'
                    : (isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300')
                }`}
              >
                立体表示
              </button> */}
            </div>

            <main>
              {activeTab === "card" && (
                <section>
                  <div className="text-center mb-10">
                    <h2
                      className={`text-5xl font-extrabold mb-4 ${
                        isDarkMode ? "text-blue-300" : "text-blue-700"
                      } tracking-tight`}
                    >
                      カード表示
                    </h2>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      視覚的に魅力的な記事の概要を提供します。
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center -m-4">
                    {articlesData.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onArticleClick={handleArticleClick}
                      />
                    ))}
                  </div>
                </section>
              )}

              {activeTab === "table" && (
                <section>
                  <div className="text-center mb-10">
                    <h2
                      className={`text-5xl font-extrabold mb-4 ${
                        isDarkMode ? "text-emerald-300" : "text-emerald-700"
                      } tracking-tight`}
                    >
                      表形式
                    </h2>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      記事の情報を一覧で素早く確認できます。
                    </p>
                  </div>
                  <ArticleTable
                    articles={articlesData}
                    onArticleClick={handleArticleClick}
                  />
                </section>
              )}

              {/* 立体表示セクションは削除 */}
              {/* {activeTab === '3d' && (
                <section>
                  <div className="text-center mb-10">
                    <h2 className={`text-5xl font-extrabold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'} tracking-tight`}>
                      立体表示 (コンセプト)
                    </h2>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      インタラクティブな3D空間で記事を探索するイメージです。
                    </p>
                  </div>
                  <Article3DGrid articles={articlesData} onArticleClick={handleArticleClick} isDarkMode={isDarkMode} />
                </section>
              )} */}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
