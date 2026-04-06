import { NextResponse } from "next/server";
import { getAllFiles } from "@/lib/data";
import { parseSwipeMarkdown } from "@/lib/markdown";
import type { Folder } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const files = await getAllFiles();
    const folders: Folder[] = [];

    for (const file of files) {
      const slug = file.path.split("/").pop()!.replace(".md", "");
      const parsed = parseSwipeMarkdown(file.content, slug);
      const categories = [...new Set(parsed.items.map((i) => i.category))];

      folders.push({
        slug,
        name: parsed.folder,
        description: parsed.description,
        categories,
        itemCount: parsed.items.length,
      });
    }

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}
