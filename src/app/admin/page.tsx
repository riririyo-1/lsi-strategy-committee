"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
          管理者ダッシュボード
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/admin/topics/collect"
            className="block bg-blue-800 hover:bg-blue-700 text-white rounded-lg shadow p-8 transition"
          >
            <div className="text-xl font-semibold mb-2">TOPICS配信記事収集</div>
            <div className="text-gray-300 text-sm">
              RSS自動収集・手動追加・要約・ラベル付け
            </div>
          </Link>
          <Link
            href="/admin/research"
            className="block bg-green-800 hover:bg-green-700 text-white rounded-lg shadow p-8 transition"
          >
            <div className="text-xl font-semibold mb-2">
              動向調査レポート管理
            </div>
            <div className="text-gray-300 text-sm">
              レポートの作成・編集・削除・公開設定
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
