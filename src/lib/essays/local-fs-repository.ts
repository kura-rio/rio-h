import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { parseEssay, type Essay } from "@/domain/essay";
import type { EssayRepository } from "@/lib/essays/repository";

const ESSAYS_DIR = path.join(process.cwd(), "content", "essays");

function essayPath(slug: string): string {
  return path.join(ESSAYS_DIR, `${slug}.json`);
}

export class LocalFsEssayRepository implements EssayRepository {
  async getAll(): Promise<Essay[]> {
    await fs.mkdir(ESSAYS_DIR, { recursive: true });

    const entries = await fs.readdir(ESSAYS_DIR);
    const essays: Essay[] = [];

    for (const entry of entries) {
      if (!entry.endsWith(".json")) {
        continue;
      }

      const raw = await fs.readFile(path.join(ESSAYS_DIR, entry), "utf8");
      const essay = parseEssay(JSON.parse(raw));

      if (essay) {
        essays.push(essay);
      }
    }

    return essays.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  async getBySlug(slug: string): Promise<Essay | null> {
    try {
      const raw = await fs.readFile(essayPath(slug), "utf8");
      return parseEssay(JSON.parse(raw));
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return null;
      }
      throw error;
    }
  }

  async save(essay: Essay): Promise<void> {
    await fs.mkdir(ESSAYS_DIR, { recursive: true });
    await fs.writeFile(
      essayPath(essay.slug),
      `${JSON.stringify(essay, null, 2)}\n`,
      "utf8",
    );
  }

  async delete(slug: string): Promise<void> {
    try {
      await fs.unlink(essayPath(slug));
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return;
      }
      throw error;
    }
  }
}
