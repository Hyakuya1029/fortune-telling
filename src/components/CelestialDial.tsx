interface CelestialDialProps {
  month: string;
  day: string;
  year: string;
}

const BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function CelestialDial({ month, day, year }: CelestialDialProps) {
  const ticks = Array.from({ length: 60 }, (_, index) => {
    const angle = (index / 60) * Math.PI * 2 - Math.PI / 2;
    const inner = index % 5 === 0 ? 254 : 264;
    return {
      x1: round(300 + Math.cos(angle) * inner),
      y1: round(300 + Math.sin(angle) * inner),
      x2: round(300 + Math.cos(angle) * 274),
      y2: round(300 + Math.sin(angle) * 274),
      strong: index % 5 === 0,
    };
  });

  const branches = BRANCHES.map((branch, index) => {
    const angle = (index / BRANCHES.length) * Math.PI * 2 - Math.PI / 2;
    return {
      branch,
      x: round(300 + Math.cos(angle) * 225),
      y: round(300 + Math.sin(angle) * 225),
    };
  });

  return (
    <svg
      className="celestial-dial"
      viewBox="0 0 600 600"
      role="img"
      aria-labelledby="dial-title dial-desc"
    >
      <title id="dial-title">今日星盘</title>
      <desc id="dial-desc">
        {year} 年 {month} 月 {day} 日的装饰星盘，中心显示今日日期。
      </desc>
      <defs>
        <radialGradient id="dial-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1d2b3e" stopOpacity="0.92" />
          <stop offset="62%" stopColor="#0c1420" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#070b12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dial-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f2ddb0" />
          <stop offset="45%" stopColor="#c9a96c" />
          <stop offset="100%" stopColor="#8e6f3e" />
        </linearGradient>
        <filter id="dial-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="crescent-mask">
          <rect width="600" height="600" fill="white" />
          <circle cx="400" cy="198" r="32" fill="black" />
        </mask>
      </defs>

      <circle cx="300" cy="300" r="292" className="dial-ring dial-ring--outer" />
      <circle
        cx="300"
        cy="300"
        r="281"
        className="dial-ring dial-ring--dashed"
      />
      <circle cx="300" cy="300" r="246" className="dial-ring" />

      <g className="dial-spin-slow">
        {ticks.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            className={
              tick.strong ? "dial-tick dial-tick--strong" : "dial-tick"
            }
          />
        ))}
      </g>

      <circle
        cx="300"
        cy="300"
        r="225"
        className="dial-ring dial-ring--dotted"
      />

      <g className="dial-spin-reverse">
        {branches.map(({ branch, x, y }) => (
          <text
            key={branch}
            x={x}
            y={y}
            className="dial-branch"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {branch}
          </text>
        ))}
      </g>

      <path
        d="M48 300h16M536 300h16M300 48v16M300 536v16"
        className="dial-axis"
      />
      <circle cx="300" cy="300" r="195" className="dial-ring" />
      <circle
        cx="300"
        cy="300"
        r="150"
        className="dial-ring dial-ring--faint"
      />
      <circle cx="300" cy="300" r="130" fill="url(#dial-core)" />

      <circle
        cx="374"
        cy="220"
        r="40"
        fill="url(#dial-gold)"
        opacity="0.72"
        mask="url(#crescent-mask)"
      />

      <g className="dial-orbit">
        <circle cx="300" cy="58" r="9" className="dial-orbit-glow" />
        <circle
          cx="300"
          cy="58"
          r="3.5"
          fill="url(#dial-gold)"
          filter="url(#dial-glow)"
        />
      </g>

      <path
        d="M300 154l4.5 14.5L319 173l-14.5 4.5L300 192l-4.5-14.5L281 173l14.5-4.5z"
        fill="url(#dial-gold)"
        opacity="0.7"
      />

      <text x="300" y="268" className="dial-label" textAnchor="middle">
        TODAY
      </text>
      <text x="300" y="330" className="dial-day" textAnchor="middle">
        {day}
      </text>
      <text x="300" y="365" className="dial-month" textAnchor="middle">
        {month} · {year}
      </text>
      <line x1="262" y1="386" x2="338" y2="386" className="dial-rule" />
      <text x="300" y="411" className="dial-caption" textAnchor="middle">
        每日一签 · 只此一次
      </text>
    </svg>
  );
}
