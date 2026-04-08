"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Copy, Check, Key, ArrowLeft } from "lucide-react";
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
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to board
        </Link>

        <h1 className="font-display text-3xl italic mb-8">Settings</h1>

        {/* API Key section */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">API Key</h2>
              <p className="text-xs text-muted-foreground">For the /myswipe Claude Code skill</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Use this key to set up the <code className="bg-stone-100 px-1 py-0.5 rounded">/myswipe</code> skill
            in Claude Code. Run <code className="bg-stone-100 px-1 py-0.5 rounded">/myswipe setup</code> and
            paste this key when prompted.
          </p>

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

        {/* Account section */}
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
