import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark brand-mark--small" aria-hidden="true">
            签
          </span>
          <div>
            <p className="footer-name">星签 · STELLAR ORACLE</p>
            <p className="footer-domain">fortune.hyakuya.cc.cd</p>
          </div>
        </div>

        <p className="footer-note">
          不预测命运，只提供一面镜子。原创内容，仅供观照与娱乐。
          <br />
          不构成决策建议。
        </p>

        <div className="footer-links">
          <Link href="/fortunes">签文录</Link>
          <Link href="/#about">关于</Link>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} 星签</span>
        <span>MADE FOR QUIET MOMENTS</span>
      </div>
    </footer>
  );
}
