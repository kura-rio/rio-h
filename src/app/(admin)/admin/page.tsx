import type { Metadata } from "next";
import Link from "next/link";
import type { Essay } from "@/domain/essay";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createEssayRepository,
  getEssayRepositoryKind,
} from "@/lib/essays/create-repository";
import { EssayStorageError } from "@/lib/essays/github-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "管理画面 — RIO LAB",
};

type AdminPageProps = {
  searchParams: Promise<{ error?: string }>;
};

function statusLabel(status: string): string {
  return status === "published" ? "公開" : "下書き";
}

function storageHint(): string {
  if (getEssayRepositoryKind() === "github") {
    return "保存先: GitHub（content/essays）。公開反映は自動デプロイ後です。";
  }
  return "保存先: ローカルファイル — content/essays";
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();

  const { error } = await searchParams;
  const repository = createEssayRepository();

  let essays: Essay[] = [];
  let loadError: string | undefined;

  try {
    essays = await repository.getAll();
  } catch (caught) {
    essays = [];
    loadError =
      caught instanceof EssayStorageError
        ? caught.message
        : "一覧の取得に失敗しました。時間をおいて再度お試しください。";
  }

  const displayError = error ?? loadError;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">エッセイ</h1>
          <p className="text-sm text-foreground/60">{storageHint()}</p>
        </div>
        <Link
          href="/admin/essays/new"
          className="border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
        >
          新規作成
        </Link>
      </div>

      {displayError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {displayError}
        </p>
      ) : null}

      {essays.length === 0 && !loadError ? (
        <p className="text-foreground/70">エッセイはまだありません。</p>
      ) : null}

      {essays.length > 0 ? (
        <ul className="flex flex-col divide-y divide-foreground/10 border-y border-foreground/10">
          {essays.map((essay) => (
            <li
              key={essay.slug}
              className="flex flex-wrap items-baseline justify-between gap-3 py-4"
            >
              <div className="flex flex-col gap-1">
                <Link
                  href={`/admin/essays/${essay.slug}`}
                  className="font-medium hover:underline"
                >
                  {essay.title}
                </Link>
                <p className="text-xs text-foreground/50">
                  {essay.slug} · {statusLabel(essay.status)} ·{" "}
                  {essay.experienceId}
                </p>
              </div>
              <Link
                href={`/admin/essays/${essay.slug}`}
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                編集
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
