"use client";

export default function TopicsCollectPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          TOPICS配信記事収集
        </h1>
        <div className="bg-gray-800 rounded-lg shadow p-8 text-gray-200">
          <p>
            このページでは、RSS自動収集・手動追加・LLM要約・ラベル付け・収集結果の管理ができます。
          </p>
          {/* 今後、タブ切り替えや各機能コンポーネントをここに実装 */}
        </div>
      </div>
    </div>
  );
}
