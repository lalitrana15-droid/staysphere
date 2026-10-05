#!/bin/bash
cd /Users/lalitmacmini/Pictures/Projects/StayCove
TIMER=""

fswatch -o --exclude "node_modules" --exclude ".next" --exclude ".git" --exclude ".DS_Store" . | while read f; do
  if [ -n "$TIMER" ]; then
    kill $TIMER 2>/dev/null
  fi
  (sleep 15 && cd /Users/lalitmacmini/Pictures/Projects/StayCove && git add . && git diff --cached --quiet || (git commit -m "Auto deploy $(date '+%d %b %H:%M')" && git push)) &
  TIMER=$!
done
