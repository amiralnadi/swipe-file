import { NextRequest, NextResponse } from "next/server";
import { getAllFiles, saveFile } from "@/lib/data";
import {
  parseSwipeMarkdown,
  serializeSwipeMarkdown,
  removeItemFromMarkdown,
} from "@/lib/markdown";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const files = await getAllFiles();

    for (const file of files) {
      const slug = file.path.split("/").pop()!.replace(".md", "");
      const parsed = parseSwipeMarkdown(file.content, slug);
      const hasItem = parsed.items.some((i) => i.id === id);

      if (hasItem) {
        const updated = removeItemFromMarkdown(parsed, id);
        const newContent = serializeSwipeMarkdown(updated);
        const filename = file.path.split("/").pop()!;
        await saveFile(filename, newContent, `Remove: ${id}`, file.sha);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  } catch (error) {
    console.error("Failed to delete item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
