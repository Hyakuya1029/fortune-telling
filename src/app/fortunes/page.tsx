import type { Metadata } from "next";

import { FortuneArchive } from "@/components/FortuneArchive";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StarField } from "@/components/StarField";
import { FORTUNES } from "@/data/fortunes";

export const metadata: Metadata = {
  title: "三十六签 · 签文录",
  description:
    "星签三十六支原创签文：关于出发、等待、连接、放下与回到自己。找到此刻需要的那一句。",
  alternates: {
    canonical: "/fortunes",
  },
};

export default function FortunesPage() {
  return (
    <>
      <StarField />
      <a className="skip-link" href="#archive-list">
        跳到签文列表
      </a>
      <SiteHeader solid />

      <main id="top">
        <section className="archive-hero">
          <span className="archive-watermark" aria-hidden="true">
            36
          </span>
          <div className="container archive-hero-inner">
            <p className="eyebrow">
              <span>ARCHIVE</span>
              <span className="eyebrow-line" aria-hidden="true" />
              <span>THIRTY-SIX SIGNS</span>
            </p>
            <h1>
              三十六签，
              <br />
              <em>每一种今天。</em>
            </h1>
            <p className="archive-lead">
              不必全部读完。找到此刻需要的那一句，就已经足够。
              每一支签都是一段原创文字，不预言结果，只提供一个看事情的角度。
            </p>
            <div className="archive-stats">
              <div>
                <strong>{FORTUNES.length}</strong>
                <span>支原创签文</span>
              </div>
              <div>
                <strong>05</strong>
                <span>种签的等级</span>
              </div>
              <div>
                <strong>01</strong>
                <span>天只抽一次</span>
              </div>
            </div>
          </div>
        </section>

        <section id="archive-list" className="section archive-section">
          <div className="container">
            <FortuneArchive fortunes={FORTUNES} />
          </div>
        </section>

        <section className="archive-cta">
          <div className="container archive-cta-inner">
            <div>
              <p className="kicker">A SMALL RITUAL</p>
              <h2>今天的那一支，抽过了吗？</h2>
            </div>
            <a href="/#ritual" className="btn btn--primary">
              去抽今日签 <span aria-hidden="true">↘</span>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
