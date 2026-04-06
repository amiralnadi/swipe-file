import { Octokit } from "octokit";
import type { GitHubFile } from "./types";

const REPO_NAME = "swipe-file";
const DATA_PATH = "data";

function getOctokit(token: string) {
  return new Octokit({ auth: token });
}

/**
 * Get the authenticated user's GitHub username.
 */
export async function getUsername(token: string): Promise<string> {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.users.getAuthenticated();
  return data.login;
}

/**
 * Check if the swipe-file repo exists for this user.
 */
export async function repoExists(token: string, owner: string): Promise<boolean> {
  const octokit = getOctokit(token);
  try {
    await octokit.rest.repos.get({ owner, repo: REPO_NAME });
    return true;
  } catch {
    return false;
  }
}

/**
 * Create the swipe-file repo and seed it with a starter MD file.
 */
export async function createRepo(token: string): Promise<string> {
  const octokit = getOctokit(token);

  // Create repo
  const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
    name: REPO_NAME,
    description: "My personal swipe file — references, examples, and inspiration",
    private: false,
    auto_init: true, // creates initial commit with README
  });

  const owner = repo.owner.login;

  // Seed with starter file
  const starterContent = `---
folder: Inspiration
description: General inspiration and references
---

## Saved Items

`;

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: REPO_NAME,
    path: `${DATA_PATH}/inspiration.md`,
    message: "Initialize swipe file",
    content: Buffer.from(starterContent).toString("base64"),
  });

  return owner;
}

/**
 * List all markdown files in the data directory.
 */
export async function listMarkdownFiles(token: string, owner: string): Promise<string[]> {
  const octokit = getOctokit(token);
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo: REPO_NAME,
      path: DATA_PATH,
    });

    if (!Array.isArray(data)) return [];

    return data
      .filter((f) => f.type === "file" && f.name.endsWith(".md") && f.name !== "README.md")
      .map((f) => f.name);
  } catch {
    return [];
  }
}

/**
 * Read a single markdown file from the repo.
 */
export async function readMarkdownFile(token: string, owner: string, filename: string): Promise<GitHubFile> {
  const octokit = getOctokit(token);
  const path = `${DATA_PATH}/${filename}`;
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo: REPO_NAME,
    path,
  });

  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`${path} is not a file`);
  }

  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { path, sha: data.sha, content };
}

/**
 * Write (create or update) a markdown file in the repo.
 */
export async function writeMarkdownFile(
  token: string,
  owner: string,
  filename: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const octokit = getOctokit(token);
  const path = `${DATA_PATH}/${filename}`;

  let currentSha = sha;
  if (!currentSha) {
    try {
      const existing = await readMarkdownFile(token, owner, filename);
      currentSha = existing.sha;
    } catch {
      // File doesn't exist yet
    }
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: REPO_NAME,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    ...(currentSha ? { sha: currentSha } : {}),
  });
}

/**
 * Read all markdown files and return their contents.
 */
export async function readAllMarkdownFiles(token: string, owner: string): Promise<GitHubFile[]> {
  const filenames = await listMarkdownFiles(token, owner);
  if (filenames.length === 0) return [];
  const files = await Promise.all(filenames.map((f) => readMarkdownFile(token, owner, f)));
  return files;
}
