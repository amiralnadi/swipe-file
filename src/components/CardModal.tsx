"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Trash2, Calendar } from "lucide-react";
import type { SwipeItem } from "@/lib/types";

interface CardModalProps {
  item: SwipeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onTagClick: (tag: string) => void;
}

export default function CardModal({ item, isOpen, onClose, onDelete, onTagClick }: CardModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm
                hover:bg-black/30 transition-colors cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>

            {/* Image */}
            {item.image && (
              <div className="relative w-full max-h-[320px] overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}

            {/* Content */}
            <motion.div
              className="p-6 overflow-y-auto flex-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {/* Breadcrumb */}
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-medium">
                {item.folder} <span className="text-muted mx-0.5">/</span> {item.category}
              </p>

              {/* Title */}
              <h2 className="font-display text-2xl italic mb-3 leading-tight">{item.title}</h2>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {item.description}
                </p>
              )}

              {/* Link */}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-50 border border-border
                    rounded-xl text-sm font-medium text-foreground hover:bg-stone-100 hover:border-stone-300
                    transition-all mb-5 group/link"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/link:text-accent transition-colors" />
                  <span className="truncate max-w-xs">{new URL(item.link).hostname}</span>
                </a>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {item.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onTagClick(tag);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 text-xs font-medium text-stone-600
                        hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar className="w-3 h-3" />
                Added {item.added}
              </div>
            </motion.div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 bg-stone-50/50">
              <button
                onClick={() => onDelete(item.id)}
                className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600
                  transition-colors cursor-pointer font-medium px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-foreground text-background rounded-lg text-sm font-medium
                  hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
