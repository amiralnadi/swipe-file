import { NextRequest, NextResponse } from "next/server";
import { getFile, saveFile } from "@/lib/data";
import { parseSwipeMarkdown, serializeSwipeMarkdown, addItemToMarkdown } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { folder, category, title, link, image, tags, description } = body;

    if (!folder || !title) {
      return NextResponse.json({ error: "folder and title are required" }, { status: 400 });
    }

    const filename = `${folder.toLowerCase().replace(/\s+/g, "-")}.md`;

    let file;
    let parsed;
    try {
      file = await getFile(filename);
      parsed = parseSwipeMarkdown(file.content, filename.replace(".md", ""));
    } catch {
      // File doesn't exist, create new
      parsed = {
        folder: folder,
        description: `${folder} references and inspiration`,
        items: [],
      };
    }

    const newParsed = addItemToMarkdown(parsed, {
      category: category || "Uncategorized",
      title,
      link: link || null,
      image: image || null,
      tags: tags || [],
      description: description || "",
      added: new Date().toISOString().split("T")[0],
    });

    const newContent = serializeSwipeMarkdown(newParsed);
    await saveFile(filename, newContent, `Add: ${title}`, file?.sha);

    const addedItem = newParsed.items[newParsed.items.length - 1];
    return NextResponse.json({ item: addedItem });
  } catch (error) {
    console.error("Failed to add item:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
