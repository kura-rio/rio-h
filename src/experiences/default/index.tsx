import type { ReactNode } from "react";
import Link from "next/link";
import type { Essay } from "@/domain/essay";
import styles from "./index.module.css";

export type EssayExperienceProps = {
  essay: Essay;
  children: ReactNode;
};

export function DefaultExperience({ essay, children }: EssayExperienceProps) {
  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <Link href="/essays" className={styles.back}>
          ← エッセイ一覧
        </Link>
        <h1 className={styles.title}>{essay.title}</h1>
        {essay.excerpt ? (
          <p className={styles.excerpt}>{essay.excerpt}</p>
        ) : null}
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  );
}
