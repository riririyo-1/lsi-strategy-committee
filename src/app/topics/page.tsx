import { Metadata } from "next";
import { TopicsFeature } from "@/features/topics/components/TopicsFeature";

export const metadata: Metadata = {
  title: "TOPICS配信 - LSI戦略コミッティ",
  description: "半導体業界の月次トピックス配信",
};

import PageWithBackground from "@/components/common/PageWithBackground";

export default function TopicsPage() {
  return (
    <PageWithBackground>
      <TopicsFeature />
    </PageWithBackground>
  );
}
