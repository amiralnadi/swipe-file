import type { GitHubFile } from "./types";
import { auth } from "./auth";
import { getInstallationId, getInstallationToken } from "./github-app";

const isDev = process.env.NODE_ENV === "development";

export async function getUserContext(): Promise<{ token: string; owner: string } | null> {
  const session = await auth();
  if (!session?.githubUsername) return null;

  const installationId = await getInstallationId(session.githubUsername);
  if (!installationId) return null;

  const token = await getInstallationToken(installationId);
  return { token, owner: session.githubUsername };
}

export async function getAllFiles(): Promise<GitHubFile[]> {
  const ctx = await getUserContext();
  if (ctx) {
    const { readAllMarkdownFiles } = await import("./github");
    return readAllMarkdownFiles(ctx.token, ctx.owner);
  }
  if (isDev) {
    const { readLocalMarkdownFiles } = await import("./local-data");
    return readLocalMarkdownFiles();
  }
  return [];
}

export async function getFile(filename: string): Promise<GitHubFile & { _owner?: string; _token?: string }> {
  const ctx = await getUserContext();
  if (ctx) {
    const { readMarkdownFile } = await import("./github");
    const file = await readMarkdownFile(ctx.token, ctx.owner, filename);
    return { ...file, _owner: ctx.owner, _token: ctx.token };
  }
  if (isDev) {
    const { readLocalMarkdownFiles } = await import("./local-data");
    const files = readLocalMarkdownFiles();
    const file = files.find((f) => f.path.endsWith(filename));
    if (!file) throw new Error(`File not found: ${filename}`);
    return file;
  }
  throw new Error("Not authenticated");
}

export async function saveFile(filename: string, content: string, message: string, sha?: string): Promise<void> {
  const ctx = await getUserContext();
  if (ctx) {
    const { writeMarkdownFile } = await import("./github");
    return writeMarkdownFile(ctx.token, ctx.owner, filename, content, message, sha);
  }
  if (isDev) {
    const { writeLocalMarkdownFile } = await import("./local-data");
    writeLocalMarkdownFile(filename, content);
    return;
  }
  throw new Error("Not authenticated");
}
