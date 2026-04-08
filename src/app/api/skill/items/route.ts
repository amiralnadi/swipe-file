import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";
import { getInstallationId, getInstallationToken } from "@/lib/github-app";
import { readAllMarkdownFiles } from "@/lib/github";
import { parseSwipeMarkdown } from "@/lib/markdown";

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    const username = verifyApiKey(apiKey);
    if (!username) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

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
