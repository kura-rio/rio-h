import type { ReactNode } from "react";
import Link from "next/link";
import { LabWidgets } from "./lab-widgets";
import shell from "./site-shell.module.css";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={shell.siteRoot}>
      <LabWidgets />
      <header className={shell.header}>
        <div className={shell.headerPanel}>
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
        </div>
      </header>
      <main className={shell.main}>{children}</main>
    </div>
  );
}
