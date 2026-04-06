import type { GitHubFile } from "./types";
import { auth } from "./auth";

/**
 * Get the current user's GitHub token and username from the session.
 * Returns null if not authenticated.
 */
export async function getUserContext(): Promise<{ token: string; owner: string } | null> {
  const session = await auth();
  if (!session?.accessToken || !session?.githubUsername) return null;
  return { token: session.accessToken, owner: session.githubUsername };
}

/**
 * Read all MD files. Uses GitHub API with user's token if authenticated,
 * falls back to local filesystem for unauthenticated/dev mode.
 */
export async function getAllFiles(): Promise<GitHubFile[]> {
  const ctx = await getUserContext();
  if (ctx) {
    const { readAllMarkdownFiles } = await import("./github");
    return readAllMarkdownFiles(ctx.token, ctx.owner);
  }
  // Fallback: local files for dev/unauthenticated
  const { readLocalMarkdownFiles } = await import("./local-data");
  return readLocalMarkdownFiles();
}

export async function getFile(filename: string): Promise<GitHubFile & { _owner?: string; _token?: string }> {
  const ctx = await getUserContext();
  if (ctx) {
    const { readMarkdownFile } = await import("./github");
    const file = await readMarkdownFile(ctx.token, ctx.owner, filename);
    return { ...file, _owner: ctx.owner, _token: ctx.token };
  }
  const { readLocalMarkdownFiles } = await import("./local-data");
  const files = readLocalMarkdownFiles();
  const file = files.find((f) => f.path.endsWith(filename));
  if (!file) throw new Error(`File not found: ${filename}`);
  return file;
}

export async function saveFile(filename: string, content: string, message: string, sha?: string): Promise<void> {
  const ctx = await getUserContext();
  if (ctx) {
    const { writeMarkdownFile } = await import("./github");
    return writeMarkdownFile(ctx.token, ctx.owner, filename, content, message, sha);
  }
  const { writeLocalMarkdownFile } = await import("./local-data");
  writeLocalMarkdownFile(filename, content);
}
