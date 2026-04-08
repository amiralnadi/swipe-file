import { NextRequest, NextResponse } from "next/server";
import { getInstallationId, getInstallationToken } from "@/lib/github-app";
import { readAllMarkdownFiles } from "@/lib/github";
import { parseSwipeMarkdown } from "@/lib/markdown";

async function verifyGithubToken(token: string): Promise<string | null> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.login ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const username = await verifyGithubToken(token);
    if (!username) return NextResponse.json({ error: "Invalid GitHub token" }, { status: 401 });

    const installationId = await getInstallationId(username);
    if (!installationId) {
      return NextResponse.json({ error: "GitHub App not installed. Sign in at myswipe.cc first." }, { status: 403 });
    }

    const installToken = await getInstallationToken(installationId);
    const files = await readAllMarkdownFiles(installToken, username);

    const allItems = files.flatMap((file) => {
      const slug = file.path.split("/").pop()!.replace(".md", "");
      return parseSwipeMarkdown(file.content, slug).items;
    });

    return NextResponse.json({ items: allItems });
  } catch (error) {
    console.error("Skill items failed:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
