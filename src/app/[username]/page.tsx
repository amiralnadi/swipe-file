"use client";

import { Suspense } from "react";
import BoardContent from "./BoardContent";

export default function BoardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
        </div>
      }
    >
      <BoardContent />
    </Suspense>
  );
}
