import React from "react";
import { InquiryType } from "@/types/accessRequest";

interface InquiryTypeOption {
  value: InquiryType;
  label: string;
  description: string;
}

interface InquiryTypeSelectProps {
  selectedType: InquiryType;
  onChange: (type: InquiryType) => void;
  error?: string;
}

const inquiryTypes: InquiryTypeOption[] = [
  {
    value: "general",
    label: "一般的なお問い合わせ",
    description: "製品情報や会社情報に関する一般的なご質問",
  },
  {
    value: "technical",
    label: "技術的なお問い合わせ",
    description: "製品の技術仕様や実装に関するご質問",
  },
  {
    value: "business",
    label: "ビジネス提案",
    description: "協業や取引に関するご提案",
  },
  {
    value: "other",
    label: "その他",
    description: "上記に当てはまらないお問い合わせ",
  },
];

const InquiryTypeSelect: React.FC<InquiryTypeSelectProps> = ({
  selectedType,
  onChange,
  error,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        お問い合わせ種別<span className="text-red-500 ml-1">*</span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {inquiryTypes.map((type) => (
          <div
            key={type.value}
            className={`p-4 border rounded-md cursor-pointer transition-all ${
              selectedType === type.value
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
            }`}
            onClick={() => onChange(type.value)}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center border ${
                  selectedType === type.value
                    ? "border-blue-500 bg-white dark:bg-gray-800"
                    : "border-gray-400 dark:border-gray-600"
                }`}
              >
                {selectedType === type.value && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </div>
              <span className="font-medium">{type.label}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 pl-6">
              {type.description}
            </p>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default InquiryTypeSelect;
