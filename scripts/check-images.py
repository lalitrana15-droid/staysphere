#!/usr/bin/env python3
"""Checks every property image URL in data/*.ts through our image CDN (with ?w=800).
Usage: python3 scripts/check-images.py [--all]   (default: first 5 images per property)
Exit code 1 if any image fails, so it can run in CI / cron."""
import re, sys, concurrent.futures as cf, urllib.request, urllib.error

files = ["data/elivaas-properties.ts", "data/properties.ts"]
limit = None if "--all" in sys.argv else 5
urls = set()
for f in files:
    s = open(f).read()
    for m in re.finditer(r'images:\s*\[(.*?)\]', s, re.S):
        found = re.findall(r'"(https://img\.staysvacation\.com/[^"]+)"', m.group(1))
        urls.update(found[:limit] if limit else found)

def check(u):
    try:
        req = urllib.request.Request(u + "?w=800", method="HEAD", headers={"User-Agent": "sv-image-check"})
        return u, urllib.request.urlopen(req, timeout=30).status
    except urllib.error.HTTPError as e:
        return u, e.code
    except Exception as e:
        return u, str(e)[:40]

with cf.ThreadPoolExecutor(24) as ex:
    results = list(ex.map(check, sorted(urls)))
bad = [(u, c) for u, c in results if c != 200]
print(f"checked {len(results)} images, {len(bad)} failing")
for u, c in bad:
    print(c, u)
sys.exit(1 if bad else 0)
