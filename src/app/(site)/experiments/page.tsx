import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "実験 — RIO LAB",
  description: "クリエイティブコーディングとWeb技術の試行",
};

export default function ExperimentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        実験
      </h1>
      <p className="text-foreground/70">準備中です。</p>
    </div>
  );
}
