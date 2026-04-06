"use client";

import { useState, useMemo, useCallback } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Filter, LogOut, Github } from "lucide-react";
import { useItems, addItem, deleteItem } from "@/hooks/useItems";
import { useOnboard } from "@/hooks/useOnboard";
import type { SwipeItem } from "@/lib/types";
import Board from "@/components/Board";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import FAB from "@/components/FAB";
import AddItemModal from "@/components/AddItemModal";
import CardModal from "@/components/CardModal";
import Skeleton from "@/components/Skeleton";

export default function Home() {
  const { isLoading: isOnboarding, isReady, isUnauthenticated } = useOnboard();
  const { items, folders, isLoading, mutate } = useItems();

  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SwipeItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Active folder name for display
  const activeFolderName = activeFolder
    ? folders.find((f) => f.slug === activeFolder)?.name
    : null;

  // Full filtered count (before pagination)
  const allFiltered = useMemo(() => {
    let result = items;
    if (activeFolder) {
      const folder = folders.find((f) => f.slug === activeFolder);
      if (folder) result = result.filter((i) => i.folder === folder.name);
    }
    if (activeCategory) result = result.filter((i) => i.category === activeCategory);
    if (activeTag) result = result.filter((i) => i.tags.includes(activeTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeFolder, activeCategory, activeTag, searchQuery, folders]);

  const filteredItems = useMemo(() => allFiltered.slice(0, visibleCount), [allFiltered, visibleCount]);

  const handleFolderClick = useCallback((slug: string | null) => {
    setActiveFolder(slug);
    setActiveCategory(null);
    setActiveTag(null);
    setVisibleCount(12);
  }, []);

  const handleCategoryClick = useCallback((folderSlug: string, category: string | null) => {
    setActiveFolder(folderSlug);
    setActiveCategory(category);
    setActiveTag(null);
    setVisibleCount(12);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setVisibleCount(12);
  }, []);

  const handleAddItem = useCallback(
    async (item: Parameters<typeof addItem>[0]) => {
      await addItem(item);
      mutate();
    },
    [mutate]
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      await deleteItem(id);
      setSelectedItem(null);
      mutate();
    },
    [mutate]
  );

  const hasActiveFilters = activeFolder || activeCategory || activeTag;

  const clearFilters = useCallback(() => {
    setActiveFolder(null);
    setActiveCategory(null);
    setActiveTag(null);
    setSearchQuery("");
    setVisibleCount(12);
  }, []);

  // Onboarding: checking/creating repo
  if (isOnboarding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
        <p className="text-sm text-muted-foreground">Setting up your swipe file...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        folders={folders}
        activeFolder={activeFolder}
        activeCategory={activeCategory}
        onFolderClick={handleFolderClick}
        onCategoryClick={handleCategoryClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/60">
          <div className="flex items-center gap-3 px-6 py-3.5">
            {/* Mobile menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            {/* Active filters */}
            <AnimatePresence mode="popLayout">
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden sm:flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5 text-muted" />

                  {activeFolderName && (
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[11px] font-medium rounded-lg">
                      {activeFolderName}
                    </span>
                  )}

                  {activeCategory && (
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[11px] font-medium rounded-lg">
                      {activeCategory}
                    </span>
                  )}

                  {activeTag && (
                    <button
                      onClick={() => setActiveTag(null)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-[11px]
                        font-semibold rounded-lg cursor-pointer hover:bg-accent/20 transition-colors"
                    >
                      #{activeTag}
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={clearFilters}
                    className="p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer ml-0.5"
                    title="Clear filters"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Item count */}
            <span className="text-[11px] text-muted-foreground tabular-nums font-medium">
              {allFiltered.length} item{allFiltered.length !== 1 ? "s" : ""}
            </span>

            {/* Sign out */}
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Board */}
        <div className="p-6">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <Board
                items={filteredItems}
                onCardClick={setSelectedItem}
                onTagClick={handleTagClick}
              />

              {/* Load more */}
              {visibleCount < allFiltered.length && (
                <motion.div
                  className="flex justify-center mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setVisibleCount((c) => Math.min(c + 12, 50))}
                    className="px-8 py-3 bg-surface border border-border rounded-xl text-sm font-medium
                      hover:bg-surface-hover hover:border-stone-300 transition-all duration-200 cursor-pointer
                      shadow-sm hover:shadow"
                  >
                    Load more
                    <span className="ml-2 text-muted-foreground">
                      ({allFiltered.length - visibleCount} remaining)
                    </span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      {/* FAB */}
      <FAB onClick={() => setShowAddModal(true)} />

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddItem}
        folders={folders}
      />
      <CardModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDeleteItem}
        onTagClick={handleTagClick}
      />
    </div>
  );
}
