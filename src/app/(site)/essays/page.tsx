import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedEssays } from "@/lib/essays/read";
import styles from "../essays.module.css";

export const metadata: Metadata = {
  title: "エッセイ — RIO LAB",
  description: "形式と思想の実験的な文章",
};

function formatDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  return value.replace(/-/g, ".");
}

export default async function EssaysPage() {
  const essays = await listPublishedEssays();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Essays</p>
        <h1 className={styles.title}>エッセイ</h1>
        <p className={styles.desc}>形式と思想の実験的な文章</p>
      </header>

      {essays.length === 0 ? (
        <p className={styles.empty}>まだ公開されたエッセイはありません。</p>
      ) : (
        <ul className={styles.list}>
          {essays.map((essay) => (
            <li key={essay.slug} className={styles.item}>
              <Link href={`/essays/${essay.slug}`} className={styles.link}>
                <span className={styles.linkTitle}>{essay.title}</span>
                {formatDate(essay.publishedAt) ? (
                  <span className={styles.meta}>{formatDate(essay.publishedAt)}</span>
                ) : null}
                {essay.excerpt ? (
                  <span className={styles.excerpt}>{essay.excerpt}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
