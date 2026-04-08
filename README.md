# myswipe.cc

A personal swipe file app — save references, examples, and inspiration as Markdown files in your own GitHub repo.

## What is a swipe file?

A swipe file is a curated collection of things worth keeping: great copy, design patterns, useful frameworks, articles, screenshots. Instead of bookmarking and forgetting, you build a searchable library you actually use.

## Why Markdown + GitHub?

Your items are plain Markdown files in your own GitHub repo. This means your AI tools (Claude, Cursor, Copilot) can read them natively — no integrations, no exports. Point your AI at the repo and it has access to your entire reference library.

This turns your swipe file into a **personalized knowledge base** your AI can draw from when you're writing copy, designing, or building. Instead of getting generic outputs, your AI has your specific references, examples, and standards to work from. The more you save, the more useful it becomes.

## How it works

1. Fork the [swipe-file-data](https://github.com/amiralnadi/swipe-file-data) template repo
2. Sign in at [myswipe.cc](https://myswipe.cc) with GitHub and grant access to your fork
3. Your items are stored as Markdown files in your repo — you own them completely

## Adding items

**Web app** — click the + button at myswipe.cc

**Claude Code** — use the `/myswipe add [url or note]` skill. Claude fetches the page and fills in the card automatically.

**Directly** — edit the Markdown files in your `data/` folder via any editor, Claude, or Cursor

## Tech stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS v4 + Framer Motion
- NextAuth v5 with GitHub App authentication
- Data layer: Markdown files in each user's own GitHub repo
- Deployed on Netlify

## Data format

Items live in `data/*.md` files. Each file is a folder, each `##` heading is a category, each `###` heading is an item:

```markdown
---
folder: Design
description: Design references and inspiration
---

## UI Patterns

### Stripe's pricing page
- Link: https://stripe.com/pricing
- Tags: pricing, saas, conversion
- Description: Clean comparison table with clear hierarchy
- When to use: When designing SaaS pricing
- Added: 2024-01-01
```
