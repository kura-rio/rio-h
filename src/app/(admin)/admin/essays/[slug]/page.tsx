import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listExperiences } from "@/experiences/registry";
import { requireAdmin } from "@/lib/admin/auth";
import { updateEssayAction } from "@/lib/admin/essay-actions";
import { LocalFsEssayRepository } from "@/lib/essays/local-fs-repository";

export const dynamic = "force-dynamic";

type EditEssayPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({
  params,
}: EditEssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `編集 ${slug} — 管理画面 — RIO LAB` };
}

export default async function EditEssayPage({
  params,
  searchParams,
}: EditEssayPageProps) {
  await requireAdmin();

  const { slug } = await params;
  const { error } = await searchParams;
  const repository = new LocalFsEssayRepository();
  const essay = await repository.getBySlug(slug);

  if (!essay) {
    notFound();
  }

  const experiences = listExperiences();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          <Link href="/admin" className="text-foreground/60 hover:text-foreground">
            ← エッセイ一覧
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">エッセイを編集</h1>
        {essay.status === "published" ? (
          <p className="text-sm">
            <Link
              href={`/essays/${essay.slug}`}
              className="text-foreground/60 hover:text-foreground"
            >
              公開ページを見る →
            </Link>
          </p>
        ) : (
          <p className="text-sm text-foreground/50">
            下書き — 公開サイトには表示されません。
          </p>
        )}
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <form action={updateEssayAction} className="flex flex-col gap-5">
        <input type="hidden" name="originalSlug" value={essay.slug} />

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">タイトル</span>
          <input
            name="title"
            required
            defaultValue={essay.title}
            className="border border-foreground/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">スラッグ</span>
          <input
            name="slug"
            required
            defaultValue={essay.slug}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="border border-foreground/20 bg-transparent px-3 py-2 font-mono"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">ステータス</span>
          <select
            name="status"
            defaultValue={essay.status}
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
            defaultValue={essay.experienceId}
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
            defaultValue={essay.excerpt ?? ""}
            className="border border-foreground/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">公開日</span>
          <input
            name="publishedAt"
            type="date"
            defaultValue={essay.publishedAt ?? ""}
            className="border border-foreground/20 bg-transparent px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-foreground/70">本文（Markdown）</span>
          <textarea
            name="content"
            rows={16}
            defaultValue={essay.content}
            className="border border-foreground/20 bg-transparent px-3 py-2 font-mono text-sm"
          />
        </label>

        <button
          type="submit"
          className="self-start border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
        >
          保存
        </button>
      </form>
    </div>
  );
}
