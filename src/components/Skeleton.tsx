"use client";

import { motion } from "framer-motion";

export default function Skeleton() {
  const cards = [200, 280, 180, 320, 240, 190, 260, 300, 210, 250, 220, 270];

  return (
    <div className="masonry">
      {cards.map((h, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl bg-stone-100 mb-4 overflow-hidden"
          style={{ height: `${h}px` }}
        >
          <div className="animate-pulse h-full flex flex-col">
            <div className="flex-1 bg-stone-200/60" />
            <div className="p-3.5 space-y-2">
              <div className="h-2 w-16 bg-stone-200 rounded-full" />
              <div className="h-3 w-3/4 bg-stone-200 rounded-full" />
              <div className="h-2 w-full bg-stone-200/60 rounded-full" />
              <div className="flex gap-1 pt-1">
                <div className="h-4 w-12 bg-stone-200/80 rounded-md" />
                <div className="h-4 w-10 bg-stone-200/80 rounded-md" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
