import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedEssays } from "@/lib/essays/read";
import styles from "../site-page.module.css";
import { WindowFrame, windowStyles } from "../site-window";

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
      <WindowFrame title="Essays" subtitle="エッセイ" titleId="essays-title">
        <p className={styles.desc}>形式と思想の実験的な文章</p>

        {essays.length === 0 ? (
          <p className={styles.empty}>まだ公開されたエッセイはありません。</p>
        ) : (
          <ul className={styles.folderGrid}>
            {essays.map((essay) => (
              <li key={essay.slug}>
                <Link href={`/essays/${essay.slug}`} className={windowStyles.folderCard}>
                  <span className={windowStyles.tag}>Essay</span>
                  <span className={windowStyles.folderIcon} aria-hidden="true">
                    ✎
                  </span>
                  <span className={windowStyles.folderBody}>
                    <span className={windowStyles.folderTitle}>{essay.title}</span>
                    {formatDate(essay.publishedAt) ? (
                      <span className={windowStyles.folderMeta}>
                        {formatDate(essay.publishedAt)}
                      </span>
                    ) : null}
                    {essay.excerpt ? (
                      <span className={windowStyles.folderMeta}>{essay.excerpt}</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </WindowFrame>
    </div>
  );
}
