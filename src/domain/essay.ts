export type EssayStatus = "draft" | "published";

export type Essay = {
  title: string;
  slug: string;
  status: EssayStatus;
  experienceId: string;
  content: string;
  excerpt?: string;
  publishedAt?: string | null;
  config?: Record<string, unknown>;
};

export function isEssayStatus(value: unknown): value is EssayStatus {
  return value === "draft" || value === "published";
}

export function parseEssay(data: unknown): Essay | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (
    typeof record.title !== "string" ||
    typeof record.slug !== "string" ||
    !isEssayStatus(record.status) ||
    typeof record.experienceId !== "string" ||
    typeof record.content !== "string"
  ) {
    return null;
  }

  const essay: Essay = {
    title: record.title,
    slug: record.slug,
    status: record.status,
    experienceId: record.experienceId,
    content: record.content,
  };

  if (typeof record.excerpt === "string") {
    essay.excerpt = record.excerpt;
  }

  if (record.publishedAt === null || typeof record.publishedAt === "string") {
    essay.publishedAt = record.publishedAt;
  }

  if (
    record.config !== undefined &&
    record.config !== null &&
    typeof record.config === "object" &&
    !Array.isArray(record.config)
  ) {
    essay.config = record.config as Record<string, unknown>;
  }

  return essay;
}
