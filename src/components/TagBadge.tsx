"use client";

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
}

export default function TagBadge({ tag, onClick, active }: TagBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer
        ${active
          ? "bg-accent text-white"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
        }`}
    >
      #{tag}
    </button>
  );
}
