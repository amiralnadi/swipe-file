import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";
import { getInstallationId, getInstallationToken } from "@/lib/github-app";
import { readMarkdownFile, writeMarkdownFile } from "@/lib/github";
import { parseSwipeMarkdown, serializeSwipeMarkdown, addItemToMarkdown } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, folder, category, title, link, tags, description, why_saving, when_to_use } = body;

    if (!apiKey) return NextResponse.json({ error: "Missing apiKey" }, { status: 401 });
    if (!folder || !title) return NextResponse.json({ error: "folder and title are required" }, { status: 400 });

    const username = verifyApiKey(apiKey);
    if (!username) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const installationId = await getInstallationId(username);
    if (!installationId) {
      return NextResponse.json({
        error: "GitHub App not installed. Sign in at myswipe.cc first to connect your repo."
      }, { status: 403 });
    }

    const installToken = await getInstallationToken(installationId);
    const filename = `${folder.toLowerCase().replace(/\s+/g, "-")}.md`;

    let file;
    let parsed;
    try {
      file = await readMarkdownFile(installToken, username, filename);
      parsed = parseSwipeMarkdown(file.content, filename.replace(".md", ""));
    } catch {
      parsed = { folder, description: `${folder} references`, items: [] };
    }

    const fullDescription = [
      description,
      why_saving ? `Why saving: ${why_saving}` : "",
      when_to_use ? `When to use: ${when_to_use}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const newParsed = addItemToMarkdown(parsed, {
      category: category || "Uncategorized",
      title,
      link: link || null,
      image: null,
      tags: tags || [],
      description: fullDescription,
      added: new Date().toISOString().split("T")[0],
    });

    const newContent = serializeSwipeMarkdown(newParsed);
    await writeMarkdownFile(installToken, username, filename, newContent, `Add: ${title}`, file?.sha);

    return NextResponse.json({ success: true, title, folder, category: category || "Uncategorized" });
  } catch (error) {
    console.error("Skill add failed:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
