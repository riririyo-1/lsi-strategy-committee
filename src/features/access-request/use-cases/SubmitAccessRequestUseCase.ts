import { AccessRequestData } from "@/types/accessRequest";

export class SubmitAccessRequestUseCase {
  async execute(
    data: AccessRequestData
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // 実際の実装では、APIクライアントを使用してサーバーに送信する
      // 例: const response = await apiClient.post('/api/access-requests', data);

      // デモ用に遅延を模擬
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 成功レスポンス
      return {
        success: true,
        message: "お問い合わせを受け付けました。担当者より連絡いたします。",
      };
    } catch (error) {
      console.error("Access request submission error:", error);
      return {
        success: false,
        message: "エラーが発生しました。後でもう一度お試しください。",
      };
    }
  }
}
