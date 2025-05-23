"use client";

import { useEffect, useState } from "react";
import { BackgroundConfig } from "@/types/BackgroundConfig";
import { BackgroundJsonRepository } from "@/features/background/BackgroundJsonRepository";
import { GetPageBackground } from "@/features/background/GetPageBackground";
import { usePathname } from "next/navigation";

export function usePageBackground(): BackgroundConfig | undefined {
  const [config, setConfig] = useState<BackgroundConfig>();
  const pathname = usePathname();

  useEffect(() => {
    const repo = new BackgroundJsonRepository();
    const usecase = new GetPageBackground(repo);
    // ページIDはルーティングに応じて変換
    let pageId = pathname === "/" ? "home" : pathname.replace(/^\//, "");
    usecase.execute(pageId).then(setConfig);
  }, [pathname]);

  return config;
}
