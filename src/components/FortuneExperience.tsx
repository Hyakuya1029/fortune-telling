"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CelestialDial } from "@/components/CelestialDial";
import type { Fortune } from "@/data/fortunes";
import {
  buildShareText,
  formatFortuneNumber,
  getDrawStorageKey,
} from "@/lib/daily";

type DrawStatus = "idle" | "drawing" | "revealed";

interface FortuneExperienceProps {
  fortune: Fortune;
  dateKey: string;
  dateLabel: string;
  shortDate: {
    month: string;
    day: string;
    year: string;
  };
}

interface StoredDraw {
  id?: number;
}

function copyWithFallback(text: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    return Promise.reject(new Error("Copy command failed"));
  }

  return Promise.resolve();
}

export function FortuneExperience({
  fortune,
  dateKey,
  dateLabel,
  shortDate,
}: FortuneExperienceProps) {
  const [status, setStatus] = useState<DrawStatus>("idle");
  const [toast, setToast] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const readingRef = useRef<HTMLElement>(null);
  const drawTimer = useRef<number | null>(null);
  const toastTimer = useRef<number | null>(null);
  const shouldScroll = useRef(false);

  const isRevealed = status === "revealed";
  const isDrawing = status === "drawing";

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(getDrawStorageKey(dateKey));
      if (!stored) return;

      const parsed = JSON.parse(stored) as StoredDraw;
      if (parsed.id === fortune.id) {
        setStatus("revealed");
      }
    } catch {
      // A blocked localStorage should never stop the reading from working.
    }
  }, [dateKey, fortune.id]);

  useEffect(() => {
    return () => {
      if (drawTimer.current) window.clearTimeout(drawTimer.current);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (status !== "revealed" || !shouldScroll.current) return;

    shouldScroll.current = false;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timer = window.setTimeout(() => {
      const reading = readingRef.current;
      if (!reading) return;
      reading.focus({ preventScroll: true });
      reading.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 520);

    return () => window.clearTimeout(timer);
  }, [status]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

  const scrollToReading = () => {
    const reading = readingRef.current;
    if (!reading) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    reading.focus({ preventScroll: true });
    reading.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleDraw = () => {
    if (isDrawing) return;

    if (isRevealed) {
      scrollToReading();
      return;
    }

    setStatus("drawing");
    setToast("");

    if ("vibrate" in navigator) {
      navigator.vibrate([8, 36, 14]);
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    drawTimer.current = window.setTimeout(
      () => {
        setStatus("revealed");
        shouldScroll.current = true;

        try {
          window.localStorage.setItem(
            getDrawStorageKey(dateKey),
            JSON.stringify({
              id: fortune.id,
              dateKey,
              drawnAt: new Date().toISOString(),
            }),
          );
        } catch {
          // Private browsing may reject writes; the draw still works.
        }
      },
      reducedMotion ? 260 : 1900,
    );
  };

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);
    const shareUrl = `${window.location.origin}/`;
    const text = buildShareText(fortune, dateLabel, shareUrl);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "星签 · 每日一签",
          text,
          url: shareUrl,
        });
        return;
      }

      await copyWithFallback(text);
      showToast("今日签文已复制");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await copyWithFallback(text);
        showToast("今日签文已复制");
      } catch {
        showToast("复制失败，请手动选择文字");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const hint = isRevealed
    ? "今日签已落定 · 明日再来"
    : isDrawing
      ? "签筒轻响 · 正在为你起签"
      : "轻触卡面 · 抽取今日签";

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span>每日一签</span>
              <span className="eyebrow-line" aria-hidden="true" />
              <span>
                {shortDate.month} {shortDate.day}
              </span>
            </p>

            <h1 id="hero-title">
              今日，
              <br />
              <span className="hero-line">宇宙想对你说</span>
              <br />
              <em>什么？</em>
            </h1>

            <p className="hero-lead">
              不必急着寻找答案。先安静三秒，在心里默念一个此刻最想问的问题，
              然后抽一支只属于今天的签。
            </p>

            <div className="hero-actions">
              <a href="#ritual" className="btn btn--primary">
                {isRevealed ? "查看今日签" : "抽取今日签"}
                <span aria-hidden="true">↘</span>
              </a>
              <Link href="/fortunes" className="btn btn--ghost">
                浏览三十六签
              </Link>
            </div>

            <div className="hero-foot">
              <span>{dateLabel}</span>
              <span className="hero-foot-dot" aria-hidden="true" />
              <span>每日 00:00 更新</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dial-wrap">
              <CelestialDial
                month={shortDate.month}
                day={shortDate.day}
                year={shortDate.year}
              />
            </div>
            <div className="dial-side-note">
              <span>FORTUNE</span>
              <span className="dial-side-line" aria-hidden="true" />
              <span>{isRevealed ? `NO. ${String(fortune.id).padStart(2, "0")}` : "NO. ??"}</span>
            </div>
          </div>
        </div>

        <div className="container hero-scroll">
          <span>向下 · 开始今日的仪式</span>
          <span className="scroll-line" aria-hidden="true" />
        </div>
      </section>

      <section id="ritual" className="section ritual">
        <div className="container">
          <header className="section-heading">
            <span className="section-number">01</span>
            <div>
              <p className="kicker">THE RITUAL</p>
              <h2>静心，抽一支签</h2>
            </div>
            <p className="section-note">
              闭上眼睛，深呼吸一次。
              <br />
              在心里默念一个此刻最想问的问题。
            </p>
          </header>

          <div className={`ritual-grid${isRevealed ? " is-revealed" : ""}`}>
            <aside className="ritual-guide">
              <p className="kicker">HOW IT WORKS</p>
              <ol className="steps">
                <li>
                  <span className="step-number">01</span>
                  <div>
                    <h3>静心</h3>
                    <p>把注意力从外面收回来，只留一个念头。</p>
                  </div>
                </li>
                <li>
                  <span className="step-number">02</span>
                  <div>
                    <h3>抽签</h3>
                    <p>轻触卡面。今日的签由日期决定，不重复抽取。</p>
                  </div>
                </li>
                <li>
                  <span className="step-number">03</span>
                  <div>
                    <h3>观照</h3>
                    <p>读一遍签文，只带走对你有用的那一句。</p>
                  </div>
                </li>
              </ol>

              <blockquote className="ritual-quote">
                “不求答案，只求看清。”
                <cite>— 星签</cite>
              </blockquote>
            </aside>

            <div className="card-stage">
              <span
                className="stage-orbit stage-orbit--one"
                aria-hidden="true"
              />
              <span
                className="stage-orbit stage-orbit--two"
                aria-hidden="true"
              />
              <span
                className="stage-glow"
                aria-hidden="true"
              />

              <button
                type="button"
                className={`fortune-card${isDrawing ? " is-drawing" : ""}${
                  isRevealed ? " is-revealed" : ""
                }`}
                onClick={handleDraw}
                aria-busy={isDrawing}
                aria-label={
                  isRevealed ? "查看今日签文" : "抽取今日签"
                }
              >
                <span className="card-inner">
                  <span
                    className="card-face card-back"
                    aria-hidden={isRevealed}
                  >
                    <span className="card-frame" aria-hidden="true" />
                    <span className="card-corner card-corner--tl" aria-hidden="true">
                      ✦
                    </span>
                    <span className="card-corner card-corner--tr" aria-hidden="true">
                      ✦
                    </span>
                    <span className="card-corner card-corner--bl" aria-hidden="true">
                      ✦
                    </span>
                    <span className="card-corner card-corner--br" aria-hidden="true">
                      ✦
                    </span>

                    <span className="card-back-inner">
                      <span className="card-back-kicker">
                        A DAILY RITUAL
                      </span>

                      <span className="card-emblem" aria-hidden="true">
                        <svg viewBox="0 0 180 180">
                          <circle
                            cx="90"
                            cy="90"
                            r="78"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.8"
                            opacity="0.6"
                          />
                          <circle
                            cx="90"
                            cy="90"
                            r="64"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.6"
                            strokeDasharray="1 7"
                            opacity="0.75"
                          />
                          <circle
                            cx="90"
                            cy="90"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.6"
                            opacity="0.45"
                          />
                          <path
                            d="M90 32l5.5 25.5L121 63l-25.5 5.5L90 94l-5.5-25.5L59 63l25.5-5.5z"
                            fill="currentColor"
                            opacity="0.9"
                          />
                          <path
                            d="M90 86l4 17.5L111.5 108 94 112l-4 17.5-4-17.5L68.5 108 86 103.5z"
                            fill="currentColor"
                            opacity="0.5"
                          />
                          <circle cx="90" cy="90" r="3" fill="currentColor" />
                          <circle cx="90" cy="14" r="1.8" fill="currentColor" opacity="0.7" />
                          <circle cx="166" cy="90" r="1.8" fill="currentColor" opacity="0.7" />
                          <circle cx="90" cy="166" r="1.8" fill="currentColor" opacity="0.7" />
                          <circle cx="14" cy="90" r="1.8" fill="currentColor" opacity="0.7" />
                        </svg>
                      </span>

                      <span className="card-back-title">星签</span>
                      <span className="card-back-sub">STELLAR ORACLE</span>
                      <span className="card-back-rule" aria-hidden="true" />
                      <span className="card-back-foot">
                        每日一签 · 只此一次
                      </span>
                    </span>
                  </span>

                  <span
                    className="card-face card-front"
                    aria-hidden={!isRevealed}
                  >
                    <span className="card-front-inner">
                      <span className="card-front-head">
                        <span>{formatFortuneNumber(fortune.id)}</span>
                        <span className="card-level">{fortune.level}</span>
                      </span>

                      <span className="card-front-main">
                        <span className="card-front-en">
                          {fortune.english}
                        </span>
                        <span className="card-front-title">
                          {fortune.title}
                        </span>
                        <span className="card-front-poem">
                          {fortune.poem.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </span>
                      </span>

                      <span className="card-front-foot">
                        <span>星签 · 每日一签</span>
                        <span className="card-seal" aria-hidden="true">
                          签
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </button>

              <p className="card-hint" aria-live="polite">
                {hint}
              </p>
            </div>

            <aside className="ritual-aside">
              <div className="mini-orbit" aria-hidden="true">
                <span className="mini-orbit-ring" />
                <span className="mini-orbit-dot" />
                <span className="mini-orbit-core">今日</span>
              </div>
              <p className="ritual-aside-title">
                一支签，
                <br />
                只回答今天。
              </p>
              <p className="ritual-aside-copy">
                今日抽过之后，签文会保留在这个浏览器里。明天零点，换一支新的。
              </p>
              <div className="ritual-meta">
                <span>{isRevealed ? formatFortuneNumber(fortune.id) : "NO. ??"}</span>
                <span className="ritual-meta-dot" aria-hidden="true" />
                <span>{isRevealed ? fortune.level : "待启"}</span>
              </div>
            </aside>
          </div>

          {isRevealed ? (
            <article
              id="reading"
              ref={readingRef}
              tabIndex={-1}
              className="reading-sheet"
              aria-labelledby="reading-title"
            >
              <div className="reading-top">
                <span className="reading-number">
                  {formatFortuneNumber(fortune.id)} / 36
                </span>
                <span className="reading-date">{dateLabel}</span>
                <span className="reading-level">
                  {fortune.level} · 五行属{fortune.element}
                </span>
              </div>

              <div className="reading-head">
                <div>
                  <p className="kicker">TODAY&apos;S SIGN</p>
                  <h2 id="reading-title">{fortune.title}</h2>
                  <p className="reading-english">{fortune.english}</p>
                </div>
                <div
                  className="reading-stamp"
                  aria-label={`今日关键词：${fortune.keyword}`}
                >
                  <span>{fortune.keyword}</span>
                </div>
              </div>

              <div className="reading-columns">
                <div className="reading-poem" aria-label="今日签诗">
                  {fortune.poem.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <div className="reading-copy">
                  <h3>
                    <span>解签</span>
                    <small>INTERPRETATION</small>
                  </h3>
                  <p>{fortune.interpretation}</p>
                  <blockquote>{fortune.guidance}</blockquote>
                </div>
              </div>

              <div className="reading-bottom">
                <div className="reading-tags">
                  <div className="reading-tag-row">
                    <span className="tag-label tag-label--yi">宜</span>
                    <div className="tag-list">
                      {fortune.yi.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="reading-tag-row">
                    <span className="tag-label tag-label--ji">忌</span>
                    <div className="tag-list">
                      {fortune.ji.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="reading-details">
                  <div>
                    <span>关键词</span>
                    <strong>{fortune.keyword}</strong>
                  </div>
                  <div>
                    <span>幸运色</span>
                    <strong>
                      <i
                        className="color-swatch"
                        style={{ backgroundColor: fortune.color.hex }}
                        aria-hidden="true"
                      />
                      {fortune.color.name}
                    </strong>
                  </div>
                  <div>
                    <span>数字</span>
                    <strong>{fortune.luckyNumber}</strong>
                  </div>
                  <div>
                    <span>五行</span>
                    <strong>{fortune.element}</strong>
                  </div>
                </div>
              </div>

              <div className="reading-actions">
                <button
                  type="button"
                  className="btn btn--ink"
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  {isSharing ? "正在分享…" : "分享今日签"}
                  <span aria-hidden="true">↗</span>
                </button>
                <Link href="/fortunes" className="text-link">
                  浏览三十六签 <span aria-hidden="true">→</span>
                </Link>
                <p>今日已抽 · 明日零点更新</p>
              </div>
            </article>
          ) : (
            <div className="reading-placeholder" aria-hidden="true">
              <span className="placeholder-rule" />
              <span>今日签文 · 等待显现</span>
              <span className="placeholder-rule" />
            </div>
          )}
        </div>
      </section>

      <section id="about" className="section about">
        <div className="container">
          <header className="section-heading">
            <span className="section-number">02</span>
            <div>
              <p className="kicker">ABOUT THE ORACLE</p>
              <h2>
                不是预言，<em>是一面镜子。</em>
              </h2>
            </div>
          </header>

          <div className="about-grid">
            <div className="about-visual" aria-hidden="true">
              <span className="about-orbit about-orbit--outer" />
              <span className="about-orbit about-orbit--inner" />
              <span className="about-orbit-dot" />
              <span className="about-seal">观</span>
              <span className="about-vertical">不预测命运 · 只照见此刻</span>
            </div>

            <div className="about-copy">
              <p className="about-lead">
                星签不告诉你“会发生什么”。它只提供一个停顿，让你看见自己正在想什么。
              </p>
              <p>
                三十六支签，是三十六种日常处境：出发、等待、回头、放下、连接、独处。
                每天只出现一支，不催促，也不替你作决定。你可以把它当成一段安静的提醒，
                或只是一张好看的卡片。
              </p>

              <div className="principles">
                <div>
                  <span>01</span>
                  <h3>每日一次</h3>
                  <p>克制，是仪式的一部分。今天抽过，就等明天。</p>
                </div>
                <div>
                  <span>02</span>
                  <h3>不收集身份</h3>
                  <p>无需登录。今日签只保存在你的浏览器里。</p>
                </div>
                <div>
                  <span>03</span>
                  <h3>仅供观照</h3>
                  <p>不制造恐惧，也不替代专业建议。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container closing-inner">
          <p className="kicker">TOMORROW, AGAIN</p>
          <h2>
            把今天，<em>留一点空白。</em>
          </h2>
          <p>签文会留在这里。明天零点，换一支新的。</p>
          <a href="#top" className="btn btn--ghost">
            回到顶部 <span aria-hidden="true">↑</span>
          </a>
        </div>
      </section>

      <div
        className={`toast${toast ? " is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}
