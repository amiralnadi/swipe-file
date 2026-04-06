export interface SwipeItem {
  id: string;
  folder: string;
  category: string;
  title: string;
  link: string | null;
  image: string | null;
  tags: string[];
  description: string;
  added: string;
}

export interface Folder {
  slug: string;
  name: string;
  description: string;
  categories: string[];
  itemCount: number;
}

export interface ParsedMarkdown {
  folder: string;
  description: string;
  items: SwipeItem[];
}

export interface GitHubFile {
  path: string;
  sha: string;
  content: string;
}
