import { PageBackgroundSettings } from "@/types/BackgroundConfig";
import { IBackgroundRepository } from "./IBackgroundRepository";

export class BackgroundJsonRepository implements IBackgroundRepository {
  async loadSettings(): Promise<PageBackgroundSettings> {
    const res = await fetch("/configs/pageBackgrounds.json");
    if (!res.ok) throw new Error("背景設定の取得に失敗しました");
    return await res.json();
  }
}
