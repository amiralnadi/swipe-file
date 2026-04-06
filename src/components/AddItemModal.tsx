"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Image, Tag, FolderOpen, AlignLeft, Sparkles } from "lucide-react";
import type { Folder } from "@/lib/types";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: {
    folder: string;
    category: string;
    title: string;
    link?: string;
    image?: string;
    tags?: string[];
    description?: string;
  }) => Promise<void>;
  folders: Folder[];
}

export default function AddItemModal({ isOpen, onClose, onSubmit, folders }: AddItemModalProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [folder, setFolder] = useState(folders[0]?.name || "");
  const [newFolder, setNewFolder] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!folder && folders.length > 0) {
      setFolder(folders[0].name);
    }
  }, [folders, folder]);

  const selectedFolder = folders.find((f) => f.name === folder);
  const existingCategories = selectedFolder?.categories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      await onSubmit({
        folder: newFolder || folder,
        category: category || "Uncategorized",
        title,
        link: link || undefined,
        image: image || undefined,
        tags,
        description: description || undefined,
      });

      setTitle("");
      setLink("");
      setImage("");
      setDescription("");
      setCategory("");
      setTagsInput("");
      setNewFolder("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all duration-200";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden z-10"
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <h2 className="font-display text-xl italic">Add to Swipe File</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5">
              {/* Title */}
              <div className="relative">
                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What are you saving? *"
                  required
                  className={inputClasses}
                  autoFocus
                />
              </div>

              {/* Link */}
              <div className="relative">
                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Paste a link..."
                  className={inputClasses}
                />
              </div>

              {/* Image URL */}
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL (or Google Drive link)"
                  className={inputClasses}
                />
              </div>

              {/* Folder + Category */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <FolderOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted z-10" />
                  <select
                    value={folder}
                    onChange={(e) => {
                      setFolder(e.target.value);
                      setCategory("");
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all duration-200 appearance-none"
                  >
                    {folders.map((f) => (
                      <option key={f.slug} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                    <option value="__new__">+ New folder</option>
                  </select>
                </div>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    list="categories"
                    className={inputClasses}
                  />
                  <datalist id="categories">
                    {existingCategories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* New folder input */}
              {folder === "__new__" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="relative overflow-hidden"
                >
                  <FolderOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    placeholder="New folder name..."
                    className={inputClasses}
                    autoFocus
                  />
                </motion.div>
              )}

              {/* Tags */}
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Tags (comma-separated)"
                  className={inputClasses}
                />
              </div>

              {/* Description */}
              <div className="relative">
                <AlignLeft className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this worth saving?"
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm resize-none
                    placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40
                    transition-all duration-200"
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!title || isSubmitting}
                className="w-full py-3 bg-foreground text-background rounded-xl text-sm font-semibold
                  hover:bg-stone-800 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
                  shadow-sm hover:shadow-md"
                whileHover={title ? { scale: 1.01 } : {}}
                whileTap={title ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save to Swipe File"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
