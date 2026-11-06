#!/bin/bash
set -e
cd /var/www/staysphere.imagesque.com

# .env.local check — Supabase aur agent login ke liye zaroori
if [ ! -f .env.local ]; then
  echo "❌ ERROR: .env.local missing! Copy it first:"
  echo "   scp -i ~/.ssh/staysvacation_deploy /Users/lalitmacmini/Pictures/Projects/StayCove/.env.local root@staysvacation.com:/var/www/staysphere.imagesque.com/.env.local"
  exit 1
fi

echo "✓ .env.local found"

git fetch origin main
git clean -f -d --exclude=.env.local
git reset --hard origin/main
echo "✓ Code updated"

npm install --production=false --silent
echo "✓ Dependencies installed"

# .next folder clear (images cache ko alag handle karo)
rm -rf .next/cache/images 2>/dev/null || true
rm -rf .next 2>/dev/null || true
echo "✓ .next cleared"

npm run build
echo "✓ Build complete"

# Corum8 images restore (git mein nahi hain — VPS pe stored hain)
mkdir -p public/photoshoots/corum8-mansion
cp /var/www/villabase.imagesque.com/public/photoshoots/corum8-mansion/*.jpg \
   public/photoshoots/corum8-mansion/ 2>/dev/null || true
echo "✓ Corum8 images: $(ls public/photoshoots/corum8-mansion/ 2>/dev/null | wc -l) files"

fuser -k 3002/tcp 2>/dev/null || true
sleep 1
pm2 restart staysphere --update-env
sleep 3
pm2 show staysphere | grep -q 'online' && echo "✓ Deploy successful! https://staysvacation.com"
