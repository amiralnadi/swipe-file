"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Github, GitFork, Plug, Bot } from "lucide-react";

const steps = [
  {
    icon: GitFork,
    title: "Fork the template repo",
    description: (
      <>
        Go to{" "}
        <a
          href="https://github.com/amiralnadi/my-swipe-file"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          github.com/amiralnadi/my-swipe-file
        </a>{" "}
        and click Fork. This creates your own copy where your items will live.
      </>
    ),
  },
  {
    icon: Plug,
    title: "Connect GitHub",
    description:
      "Sign in below and grant access to your forked repo. Your items are stored as Markdown files — you own them completely.",
  },
  {
    icon: Bot,
    title: "Connect your AI",
    description:
      "Install the /myswipe skill in Claude Code. Run /myswipe setup, paste your API key from myswipe.cc/settings, and you're done. Then use /myswipe add [url] to save items — AI fills the card. Use /myswipe check to surface relevant references while you work.",
  },
];

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-6">
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Logo + heading */}
        <div className="text-center mb-10">
          <motion.div
            className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-foreground flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
          >
            <span className="text-background font-display text-2xl italic">S</span>
          </motion.div>
          <h1 className="font-display text-4xl italic mb-2 tracking-tight">Swipe File</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            A collection of things you find valuable and want to reference later: great copy, design examples, useful frameworks, interesting articles. Instead of forgetting them in browser bookmarks, you build a searchable library you actually use in your work.
          </p>
        </div>

        {/* Steps */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 items-start bg-surface border border-border rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                <step.icon className="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Step {i + 1}</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-0.5">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sign in button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="inline-flex items-center gap-3 px-7 py-3.5 bg-foreground text-background rounded-2xl
              font-semibold text-sm hover:bg-stone-800 transition-all duration-200 cursor-pointer
              shadow-lg hover:shadow-xl group w-full justify-center"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
          <p className="text-[11px] text-muted mt-3">
            Only accesses the repo you select — nothing else.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
