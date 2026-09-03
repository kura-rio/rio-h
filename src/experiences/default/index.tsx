import type { ReactNode } from "react";
import Link from "next/link";
import type { Essay } from "@/domain/essay";
import pageStyles from "@/app/(site)/site-page.module.css";
import { WindowFrame, windowStyles } from "@/app/(site)/site-window";
import styles from "./index.module.css";

export type EssayExperienceProps = {
  essay: Essay;
  children: ReactNode;
};

export function DefaultExperience({ essay, children }: EssayExperienceProps) {
  return (
    <div className={pageStyles.page}>
      <WindowFrame title={`${essay.slug}.txt`} subtitle={essay.title} titleId="essay-title">
        <header className={styles.header}>
          <Link
            href="/essays"
            className={`${windowStyles.ctaPill} ${windowStyles.ctaPillCompact}`}
          >
            ← エッセイ一覧
          </Link>
          {essay.excerpt ? <p className={styles.excerpt}>{essay.excerpt}</p> : null}
        </header>
        <div className={styles.body}>{children}</div>
      </WindowFrame>
    </div>
  );
}
