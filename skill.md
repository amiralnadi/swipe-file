---
name: myswipe
version: 3.0.0
description: |
  Personal swipe file manager. Two commands:
  - /myswipe add [url] [optional note] — fetch a URL, analyze it, auto-fill an item card and save to your swipe file
  - /myswipe check — scan your swipe file and surface items relevant to your current work
  - /myswipe setup — one-time setup to save your API key
  Trigger when user runs /myswipe or mentions saving something to their swipe file.
allowed-tools:
  - Bash
  - WebFetch
  - WebSearch
---

## Overview

You manage the user's personal swipe file via the myswipe.cc API. All GitHub operations happen server-side — no GitHub auth or repo access needed from the user's side.

## Step 1 — Check for API key

```bash
cat ~/.myswipe 2>/dev/null
```

If the file exists and has content, store it as `MYSWIPE_KEY` and proceed.

If the file is missing or empty, and the command is `setup` → run **SETUP flow**.

If the file is missing and the command is NOT setup, tell the user:
> "Run `/myswipe setup` first — takes 30 seconds."

Then stop.

## Step 2 — Determine command

- Message contains a URL or starts with `add` → **ADD flow**
- Starts with `check` → **CHECK flow**
- Starts with `setup` → **SETUP flow**

---

## SETUP flow

Tell the user:
> "To get your API key:
> 1. Go to **myswipe.cc/settings**
> 2. Click the copy button next to your API key
> 3. Paste it here"

Wait for them to paste the key. Then save it:

```bash
echo "PASTED_KEY" > ~/.myswipe
chmod 600 ~/.myswipe
```

Confirm:
> "All set! You can now use `/myswipe add [url]` to save items and `/myswipe check` to find relevant references."

---

## ADD flow

### 2a — Parse input

Extract:
- `url` — any URL in the message
- `note` — everything else (user's raw thoughts)

### 2b — Fetch and analyze the URL

Use WebFetch to load the URL. Read the title, main content, key ideas. Identify:
- What type of content is this? (landing page, tweet/thread, article, tool, design example, campaign, etc.)
- What is the subject? (copywriting, design, marketing, product, growth, etc.)

If it's a tweet or thread, read the full thread content — that's the core value.

### 2c — Fill in the item card

Using the fetched content + user's note, determine:

- **title** — concise, scannable (not the raw page title verbatim)
- **folder** — the best category bucket (Design, Marketing, Copywriting, etc.)
- **category** — sub-topic within the folder (e.g. "Launch Threads", "Onboarding Flows", "Landing Pages")
- **tags** — 2-5 lowercase tags with #
- **description** — 1-2 sentences: what this is
- **why_saving** — what makes this worth keeping, what technique or pattern it demonstrates, any insight from the user's note
- **when_to_use** — specific situations where this reference is useful
- **link** — the URL

### 2d — Show card and confirm

Present the filled card clearly. Ask:
> "Does this look right? I'll save it to [folder] → [category]."

Wait for confirmation.

### 2e — Save via API

```bash
curl -s -X POST https://myswipe.cc/api/skill/add \
  -H "Content-Type: application/json" \
  -d "{
    \"apiKey\": \"$MYSWIPE_KEY\",
    \"folder\": \"FOLDER\",
    \"category\": \"CATEGORY\",
    \"title\": \"TITLE\",
    \"link\": \"URL\",
    \"tags\": [\"tag1\", \"tag2\"],
    \"description\": \"DESCRIPTION\",
    \"why_saving\": \"WHY_SAVING\",
    \"when_to_use\": \"WHEN_TO_USE\"
  }"
```

If response contains `"success": true`:
> "Saved **[title]** to [folder] → [category]."

If response contains `"error"`, show the error to the user.

---

## CHECK flow

### 2a — Understand context

Ask or infer from conversation: what is the user working on right now? Get enough detail — type of work, problem, format, channel.

### 2b — Fetch all items

```bash
curl -s https://myswipe.cc/api/skill/items \
  -H "Authorization: Bearer $MYSWIPE_KEY"
```

Parse the `items` array.

### 2c — Find relevant items

Match items to the user's context based on:
- Topic overlap
- Format match (writing a thread → surface thread examples)
- When-to-use alignment
- Tag overlap

### 2d — Present findings

Group by folder/category. For each relevant item show:
- Title and link
- **Why it's relevant** to what they're working on right now
- **What to take from it** — the specific technique or pattern that applies

Surface only the most relevant 3-7 items. Be specific. If nothing matches, say so and suggest what to add.
