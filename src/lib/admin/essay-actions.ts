"use server";

import { redirect } from "next/navigation";
import {
  isEssayStatus,
  type Essay,
  type EssayStatus,
} from "@/domain/essay";
import { requireAdmin } from "@/lib/admin/auth";
import { LocalFsEssayRepository } from "@/lib/essays/local-fs-repository";

const repository = new LocalFsEssayRepository();

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function buildEssayFromForm(
  formData: FormData,
  existing?: Essay | null,
): { essay?: Essay; error?: string } {
  const title = readField(formData, "title");
  const slugInput = readField(formData, "slug");
  const slug = slugify(slugInput);
  const statusRaw = readField(formData, "status") || "draft";
  const experienceId = readField(formData, "experienceId") || "default";
  const content = String(formData.get("content") ?? "");
  const excerpt = readField(formData, "excerpt");
  const publishedAtInput = readField(formData, "publishedAt");

  if (!title) {
    return { error: "タイトルは必須です。" };
  }
  if (!slug) {
    return {
      error: "スラッグは必須です（半角英数字とハイフンのみ）。",
    };
  }
  if (!isEssayStatus(statusRaw)) {
    return { error: "ステータスが不正です。" };
  }

  const status: EssayStatus = statusRaw;
  let publishedAt: string | null =
    publishedAtInput.length > 0 ? publishedAtInput : null;

  if (status === "published" && !publishedAt) {
    publishedAt = existing?.publishedAt || todayDate();
  }

  const essay: Essay = {
    title,
    slug,
    status,
    experienceId,
    content,
    excerpt: excerpt || undefined,
    publishedAt,
  };

  if (existing?.config) {
    essay.config = existing.config;
  }

  return { essay };
}

export async function createEssayAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const { essay, error } = buildEssayFromForm(formData);
  if (error || !essay) {
    redirect(
      `/admin/essays/new?error=${encodeURIComponent(error ?? "入力内容が不正です。")}`,
    );
  }

  const existing = await repository.getBySlug(essay.slug);
  if (existing) {
    redirect(
      `/admin/essays/new?error=${encodeURIComponent(
        `スラッグ「${essay.slug}」はすでに使われています。`,
      )}`,
    );
  }

  await repository.save(essay);
  redirect(`/admin/essays/${essay.slug}`);
}

export async function updateEssayAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const originalSlug = readField(formData, "originalSlug");
  if (!originalSlug) {
    redirect(
      `/admin?error=${encodeURIComponent("元のスラッグが見つかりません。")}`,
    );
  }

  const existing = await repository.getBySlug(originalSlug);
  if (!existing) {
    redirect(
      `/admin?error=${encodeURIComponent("エッセイが見つかりません。")}`,
    );
  }

  const { essay, error } = buildEssayFromForm(formData, existing);
  if (error || !essay) {
    redirect(
      `/admin/essays/${originalSlug}?error=${encodeURIComponent(
        error ?? "入力内容が不正です。",
      )}`,
    );
  }

  if (essay.slug !== originalSlug) {
    const conflict = await repository.getBySlug(essay.slug);
    if (conflict) {
      redirect(
        `/admin/essays/${originalSlug}?error=${encodeURIComponent(
          `スラッグ「${essay.slug}」はすでに使われています。`,
        )}`,
      );
    }
    await repository.save(essay);
    await repository.delete(originalSlug);
  } else {
    await repository.save(essay);
  }

  redirect(`/admin/essays/${essay.slug}`);
}
