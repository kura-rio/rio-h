import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedEssays } from "@/lib/essays/read";

export const metadata: Metadata = {
  title: "エッセイ — RIO LAB",
  description: "形式と思想の実験的な文章",
};

export default async function EssaysPage() {
  const essays = await listPublishedEssays();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          エッセイ
        </h1>
        <p className="text-foreground/70">形式と思想の実験的な文章</p>
      </div>

      {essays.length === 0 ? (
        <p className="text-foreground/70">まだ公開されたエッセイはありません。</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {essays.map((essay) => (
            <li key={essay.slug}>
              <Link href={`/essays/${essay.slug}`} className="group block">
                <span className="font-medium text-foreground group-hover:underline">
                  {essay.title}
                </span>
                {essay.excerpt ? (
                  <span className="mt-1 block text-sm text-foreground/60">
                    {essay.excerpt}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
