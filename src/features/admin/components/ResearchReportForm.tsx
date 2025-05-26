"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendReport } from "@/types/trendReport";

interface ResearchReportFormProps {
  report?: TrendReport;
  onSave: (report: TrendReport) => Promise<void>;
  onCancel: () => void;
}

const emptyReport: TrendReport = {
  id: "",
  title: "",
  summary: "",
  publishDate: new Date().toISOString().split("T")[0],
  speaker: "",
  department: "",
  videoUrl: "",
  posterUrl: "",
  pdfUrl: "",
  agenda: [""],
};

const ResearchReportForm: React.FC<ResearchReportFormProps> = ({
  report = emptyReport,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TrendReport>({ ...report });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 日付のフォーマット調整
    if (report.publishDate) {
      const date = new Date(report.publishDate);
      if (!isNaN(date.getTime())) {
        setFormData({
          ...report,
          publishDate: date.toISOString().split("T")[0],
        });
      }
    }
  }, [report]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAgendaChange = (index: number, value: string) => {
    const newAgenda = [...(formData.agenda || [""])];
    newAgenda[index] = value;

    // 最後の項目に値が入力されたら、新しい空の項目を追加
    if (index === newAgenda.length - 1 && value.trim() !== "") {
      newAgenda.push("");
    }

    // 空の項目が連続する場合、余分な項目を削除（最後の項目は残す）
    const filtered = newAgenda.filter(
      (item, idx) => item.trim() !== "" || idx === newAgenda.length - 1
    );

    setFormData({
      ...formData,
      agenda: filtered,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 空の項目を除外
      const cleanAgenda =
        formData.agenda?.filter((item) => item.trim() !== "") || [];

      await onSave({
        ...formData,
        agenda: cleanAgenda,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "保存中にエラーが発生しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#232b39] rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
          {formData.id ? "レポート編集" : "新規レポート作成"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-gray-300 mb-1">タイトル</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">講演者</label>
          <input
            type="text"
            name="speaker"
            value={formData.speaker || ""}
            onChange={handleChange}
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">講演者部署</label>
          <input
            type="text"
            name="department"
            value={formData.department || ""}
            onChange={handleChange}
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">
            アジェンダ（各項目を改行で入力）
          </label>
          {formData.agenda?.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => handleAgendaChange(index, e.target.value)}
              className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none mb-2"
              placeholder={`項目 ${index + 1}`}
            />
          ))}
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">概要</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          ></textarea>
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">動画URL</label>
          <input
            type="text"
            name="videoUrl"
            value={formData.videoUrl || ""}
            onChange={handleChange}
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">
            動画ポスター画像URL
          </label>
          <input
            type="text"
            name="posterUrl"
            value={formData.posterUrl || ""}
            onChange={handleChange}
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">資料PDF URL</label>
          <input
            type="text"
            name="pdfUrl"
            value={formData.pdfUrl || ""}
            onChange={handleChange}
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-300 mb-1">公開日</label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            required
            className="w-full bg-[#2d3646] text-gray-200 rounded px-4 py-3 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded transition"
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : "保存する"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResearchReportForm;
