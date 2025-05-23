"use client";

import { usePageBackground } from "@/features/background/hooks/usePageBackground";
import PageBackground from "@/components/common/PageBackground";
import { ReactNode } from "react";

interface PageWithBackgroundProps {
  children: ReactNode;
  className?: string;
}

const PageWithBackground = ({
  children,
  className = "",
}: PageWithBackgroundProps) => {
  const config = usePageBackground();
  return (
    <PageBackground config={config}>
      <div
        className={`content-overlay pt-[90px] pb-5 px-5 text-white ${className}`}
      >
        {children}
      </div>
    </PageBackground>
  );
};

export default PageWithBackground;
