"use client";

import React from "react";
import { useI18n } from "@/features/i18n/hooks/useI18n";
import { useAccessRequestForm } from "../hooks/useAccessRequestForm";
import FormField from "./FormField";
import InquiryTypeSelect from "./InquiryTypeSelect";
import SubmitConfirmModal from "./SubmitConfirmModal";
import SuccessMessage from "./SuccessMessage";

const AccessRequestForm: React.FC = () => {
  const { t } = useI18n();
  const {
    formData,
    handleChange,
    handleInquiryTypeChange,
    handleSubmit,
    confirmSubmit,
    closeModal,
    resetForm,
    errors,
    isSubmitting,
    isSuccess,
    showModal,
  } = useAccessRequestForm();

  if (isSuccess) {
    return <SuccessMessage onReset={resetForm} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <div className="text-sm text-red-700 dark:text-red-400">
              {errors.general}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField id="name" label="お名前" error={errors.name} required>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700"
              } dark:bg-gray-800 dark:text-white`}
              placeholder="山田 太郎"
            />
          </FormField>

          <FormField
            id="email"
            label="メールアドレス"
            error={errors.email}
            required
          >
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700"
              } dark:bg-gray-800 dark:text-white`}
              placeholder="example@example.com"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField
            id="company"
            label="会社名"
            error={errors.company}
            required
          >
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
                errors.company
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700"
              } dark:bg-gray-800 dark:text-white`}
              placeholder="株式会社〇〇"
            />
          </FormField>

          <FormField id="department" label="部署名" error={errors.department}>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
              placeholder="営業部"
            />
          </FormField>
        </div>

        <InquiryTypeSelect
          selectedType={formData.inquiryType}
          onChange={handleInquiryTypeChange}
          error={errors.inquiryType}
        />

        <FormField
          id="message"
          label="お問い合わせ内容"
          error={errors.message}
          required
        >
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm text-sm ${
              errors.message
                ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700"
            } dark:bg-gray-800 dark:text-white`}
            placeholder="お問い合わせ内容をご記入ください。"
          />
        </FormField>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isSubmitting ? "送信中..." : "送信確認"}
          </button>
        </div>
      </form>

      <SubmitConfirmModal
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={confirmSubmit}
        formData={formData}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AccessRequestForm;
