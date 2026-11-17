#!/usr/bin/env bash
# =============================================================
#  new-post.sh — 快速建立新文章
#  用法：bash scripts/new-post.sh
#        bash scripts/new-post.sh "my-post-slug"
# =============================================================

POSTS_DIR="$(cd "$(dirname "$0")/.." && pwd)/_posts"
DATE=$(date '+%Y-%m-%d')

echo "========================================"
echo "  New Post — $DATE"
echo "========================================"

# ── slug（檔名）──────────────────────────────────────────────
if [ -n "$1" ]; then
  SLUG="$1"
else
  read -rp "Slug (filename, e.g. oop-notes-6): " SLUG
fi
SLUG=$(echo "$SLUG" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

FILE="$POSTS_DIR/$SLUG.md"
if [ -f "$FILE" ]; then
  echo "❌  Already exists: $FILE"
  exit 1
fi

# ── title ─────────────────────────────────────────────────────
read -rp "Title: " TITLE

# ── type ──────────────────────────────────────────────────────
echo "Type: [1] blog  [2] leetcode"
read -rp "Type [1]: " TYPE_CHOICE
case "$TYPE_CHOICE" in
  2) TYPE="leetcode" ;;
  *) TYPE="blog" ;;
esac

# ── category（blog only）──────────────────────────────────────
if [ "$TYPE" = "blog" ]; then
  echo "Category: [1] notes  [2] implementation  [3] til  [4] paper"
  read -rp "Category [1]: " CAT_CHOICE
  case "$CAT_CHOICE" in
    2) CATEGORY="implementation" ;;
    3) CATEGORY="til" ;;
    4) CATEGORY="paper" ;;
    *) CATEGORY="notes" ;;
  esac
  CATEGORY_LINE="category: $CATEGORY"
else
  CATEGORY_LINE="category: leetcode"
fi

# ── summary ───────────────────────────────────────────────────
read -rp "Summary (optional): " SUMMARY

# ── 建立檔案 ──────────────────────────────────────────────────
cat > "$FILE" <<EOF
---
title: '$TITLE'
date: '$DATE'
draft: true
$CATEGORY_LINE
type: $TYPE
tags: []
summary: '$SUMMARY'
---

EOF

echo ""
echo "✅  Created: $FILE"
echo "========================================"
