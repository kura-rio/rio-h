import type { Essay } from "@/domain/essay";
import { LocalFsEssayRepository } from "@/lib/essays/local-fs-repository";

const repository = new LocalFsEssayRepository();

export async function listPublishedEssays(): Promise<Essay[]> {
  const essays = await repository.getAll();
  return essays.filter((essay) => essay.status === "published");
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
