"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* Subtle dot pattern */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        className="relative text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-foreground flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          <span className="text-background font-display text-2xl italic">S</span>
        </motion.div>

        <h1 className="font-display text-5xl italic mb-3 tracking-tight">Swipe File</h1>
        <p className="text-muted-foreground text-sm mb-10 max-w-[300px] mx-auto leading-relaxed">
          Your personal moodboard for saving references, examples, and inspiration. One click to start.
        </p>

        <motion.button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="inline-flex items-center gap-3 px-7 py-3.5 bg-foreground text-background rounded-2xl
            font-semibold text-sm hover:bg-stone-800 transition-all duration-200 cursor-pointer
            shadow-lg hover:shadow-xl group"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </motion.button>

        <motion.div
          className="mt-8 max-w-[260px] mx-auto space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[11px] text-muted leading-relaxed">
            We'll create a <code className="bg-stone-100 px-1 py-0.5 rounded text-[10px]">swipe-file</code> repo
            in your GitHub to store your items. You own your data.
          </p>
          <p className="text-[11px] text-muted">
            Also works with Claude Code — edit the files directly.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
