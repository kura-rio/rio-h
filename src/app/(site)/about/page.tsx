import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "について — RIO LAB",
  description: "RIO LABについて",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        について
      </h1>
      <p className="leading-relaxed text-foreground/70">
        RIO LAB
        は、体験型ウェブエッセイとクリエイティブコーディングのための個人ラボです。続報をお楽しみに。
      </p>
    </div>
  );
}
