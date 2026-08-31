import "server-only";

import type { EssayRepository } from "@/lib/essays/repository";
import { LocalFsEssayRepository } from "@/lib/essays/local-fs-repository";
import { GitHubEssayRepository } from "@/lib/essays/github-repository";

export type EssayRepositoryKind = "fs" | "github";

export function getEssayRepositoryKind(): EssayRepositoryKind {
  const raw = process.env.ESSAY_REPOSITORY?.trim().toLowerCase();
  if (raw === "github") {
    return "github";
  }
  return "fs";
}

export function createEssayRepository(): EssayRepository {
  if (getEssayRepositoryKind() === "github") {
    return new GitHubEssayRepository();
  }
  return new LocalFsEssayRepository();
}
