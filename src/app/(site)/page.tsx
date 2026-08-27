import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          RIO LAB
        </h1>
        <p className="text-lg leading-relaxed text-foreground/70">
          体験型ウェブエッセイとクリエイティブコーディングのラボ
        </p>
      </div>

      <ul className="flex flex-col gap-6 text-base">
        <li>
          <Link href="/essays" className="group block">
            <span className="font-medium text-foreground group-hover:underline">
              エッセイ
            </span>
            <span className="mt-1 block text-sm text-foreground/60">
              形式と思想の実験的な文章
            </span>
          </Link>
        </li>
        <li>
          <Link href="/experiments" className="group block">
            <span className="font-medium text-foreground group-hover:underline">
              実験
            </span>
            <span className="mt-1 block text-sm text-foreground/60">
              クリエイティブコーディングとWeb技術の試行
            </span>
          </Link>
        </li>
        <li>
          <Link href="/about" className="group block">
            <span className="font-medium text-foreground group-hover:underline">
              について
            </span>
            <span className="mt-1 block text-sm text-foreground/60">
              このラボについて
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
