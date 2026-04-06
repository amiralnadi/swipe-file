"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Bookmark, Trash2 } from "lucide-react";
import type { SwipeItem } from "@/lib/types";

interface CardProps {
  item: SwipeItem;
  index: number;
  onClick: () => void;
  onTagClick?: (tag: string) => void;
}

export default function Card({ item, index, onClick, onTagClick }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        layout: { duration: 0.3 },
      }}
      className="relative group break-inside-avoid mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl bg-surface border border-border cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {/* Image */}
        {item.image && (
          <div className="relative" style={{ minHeight: "140px", maxHeight: "320px" }}>
            <img
              src={item.image}
              alt={item.title}
              className="w-full object-cover"
              loading="lazy"
              style={{ minHeight: "140px", maxHeight: "320px" }}
            />

            {/* Hover overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                >
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {item.link && (
                      <motion.a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.05 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-white
                          transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-stone-700" />
                      </motion.a>
                    )}
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-white
                        transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-stone-700" />
                    </motion.button>
                  </div>

                  {/* Bottom info on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/90 uppercase tracking-wider mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-white font-semibold text-sm leading-snug">
                        {item.title}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Content */}
        <div className="p-3.5">
          {/* Breadcrumb */}
          <p className="text-[10px] text-muted-foreground mb-1 tracking-wider uppercase font-medium">
            {item.folder} <span className="text-muted mx-0.5">/</span> {item.category}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-[13px] leading-snug mb-1 line-clamp-2 group-hover:text-accent transition-colors duration-200">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
              {item.description}
            </p>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick?.(tag);
                  }}
                  className="px-1.5 py-0.5 rounded-md bg-stone-100 text-[10px] font-medium text-stone-500
                    hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
              {item.tags.length > 3 && (
                <span className="text-[10px] text-muted self-center ml-0.5">+{item.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}
