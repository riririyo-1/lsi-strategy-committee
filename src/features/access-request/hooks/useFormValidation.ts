import { useState } from "react";
import { validateAccessRequest } from "../validations/accessRequestSchema";
import { AccessRequestData } from "@/types/accessRequest";

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (
    data: Partial<AccessRequestData>,
    field?: keyof AccessRequestData
  ) => {
    // 特定のフィールドのみのバリデーションの場合
    if (field) {
      const result = validateAccessRequest({
        ...data,
        // 必須フィールドのダミーデータを追加
        name: data.name || "dummy",
        email: data.email || "dummy@example.com",
        company: data.company || "dummy",
        inquiryType: data.inquiryType || "general",
        message: data.message || "dummy message",
      });

      if (!result.success && result.errors) {
        const relevantError = result.errors[field];
        if (relevantError) {
          setErrors((prev) => ({ ...prev, [field]: relevantError }));
          return false;
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
          return true;
        }
      }

      return true;
    }

    // フォーム全体のバリデーション
    const result = validateAccessRequest(data);
    if (!result.success && result.errors) {
      setErrors(result.errors);
      return false;
    }

    setErrors({});
    return true;
  };

  return { errors, validate, setErrors };
};
