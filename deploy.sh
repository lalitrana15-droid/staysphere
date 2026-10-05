#!/bin/bash
echo "🚀 Deploying StaySphere to VPS..."

rsync -az --exclude node_modules --exclude .next \
  -e "ssh -i ~/.ssh/bookmyvillas_hostinger" \
  "/Users/lalitmacmini/Pictures/Projects/StayCove/" \
  root@200.141.2.70:/var/www/staysphere.imagesque.com/

echo "✅ Files uploaded. Building on server..."

ssh -i ~/.ssh/bookmyvillas_hostinger root@200.141.2.70 \
  "cd /var/www/staysphere.imagesque.com && npm run build && pm2 restart staysphere --update-env"

echo "✅ Done! https://staysphere.imagesque.com"
