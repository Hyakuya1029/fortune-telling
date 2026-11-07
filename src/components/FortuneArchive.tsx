"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import {
  FORTUNE_LEVELS,
  formatFortuneNumber,
} from "@/lib/daily";
import type { Fortune, FortuneLevel } from "@/data/fortunes";

type Filter = "全部" | FortuneLevel;

interface FortuneArchiveProps {
  fortunes: Fortune[];
}

const FILTERS: Filter[] = ["全部", ...FORTUNE_LEVELS];

export function FortuneArchive({ fortunes }: FortuneArchiveProps) {
  const [filter, setFilter] = useState<Filter>("全部");
  const [openId, setOpenId] = useState<number | null>(null);
  const hasMounted = useRef(false);

  const visibleFortunes = useMemo(
    () =>
      filter === "全部"
        ? fortunes
        : fortunes.filter((fortune) => fortune.level === filter),
    [filter, fortunes],
  );

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const grid = document.getElementById("archive-grid");
    if (!grid) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    grid.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [filter]);

  const countFor = (item: Filter) =>
    item === "全部"
      ? fortunes.length
      : fortunes.filter((fortune) => fortune.level === item).length;

  return (
    <div className="archive-content">
      <div className="archive-toolbar">
        <div className="filter-row" role="group" aria-label="按签的等级筛选">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-chip${filter === item ? " is-active" : ""}`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
              <span>{countFor(item)}</span>
            </button>
          ))}
        </div>
        <p className="archive-count" aria-live="polite">
          正在显示 <strong>{visibleFortunes.length}</strong> 支签
        </p>
      </div>

      <div id="archive-grid" className="archive-grid">
        {visibleFortunes.map((fortune) => {
          const isOpen = openId === fortune.id;
          const bodyId = `fortune-body-${fortune.id}`;
          const cardStyle = {
            "--fortune-color": fortune.color.hex,
          } as CSSProperties;

          return (
            <article
              key={fortune.id}
              className={`archive-card${isOpen ? " is-open" : ""}`}
              style={cardStyle}
            >
              <button
                type="button"
                className="archive-card-trigger"
                onClick={() => setOpenId(isOpen ? null : fortune.id)}
                aria-expanded={isOpen}
                aria-controls={bodyId}
              >
                <span className="archive-card-top">
                  <span className="archive-card-number">
                    {formatFortuneNumber(fortune.id)}
                  </span>
                  <span className="archive-card-level">{fortune.level}</span>
                </span>

                <span className="archive-card-title">{fortune.title}</span>
                <span className="archive-card-en">{fortune.english}</span>

                <span className="archive-card-poem">
                  {fortune.poem.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>

                <span className="archive-card-foot">
                  <span className="archive-card-keyword">
                    <i aria-hidden="true" />
                    {fortune.keyword}
                  </span>
                  <span className="archive-card-toggle">
                    <span>{isOpen ? "收起解签" : "展开解签"}</span>
                    <i className="archive-card-toggle-icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </i>
                  </span>
                </span>
              </button>

              {isOpen ? (
                <div id={bodyId} className="archive-card-body">
                  <div className="archive-body-copy">
                    <p className="archive-body-kicker">
                      SIGN NOTES · {formatFortuneNumber(fortune.id)}
                    </p>
                    <p>{fortune.interpretation}</p>
                    <blockquote>{fortune.guidance}</blockquote>
                  </div>

                  <div className="archive-body-meta">
                    <div className="archive-tag-row">
                      <span className="tag-label tag-label--yi">宜</span>
                      <div className="tag-list">
                        {fortune.yi.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className="archive-tag-row">
                      <span className="tag-label tag-label--ji">忌</span>
                      <div className="tag-list">
                        {fortune.ji.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className="archive-detail-row">
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
                    <div className="archive-detail-row">
                      <span>数字 / 五行</span>
                      <strong>
                        {fortune.luckyNumber} · {fortune.element}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
