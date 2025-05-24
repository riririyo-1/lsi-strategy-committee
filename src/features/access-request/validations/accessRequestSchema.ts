import { z } from "zod";
import { InquiryType } from "@/types/accessRequest";

export const accessRequestSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  company: z.string().min(1, "会社名を入力してください"),
  department: z.string().optional(),
  inquiryType: z.enum(["general", "technical", "business", "other"] as const),
  message: z.string().min(5, "お問い合わせ内容を5文字以上で入力してください"),
});

export type AccessRequestFormValues = z.infer<typeof accessRequestSchema>;

export const validateAccessRequest = (
  data: unknown
): { success: boolean; errors?: Record<string, string> } => {
  try {
    accessRequestSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          formattedErrors[err.path[0]] = err.message;
        }
      });
      return { success: false, errors: formattedErrors };
    }
    return {
      success: false,
      errors: { general: "入力データの検証に失敗しました" },
    };
  }
};
