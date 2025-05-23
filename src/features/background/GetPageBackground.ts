import {
  BackgroundConfig,
  PageBackgroundSettings,
} from "@/types/BackgroundConfig";
import { IBackgroundRepository } from "./IBackgroundRepository";

export class GetPageBackground {
  constructor(private readonly backgroundRepository: IBackgroundRepository) {}

  async execute(pageId: string): Promise<BackgroundConfig | undefined> {
    const settings = await this.backgroundRepository.loadSettings();
    return settings[pageId] || settings["default"];
  }
}
