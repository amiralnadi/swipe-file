"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3
        bg-foreground text-background rounded-full shadow-lg cursor-pointer
        font-semibold text-sm hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", damping: 20 }}
    >
      <Plus className="w-5 h-5" strokeWidth={2.5} />
      Add Item
    </motion.button>
  );
}
