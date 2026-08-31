import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { createEssayAction } from "@/lib/admin/essay-actions";
import { listExperiences } from "@/experiences/registry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "新規エッセイ — 管理画面 — RIO LAB",
};

type NewEssayPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewEssayPage({ searchParams }: NewEssayPageProps) {
  await requireAdmin();

  const { error } = await searchParams;
  const experiences = listExperiences();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          <Link href="/admin" className="text-foreground/60 hover:text-foreground">
            ← エッセイ一覧
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">新規エッセイ</h1>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <form action={createEssayAction} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">タイトル</span>
          <input
            name="title"
            required
            className="border border-foreground/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">スラッグ</span>
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="my-essay"
            className="border border-foreground/20 bg-transparent px-3 py-2 font-mono"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">ステータス</span>
          <select
            name="status"
            defaultValue="draft"
            className="border border-foreground/20 bg-transparent px-3 py-2"
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">体験（Experience）</span>
          <select
            name="experienceId"
            defaultValue="default"
            className="border border-foreground/20 bg-transparent px-3 py-2"
          >
            {experiences.map((experience) => (
              <option key={experience.id} value={experience.id}>
                {experience.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">抜粋</span>
          <input
            name="excerpt"
            className="border border-foreground/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">公開日</span>
          <input
            name="publishedAt"
            type="date"
            className="border border-foreground/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">本文（Markdown）</span>
          <textarea
            name="content"
            rows={16}
            className="border border-foreground/20 bg-transparent px-3 py-2 font-mono text-sm"
          />
        </label>

        <button
          type="submit"
          className="self-start border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
        >
          作成
        </button>
      </form>
    </div>
  );
}
