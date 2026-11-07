import { FORTUNES, type Fortune, type FortuneLevel } from "@/data/fortunes";

export const FORTUNE_TIME_ZONE = "Asia/Shanghai";
export const FORTUNE_LEVELS: FortuneLevel[] = [
  "上上",
  "上吉",
  "中吉",
  "小吉",
  "平",
];

interface DateParts {
  year: number;
  month: number;
  day: number;
  weekday: string;
}

function getDateParts(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: FORTUNE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const weekday = new Intl.DateTimeFormat("zh-CN", {
    timeZone: FORTUNE_TIME_ZONE,
    weekday: "long",
  }).format(date);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    weekday,
  };
}

export function getDateKey(date = new Date()): string {
  const { year, month, day } = getDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getDailyFortuneIndex(date = new Date()): number {
  const { year, month, day } = getDateParts(date);
  const epochDay = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
  const index = (epochDay * 17 + 11) % FORTUNES.length;
  return ((index % FORTUNES.length) + FORTUNES.length) % FORTUNES.length;
}

export function getDailyFortune(date = new Date()): Fortune {
  return FORTUNES[getDailyFortuneIndex(date)];
}

export function getFortuneById(id: number): Fortune | undefined {
  return FORTUNES.find((fortune) => fortune.id === id);
}

export function getDateLabel(date = new Date()): string {
  const { year, month, day, weekday } = getDateParts(date);
  return `${year}年${month}月${day}日 · ${weekday}`;
}

export function getShortDate(date = new Date()): {
  month: string;
  day: string;
  year: string;
} {
  const parts = getDateParts(date);
  return {
    month: new Intl.DateTimeFormat("en-US", {
      timeZone: FORTUNE_TIME_ZONE,
      month: "short",
    })
      .format(date)
      .toUpperCase(),
    day: String(parts.day).padStart(2, "0"),
    year: String(parts.year),
  };
}

export function formatFortuneNumber(id: number): string {
  return `No. ${String(id).padStart(2, "0")}`;
}

export function getDrawStorageKey(dateKey: string): string {
  return `stellar-oracle:draw:${dateKey}`;
}

export function buildShareText(
  fortune: Fortune,
  dateLabel: string,
  url: string,
): string {
  return [
    `星签 · 每日一签`,
    dateLabel,
    `第 ${String(fortune.id).padStart(2, "0")} 签 · ${fortune.level}「${fortune.title}」`,
    "",
    fortune.poem.join(""),
    "",
    fortune.guidance,
    "",
    url,
  ].join("\n");
}
