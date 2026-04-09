"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Folder, ChevronRight, Layers } from "lucide-react";
import type { Folder as FolderType } from "@/lib/types";

interface SidebarProps {
  folders: FolderType[];
  activeFolder: string | null;
  activeCategory: string | null;
  onFolderClick: (slug: string | null) => void;
  onCategoryClick: (folder: string, category: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  folders,
  activeFolder,
  activeCategory,
  onFolderClick,
  onCategoryClick,
  isOpen,
  onClose,
}: SidebarProps) {
  const totalItems = folders.reduce((sum, f) => sum + f.itemCount, 0);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-40
          transition-transform duration-300 ease-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-5 pt-7 pb-5 border-b border-border">
            <h1 className="font-display text-[26px] italic tracking-tight leading-none">Swipe File</h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">{totalItems} items collected</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {/* All Items */}
            <button
              onClick={() => onFolderClick(null)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${!activeFolder
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-stone-50"}`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">All Items</span>
              <span className="text-[11px] tabular-nums opacity-60">{totalItems}</span>
            </button>

            {/* Folders */}
            <div className="mt-5">
              <p className="px-3 mb-2 text-[10px] font-semibold text-muted uppercase tracking-widest">Folders</p>
              <div className="space-y-0.5">
                {folders.map((folder, i) => (
                  <motion.div
                    key={folder.slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Folder button */}
                    <button
                      onClick={() => onFolderClick(folder.slug)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer
                        ${activeFolder === folder.slug && !activeCategory
                          ? "bg-accent/10 text-accent font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-stone-50"}`}
                    >
                      <Folder className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left">{folder.name}</span>
                      <span className="text-[11px] tabular-nums opacity-50">{folder.itemCount}</span>
                      <ChevronRight
                        className={`w-3 h-3 transition-transform duration-200
                          ${activeFolder === folder.slug ? "rotate-90" : ""}`}
                      />
                    </button>

                    {/* Categories */}
                    <AnimatePresence>
                      {activeFolder === folder.slug && folder.categories.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-5 mt-0.5 pl-3 border-l border-border space-y-0.5">
                            {folder.categories.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => onCategoryClick(folder.slug, cat)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer
                                  ${activeCategory === cat
                                    ? "text-accent font-semibold bg-accent/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-stone-50"}`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border space-y-3">
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-1.5">Claude commands</p>
              <div className="space-y-1">
                <code className="block text-[10px] text-muted-foreground bg-stone-50 px-2 py-1 rounded-lg">/myswipe add [url]</code>
                <code className="block text-[10px] text-muted-foreground bg-stone-50 px-2 py-1 rounded-lg">/myswipe check</code>
              </div>
            </div>
            <p className="text-[10px] text-muted">
              built by{" "}
              <a
                href="https://x.com/amiralnadi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Amir Alnadi
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
