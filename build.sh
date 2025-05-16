#!/usr/bin/env bash
# Usage: ./build.sh path/to/*.md  (one or many Markdown files)

for md in "$@"; do
  dir="$(dirname "$md")"           # folder the .md lives in
  html="$dir/index.html"           # <that folder>/index.html

  pandoc "$md" \
    --template=assets/templates/article.html \
    --standalone \
    --mathjax \
    -o "$html"

  echo "✓ built $html"
done