import Link from "next/link";
import { listPublishedEssays } from "@/lib/essays/read";
import styles from "./home.module.css";

export default async function Home() {
  const essays = await listPublishedEssays();
  const recent = essays.slice(0, 5);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.heroLabel}>Experimental Lab</p>
        <h1 className={styles.title}>RIO LAB</h1>
        <p className={styles.lead}>
          体験型ウェブエッセイとクリエイティブコーディングのラボ
        </p>
      </section>

      <section>
        <p className={styles.sectionLabel}>Modules</p>
        <ul className={styles.modules}>
          <li>
            <Link href="/essays" className={styles.moduleLink}>
              <span className={styles.moduleTitle}>エッセイ</span>
              <span className={styles.moduleDesc}>
                形式と思想の実験的な文章
              </span>
            </Link>
          </li>
          <li>
            <Link href="/experiments" className={styles.moduleLink}>
              <span className={styles.moduleTitle}>実験</span>
              <span className={styles.moduleDesc}>
                クリエイティブコーディングとWeb技術の試行
              </span>
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.moduleLink}>
              <span className={styles.moduleTitle}>について</span>
              <span className={styles.moduleDesc}>このラボについて</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className={styles.recent}>
        <p className={styles.sectionLabel}>Latest Essays</p>
        {recent.length === 0 ? (
          <p className={styles.empty}>まだ公開されたエッセイはありません。</p>
        ) : (
          <ul className={styles.recentList}>
            {recent.map((essay) => (
              <li key={essay.slug} className={styles.recentItem}>
                <Link
                  href={`/essays/${essay.slug}`}
                  className={styles.recentLink}
                >
                  <span className={styles.recentTitle}>{essay.title}</span>
                  {essay.excerpt ? (
                    <span className={styles.recentExcerpt}>{essay.excerpt}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
