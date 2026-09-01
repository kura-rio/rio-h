import "server-only";

import { parseEssay, type Essay } from "@/domain/essay";
import type { EssayRepository } from "@/lib/essays/repository";

const CONTENT_DIR = "content/essays";

export class EssayStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EssayStorageError";
  }
}

type GitHubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

type GitHubContentFile = {
  type: "file";
  name: string;
  path: string;
  sha: string;
  content?: string;
  encoding?: string;
};

type GitHubContentDirEntry = {
  type: string;
  name: string;
  path: string;
  sha: string;
};

function readConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN?.trim();
  const owner = process.env.GITHUB_OWNER?.trim();
  const repo = process.env.GITHUB_REPO?.trim();
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";

  if (!token || !owner || !repo) {
    throw new EssayStorageError(
      "GitHub 連携の設定が不足しています。GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO を確認してください。",
    );
  }

  return { token, owner, repo, branch };
}

function filePath(slug: string): string {
  return `${CONTENT_DIR}/${slug}.json`;
}

function encodeContent(essay: Essay): string {
  const body = `${JSON.stringify(essay, null, 2)}\n`;
  return Buffer.from(body, "utf8").toString("base64");
}

function decodeContent(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf8");
}

async function githubFetch(
  config: GitHubConfig,
  pathWithQuery: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${pathWithQuery}`;

  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${config.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new EssayStorageError(
      "GitHub への接続に失敗しました。ネットワーク状態を確認してください。",
    );
  }
}

function throwForStatus(status: number, action: string): never {
  if (status === 401 || status === 403) {
    throw new EssayStorageError(
      "GitHub 認証に失敗しました。トークンとリポジトリ権限を確認してください。",
    );
  }
  if (status === 404) {
    throw new EssayStorageError(
      `GitHub 上に対象が見つかりませんでした（${action}）。`,
    );
  }
  if (status === 409 || status === 422) {
    throw new EssayStorageError(
      "GitHub への保存が競合しました。しばらくしてから再度お試しください。",
    );
  }
  if (status === 429) {
    throw new EssayStorageError(
      "GitHub API の利用上限に達しました。しばらくしてから再度お試しください。",
    );
  }
  throw new EssayStorageError(
    `GitHub への${action}に失敗しました。時間をおいて再度お試しください。`,
  );
}

export class GitHubEssayRepository implements EssayRepository {
  async getAll(): Promise<Essay[]> {
    const config = readConfig();
    const response = await githubFetch(
      config,
      `${CONTENT_DIR}?ref=${encodeURIComponent(config.branch)}`,
    );

    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      throwForStatus(response.status, "一覧取得");
    }

    const entries = (await response.json()) as GitHubContentDirEntry[];
    if (!Array.isArray(entries)) {
      throw new EssayStorageError("GitHub の一覧形式が不正です。");
    }

    const essays: Essay[] = [];

    for (const entry of entries) {
      if (entry.type !== "file" || !entry.name.endsWith(".json")) {
        continue;
      }

      const slug = entry.name.replace(/\.json$/, "");
      const essay = await this.getBySlug(slug);
      if (essay) {
        essays.push(essay);
      }
    }

    return essays.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  async getBySlug(slug: string): Promise<Essay | null> {
    const config = readConfig();
    const response = await githubFetch(
      config,
      `${filePath(slug)}?ref=${encodeURIComponent(config.branch)}`,
    );

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throwForStatus(response.status, "取得");
    }

    const file = (await response.json()) as GitHubContentFile;
    if (!file.content) {
      throw new EssayStorageError("GitHub から本文を取得できませんでした。");
    }

    try {
      const raw = decodeContent(file.content.replace(/\n/g, ""));
      return parseEssay(JSON.parse(raw));
    } catch {
      throw new EssayStorageError(
        "GitHub 上のエッセイデータ形式が不正です。",
      );
    }
  }

  async save(essay: Essay): Promise<void> {
    const config = readConfig();
    const path = filePath(essay.slug);
    const existingSha = await this.getFileSha(config, path);

    const response = await githubFetch(config, path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `content(essays): update ${essay.slug}`,
        content: encodeContent(essay),
        branch: config.branch,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    });

    if (!response.ok) {
      throwForStatus(response.status, "保存");
    }
  }

  async delete(slug: string): Promise<void> {
    const config = readConfig();
    const path = filePath(slug);
    const sha = await this.getFileSha(config, path);

    if (!sha) {
      return;
    }

    const response = await githubFetch(config, path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `content(essays): delete ${slug}`,
        sha,
        branch: config.branch,
      }),
    });

    if (response.status === 404) {
      return;
    }
    if (!response.ok) {
      throwForStatus(response.status, "削除");
    }
  }

  private async getFileSha(
    config: GitHubConfig,
    path: string,
  ): Promise<string | null> {
    const response = await githubFetch(
      config,
      `${path}?ref=${encodeURIComponent(config.branch)}`,
    );

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throwForStatus(response.status, "取得");
    }

    const file = (await response.json()) as GitHubContentFile;
    return file.sha ?? null;
  }
}
