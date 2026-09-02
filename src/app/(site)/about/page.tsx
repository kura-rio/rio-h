import type { Metadata } from "next";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "について — RIO LAB",
  description: "RIO LABについて",
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <p className={styles.label}>About</p>
      <h1 className={styles.title}>について</h1>
      <p className={styles.body}>
        RIO LAB
        は、体験型ウェブエッセイとクリエイティブコーディングのための個人ラボです。続報をお楽しみに。
      </p>
    </div>
  );
}
