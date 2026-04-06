import fs from "fs";
import path from "path";
import type { GitHubFile } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Read all markdown files from the local data/ directory.
 * Used when GITHUB_PAT is not configured (local dev mode).
 */
export function readLocalMarkdownFiles(): GitHubFile[] {
  if (!fs.existsSync(DATA_DIR)) return [];

  const files = fs.readdirSync(DATA_DIR).filter(
    (f) => f.endsWith(".md") && f !== "README.md"
  );

  return files.map((filename) => {
    const filePath = path.join(DATA_DIR, filename);
    const content = fs.readFileSync(filePath, "utf-8");
    return {
      path: `data/${filename}`,
      sha: "",
      content,
    };
  });
}

/**
 * Write a markdown file to the local data/ directory.
 */
export function writeLocalMarkdownFile(filename: string, content: string): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, content, "utf-8");
}
