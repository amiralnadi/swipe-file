import useSWR from "swr";
import type { SwipeItem, Folder } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ItemsResponse {
  items: SwipeItem[];
  folders: Folder[];
}

export function useItems() {
  const { data, error, isLoading, mutate } = useSWR<ItemsResponse>("/api/items", fetcher);

  return {
    items: data?.items ?? [],
    folders: data?.folders ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

export async function addItem(item: {
  folder: string;
  category: string;
  title: string;
  link?: string;
  image?: string;
  tags?: string[];
  description?: string;
}) {
  const res = await fetch("/api/items/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}

export async function deleteItem(id: string) {
  const res = await fetch(`/api/items/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}
