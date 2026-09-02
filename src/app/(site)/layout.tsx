import type { ReactNode } from "react";
import Link from "next/link";
import shell from "./site-shell.module.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={shell.siteRoot}>
      <header className={shell.header}>
        <div className={shell.headerInner}>
          <p className={shell.brand}>
            <Link href="/" className={shell.brandLink}>
              RIO LAB
            </Link>
          </p>
          <nav aria-label="メインナビゲーション" className={shell.nav}>
            <Link href="/" className={shell.navLink}>
              ホーム
            </Link>
            <Link href="/essays" className={shell.navLink}>
              エッセイ
            </Link>
            <Link href="/experiments" className={shell.navLink}>
              実験
            </Link>
            <Link href="/about" className={shell.navLink}>
              について
            </Link>
          </nav>
        </div>
      </header>
      <main className={shell.main}>{children}</main>
    </div>
  );
}
