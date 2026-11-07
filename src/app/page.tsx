import type { Metadata } from "next";

import { FortuneExperience } from "@/components/FortuneExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StarField } from "@/components/StarField";
import {
  getDailyFortune,
  getDateKey,
  getDateLabel,
  getShortDate,
} from "@/lib/daily";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const now = new Date();
  const fortune = getDailyFortune(now);
  const dateKey = getDateKey(now);
  const dateLabel = getDateLabel(now);
  const shortDate = getShortDate(now);

  return (
    <>
      <StarField />
      <a className="skip-link" href="#ritual">
        跳到今日签
      </a>
      <SiteHeader />
      <main id="top">
        <FortuneExperience
          fortune={fortune}
          dateKey={dateKey}
          dateLabel={dateLabel}
          shortDate={shortDate}
        />
      </main>
      <SiteFooter />
    </>
  );
}
