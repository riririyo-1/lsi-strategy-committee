import React from "react";
import { AccessRequestData } from "@/types/accessRequest";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: AccessRequestData;
  isSubmitting: boolean;
}

const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const inquiryTypeLabels: Record<string, string> = {
    general: "一般的なお問い合わせ",
    technical: "技術的なお問い合わせ",
    business: "ビジネス提案",
    other: "その他",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl transform transition-all">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            送信内容の確認
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            以下の内容で送信します。よろしいですか？
          </p>
        </div>

        <div className="mb-5 text-sm">
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              お名前
            </div>
            <div className="col-span-2 text-gray-900 dark:text-white">
              {formData.name}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              メールアドレス
            </div>
            <div className="col-span-2 text-gray-900 dark:text-white">
              {formData.email}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              会社名
            </div>
            <div className="col-span-2 text-gray-900 dark:text-white">
              {formData.company}
            </div>
          </div>

          {formData.department && (
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="font-medium text-gray-700 dark:text-gray-300">
                部署名
              </div>
              <div className="col-span-2 text-gray-900 dark:text-white">
                {formData.department}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              お問い合わせ種別
            </div>
            <div className="col-span-2 text-gray-900 dark:text-white">
              {inquiryTypeLabels[formData.inquiryType]}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              お問い合わせ内容
            </div>
            <div className="col-span-2 text-gray-900 dark:text-white whitespace-pre-wrap">
              {formData.message}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                送信中...
              </>
            ) : (
              "送信する"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmModal;
