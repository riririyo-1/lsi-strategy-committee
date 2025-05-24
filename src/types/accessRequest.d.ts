export type InquiryType = "general" | "technical" | "business" | "other";

export interface AccessRequestData {
  name: string;
  email: string;
  company: string;
  department?: string;
  inquiryType: InquiryType;
  message: string;
}

export interface ValidationError {
  field: keyof AccessRequestData;
  message: string;
}
