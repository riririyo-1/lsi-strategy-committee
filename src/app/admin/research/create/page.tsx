"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageWithBackground from "@/components/common/PageWithBackground";
import ResearchReportForm from "@/features/admin/components/ResearchReportForm";
import { ResearchReportService } from "@/features/admin/services/ResearchReportService";
import { TrendReport } from "@/types/trendReport";

export default function ResearchReportCreatePage() {
  const router = useRouter();

  const handleSave = async (reportData: TrendReport) => {
    try {
      await ResearchReportService.createReport(reportData);
      // 保存成功したら一覧ページへ戻る
      router.push("/admin/research");
    } catch (err) {
      throw new Error("レポートの保存に失敗しました");
    }
  };

  const handleCancel = () => {
    // 一覧ページへ戻る
    router.push("/admin/research");
  };

  return (
    <PageWithBackground>
      <div className="w-full max-w-5xl mx-auto">
        <ResearchReportForm onSave={handleSave} onCancel={handleCancel} />
      </div>
    </PageWithBackground>
  );
}
