import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StarField } from "@/components/StarField";

export const metadata: Metadata = {
  title: "迷路了",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <StarField />
      <SiteHeader solid />
      <main id="top" className="not-found">
        <div className="container not-found-inner">
          <p className="eyebrow">
            <span>404</span>
            <span className="eyebrow-line" aria-hidden="true" />
            <span>LOST IN THE STARS</span>
          </p>
          <h1>
            这条路，
            <br />
            <em>暂时没有星。</em>
          </h1>
          <p className="not-found-copy">
            你要找的页面不在这里。也许是链接写错了，也许是它已经随着今天的签文一起翻页。
          </p>
          <Link href="/" className="btn btn--primary">
            回到今日签 <span aria-hidden="true">↘</span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
