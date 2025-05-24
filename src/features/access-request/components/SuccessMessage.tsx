import React from "react";

interface SuccessMessageProps {
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset }) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-md shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-400">
            送信完了
          </h3>
          <div className="mt-2 text-sm text-green-700 dark:text-green-300">
            <p>お問い合わせを受け付けました。担当者より連絡いたします。</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              新しいお問い合わせ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
