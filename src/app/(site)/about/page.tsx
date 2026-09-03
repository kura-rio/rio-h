import type { Metadata } from "next";
import styles from "../site-page.module.css";
import { WindowFrame } from "../site-window";

export const metadata: Metadata = {
  title: "について — RIO LAB",
  description: "RIO LABについて",
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <WindowFrame title="About.exe" subtitle="について" titleId="about-title">
        <p className={styles.body}>
          RIO LAB
          は、体験型ウェブエッセイとクリエイティブコーディングのための個人ラボです。続報をお楽しみに。
        </p>
      </WindowFrame>
    </div>
  );
}
