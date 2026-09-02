import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "実験 — RIO LAB",
  description: "クリエイティブコーディングとWeb技術の試行",
};

export default function ExperimentsPage() {
  return (
    <div className={styles.page}>
      <p className={styles.label}>Experiments</p>
      <h1 className={styles.title}>実験</h1>
      <p className={styles.body}>準備中です。</p>
    </div>
  );
}
