import type { Essay } from "@/domain/essay";
import { LocalFsEssayRepository } from "@/lib/essays/local-fs-repository";

const repository = new LocalFsEssayRepository();

function sortByPublishedAt(essays: Essay[]): Essay[] {
  return [...essays].sort((a, b) => {
    const dateA = a.publishedAt ?? "";
    const dateB = b.publishedAt ?? "";

    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }

    return a.slug.localeCompare(b.slug);
  });
}

export async function listPublishedEssays(): Promise<Essay[]> {
  const essays = await repository.getAll();
  return sortByPublishedAt(
    essays.filter((essay) => essay.status === "published"),
  );
}

export async function getPublishedEssay(
  slug: string,
): Promise<Essay | null> {
  const essay = await repository.getBySlug(slug);

  if (!essay || essay.status !== "published") {
    return null;
  }

  return essay;
}
