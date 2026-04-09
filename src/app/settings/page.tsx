"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Copy, Check, Key, ArrowLeft, Terminal, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apikey")
      .then((r) => r.json())
      .then((d) => {
        setApiKey(d.apiKey);
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-12">
        <Link
          href={session?.githubUsername ? `/${session.githubUsername}` : "/"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to board
        </Link>

        <h1 className="font-display text-3xl italic mb-8">Settings</h1>

        {/* API Key */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">API Key</h2>
              <p className="text-xs text-muted-foreground">Used by both integrations below</p>
            </div>
          </div>

          {loading ? (
            <div className="h-10 bg-stone-100 rounded-xl animate-pulse" />
          ) : (
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-stone-50 border border-border rounded-xl px-4 py-3 font-mono truncate">
                {apiKey}
              </code>
              <motion.button
                onClick={handleCopy}
                className="shrink-0 p-2.5 rounded-xl border border-border hover:bg-stone-50 transition-colors cursor-pointer"
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Claude Code skill */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-stone-600" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Claude Code skill</h2>
              <p className="text-xs text-muted-foreground">Works in Claude Code CLI and desktop app</p>
            </div>
          </div>
          <ol className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground shrink-0">1.</span>
              <span>Install the skill by running this in your terminal:
                <code className="block mt-1 bg-stone-50 border border-border rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed break-all">
                  mkdir -p ~/.claude/skills/myswipe && curl -s https://raw.githubusercontent.com/amiralnadi/swipe-file/main/skill.md -o ~/.claude/skills/myswipe/skill.md
                </code>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground shrink-0">2.</span>
              <span>Run <code className="bg-stone-100 px-1 py-0.5 rounded">/myswipe setup</code> in Claude Code and paste your API key above</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground shrink-0">3.</span>
              <span>Use <code className="bg-stone-100 px-1 py-0.5 rounded">/myswipe add [url]</code> to save items and <code className="bg-stone-100 px-1 py-0.5 rounded">/myswipe check</code> to find relevant references</span>
            </li>
          </ol>
        </div>

        {/* Claude Desktop MCP */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-stone-600" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">MCP connector for Claude Desktop</h2>
              <p className="text-xs text-muted-foreground">Save and search via natural conversation</p>
            </div>
          </div>
          <ol className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground shrink-0">1.</span>
              <span>
                Make sure <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Node.js</a> is installed, then clone and set up the connector:
                <code className="block mt-1 bg-stone-50 border border-border rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed break-all">
                  git clone https://github.com/amiralnadi/myswipe-mcp ~/myswipe-mcp && cd ~/myswipe-mcp && npm install && npm run build && node setup.js
                </code>
                Paste your API key above when prompted — it configures Claude Desktop automatically.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground shrink-0">2.</span>
              <span>Quit and restart Claude Desktop — myswipe will appear under Connectors</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground shrink-0">3.</span>
              <span>Just tell Claude what to save: <em>"Add https://stripe.com to my swipe file"</em></span>
            </li>
          </ol>
        </div>

        {/* Account */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-sm mb-1">Account</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Signed in as <span className="font-medium text-foreground">@{session?.githubUsername}</span>
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
