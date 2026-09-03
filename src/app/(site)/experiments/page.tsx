import type { Metadata } from "next";
import styles from "../site-page.module.css";
import { WindowFrame } from "../site-window";

export const metadata: Metadata = {
  title: "実験 — RIO LAB",
  description: "クリエイティブコーディングとWeb技術の試行",
};

export default function ExperimentsPage() {
  return (
    <div className={styles.page}>
      <WindowFrame title="Experiments.exe" subtitle="実験" titleId="experiments-title">
        <p className={styles.body}>準備中です。</p>
      </WindowFrame>
    </div>
  );
}
