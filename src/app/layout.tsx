import type { Metadata, Viewport } from "next";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fortune.hyakuya.cc.cd";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "星签 · 每日一签",
    template: "%s | 星签",
  },
  description:
    "每天只抽一次的现代星签。闭眼，深呼吸，默念一个此刻的问题，抽取属于今天的原创签文。不预测命运，只提供一面镜子。",
  applicationName: "星签",
  authors: [{ name: "星签" }],
  keywords: [
    "每日一签",
    "星签",
    "抽签",
    "今日运势",
    "自我观照",
    "fortune",
    "daily oracle",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "星签 · STELLAR ORACLE",
    title: "星签 · 每日一签",
    description:
      "每天只抽一次的现代星签。今日，宇宙想对你说什么？",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "星签 · 每日一签",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "星签 · 每日一签",
    description:
      "每天只抽一次的现代星签。今日，宇宙想对你说什么？",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#070b12",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
