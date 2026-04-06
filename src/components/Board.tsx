"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";
import type { SwipeItem } from "@/lib/types";
import Card from "./Card";

interface BoardProps {
  items: SwipeItem[];
  onCardClick: (item: SwipeItem) => void;
  onTagClick: (tag: string) => void;
}

export default function Board({ items, onCardClick, onTagClick }: BoardProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-16 h-16 mb-6 rounded-2xl bg-stone-100 flex items-center justify-center">
          <ImageOff className="w-7 h-7 text-muted" />
        </div>
        <h3 className="font-display text-2xl italic mb-2">Nothing here yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Add your first item to start building your swipe file.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="masonry"
      >
        <AnimatePresence>
          {items.map((item, i) => (
            <Card
              key={item.id}
              item={item}
              index={i}
              onClick={() => onCardClick(item)}
              onTagClick={onTagClick}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
