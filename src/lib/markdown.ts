import matter from "gray-matter";
import type { SwipeItem, ParsedMarkdown } from "./types";

/**
 * Parse a markdown file into structured swipe items.
 */
export function parseSwipeMarkdown(raw: string, fileSlug: string): ParsedMarkdown {
  const { data: frontmatter, content } = matter(raw);
  const folder = frontmatter.folder || fileSlug;
  const description = frontmatter.description || "";

  const items: SwipeItem[] = [];
  let currentCategory = "Uncategorized";

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ## Category heading
    const categoryMatch = line.match(/^## (.+)/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // ### Item title
    const itemMatch = line.match(/^### (.+)/);
    if (itemMatch) {
      const title = itemMatch[1].trim();
      const item: SwipeItem = {
        id: generateId(fileSlug, currentCategory, title),
        folder,
        category: currentCategory,
        title,
        link: null,
        image: null,
        tags: [],
        description: "",
        added: new Date().toISOString().split("T")[0],
      };

      // Parse bullet fields following the ### heading
      for (let j = i + 1; j < lines.length; j++) {
        const bulletLine = lines[j].trim();

        if (bulletLine.startsWith("### ") || bulletLine.startsWith("## ")) break;
        if (!bulletLine.startsWith("- **")) continue;

        const fieldMatch = bulletLine.match(/^- \*\*(.+?):\*\*\s*(.+)/);
        if (!fieldMatch) continue;

        const [, key, value] = fieldMatch;
        const keyLower = key.toLowerCase();

        if (keyLower === "link") item.link = value.trim();
        else if (keyLower === "image") item.image = value.trim();
        else if (keyLower === "tags") {
          item.tags = value.match(/#[\w-]+/g)?.map((t) => t.slice(1)) || [];
        } else if (keyLower === "description") item.description = value.trim();
        else if (keyLower === "added") item.added = value.trim();
      }

      items.push(item);
    }
  }

  return { folder, description, items };
}

/**
 * Serialize structured items back into markdown.
 */
export function serializeSwipeMarkdown(parsed: ParsedMarkdown): string {
  const frontmatter = `---\nfolder: ${parsed.folder}\ndescription: ${parsed.description}\n---\n\n`;

  // Group items by category
  const byCategory = new Map<string, SwipeItem[]>();
  for (const item of parsed.items) {
    const cat = item.category || "Uncategorized";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(item);
  }

  let md = frontmatter;

  for (const [category, items] of byCategory) {
    md += `## ${category}\n\n`;
    for (const item of items) {
      md += `### ${item.title}\n`;
      if (item.link) md += `- **Link:** ${item.link}\n`;
      if (item.image) md += `- **Image:** ${item.image}\n`;
      if (item.tags.length > 0) md += `- **Tags:** ${item.tags.map((t) => `#${t}`).join(" ")}\n`;
      if (item.description) md += `- **Description:** ${item.description}\n`;
      md += `- **Added:** ${item.added}\n`;
      md += "\n";
    }
  }

  return md;
}

/**
 * Add a new item to parsed markdown, inserting into the correct category.
 */
export function addItemToMarkdown(
  parsed: ParsedMarkdown,
  item: Omit<SwipeItem, "id" | "folder">
): ParsedMarkdown {
  const newItem: SwipeItem = {
    ...item,
    id: generateId(parsed.folder.toLowerCase().replace(/\s+/g, "-"), item.category, item.title),
    folder: parsed.folder,
  };

  return {
    ...parsed,
    items: [...parsed.items, newItem],
  };
}

/**
 * Remove an item by ID from parsed markdown.
 */
export function removeItemFromMarkdown(parsed: ParsedMarkdown, itemId: string): ParsedMarkdown {
  return {
    ...parsed,
    items: parsed.items.filter((i) => i.id !== itemId),
  };
}

function generateId(folder: string, category: string, title: string): string {
  const slug = `${folder}-${category}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug;
}
