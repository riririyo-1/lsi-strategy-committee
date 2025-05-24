import { useState } from "react";
import { useFormValidation } from "./useFormValidation";
import { AccessRequestData, InquiryType } from "@/types/accessRequest";

const initialFormState: AccessRequestData = {
  name: "",
  email: "",
  company: "",
  department: "",
  inquiryType: "general",
  message: "",
};

export const useAccessRequestForm = () => {
  const [formData, setFormData] = useState<AccessRequestData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { errors, validate, setErrors } = useFormValidation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // リアルタイムバリデーション（オプション）
    if (name) {
      validate({ ...formData, [name]: value }, name as keyof AccessRequestData);
    }
  };

  const handleInquiryTypeChange = (type: InquiryType) => {
    setFormData((prev) => ({ ...prev, inquiryType: type }));
    validate({ ...formData, inquiryType: type }, "inquiryType");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // フォーム全体のバリデーション
    if (!validate(formData)) {
      return;
    }

    // バリデーション成功時は確認モーダルを表示
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 実際のAPI呼び出しはここで行う
      // 例: await submitAccessRequest(formData);

      // 成功した場合
      setTimeout(() => {
        setIsSubmitting(false);
        setShowModal(false);
        setIsSuccess(true);
        setFormData(initialFormState);
        setErrors({});
      }, 1000);
    } catch (error) {
      console.error("送信エラー:", error);
      setIsSubmitting(false);
      setErrors({
        general: "サーバーエラーが発生しました。後でもう一度お試しください。",
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSuccess(false);
  };

  return {
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
  };
};
