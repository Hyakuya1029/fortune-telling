import Link from "next/link";

interface SiteHeaderProps {
  solid?: boolean;
}

export function SiteHeader({ solid = false }: SiteHeaderProps) {
  return (
    <header className={`site-header${solid ? " site-header--solid" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="星签首页">
          <span className="brand-mark" aria-hidden="true">
            签
          </span>
          <span className="brand-word">
            <span className="brand-zh">星签</span>
            <span className="brand-en">STELLAR ORACLE</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="主导航">
          <Link href="/#ritual">今日签</Link>
          <Link href="/fortunes">签文录</Link>
          <Link href="/#about">关于</Link>
        </nav>

        <p className="header-aside">
          <span className="status-dot" aria-hidden="true" />
          每日一签
          <span className="header-sep" aria-hidden="true" />
          仅此一次
        </p>
      </div>
    </header>
  );
}
