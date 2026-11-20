#!/usr/bin/env python3
"""
Fetches all properties from Elivaas API and writes data/elivaas-properties.ts
Run from project root: python3 scripts/fetch-elivaas.py
Requires ELIVAAS_API_KEY and ELIVAAS_CHANNEL_ID in .env.local
"""

import urllib.request, json, os, time, re, sys
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
USE_SANDBOX = True
BASE = "https://sandbox.elivaas.com" if USE_SANDBOX else "https://api.elivaas.com/api"

# Default to Nov 25 → Nov 30 (near-future dates for maximum sandbox availability)
CHECKIN  = "2026-11-25"
CHECKOUT = "2026-11-30"
ADULTS   = 2
PAGE_SIZE = 50

STATES = [
    "statedelhi", "stategoa", "stateharyana",
    "statehimachal-pradesh", "statekarnataka", "statekerala",
    "statemaharashtra", "staterajasthan", "statetamil-nadu", "stateuttarakhand",
]

# Map Elivaas city name → destination slug in our system
CITY_TO_DEST: dict[str, str] = {
    # Goa
    "North Goa": "goa", "South Goa": "goa", "Goa": "goa",
    # Rajasthan
    "Udaipur": "udaipur", "Jaipur": "jaipur", "Jodhpur": "jaipur",
    "Pushkar": "pushkar", "Ranthambore": "ranthambore", "Alwar": "alwar",
    "Jaisalmer": "jaipur", "Ajmer": "jaipur", "Bikaner": "jaipur",
    # Himachal Pradesh
    "Kasauli": "kasauli", "Shimla": "shimla", "Dharamshala": "dharamshala",
    "Manali": "shimla", "Dalhousie": "shimla", "Chail": "kasauli",
    "Mashobra": "shimla", "Kasol": "shimla", "Palampur": "dharamshala",
    "Mcleod Ganj": "dharamshala",
    # Uttarakhand
    "Mussoorie": "mussoorie", "Dehradun": "dehradun", "Nainital": "nainital",
    "Mukteshwar": "mukteshwar", "Jim Corbett": "jim-corbett",
    "Rishikesh": "rishikesh", "Ranikhet": "ranikhet", "Bhimtal": "bhimtal",
    "Haridwar": "rishikesh", "Almora": "nainital", "Lansdowne": "rishikesh",
    "Chakrata": "dehradun", "Auli": "rishikesh",
    # Maharashtra
    "Lonavala": "lonavala", "Alibaug": "alibaug", "Nashik": "nashik",
    "Karjat": "karjat", "Igatpuri": "igatpuri", "Kolad": "kolad",
    "Pune": "lonavala", "Panchgani": "lonavala", "Mahabaleshwar": "lonavala",
    "Khandala": "lonavala", "Matheran": "karjat",
    # Karnataka
    "Coorg": "coorg", "Bengaluru": "bengaluru", "Bangalore": "bengaluru",
    "Chikmagalur": "coorg",
    # Kerala
    "Alappuzha": "alappuzha", "Kochi": "kochi", "Varkala": "varkala",
    "Munnar": "munnar", "Alleppey": "alappuzha", "Wayanad": "munnar",
    "Thekkady": "munnar",
    # Tamil Nadu
    "Chennai": "chennai", "Ooty": "ooty",
    # Delhi
    "Delhi": "delhi-ncr", "New Delhi": "delhi-ncr",
    # Haryana (closest destinations)
    "Gurgaon": "delhi-ncr", "Faridabad": "delhi-ncr", "Karnal": "delhi-ncr",
    "Rewari": "delhi-ncr", "Morni Hills": "delhi-ncr", "Panchkula": "delhi-ncr",
    "Bhiwani": "delhi-ncr",
}

STATE_TO_DEST: dict[str, str] = {
    "Goa": "goa",
    "Rajasthan": "jaipur",
    "Himachal Pradesh": "shimla",
    "Uttarakhand": "rishikesh",
    "Maharashtra": "lonavala",
    "Karnataka": "coorg",
    "Kerala": "munnar",
    "Tamil Nadu": "ooty",
    "Delhi": "delhi-ncr",
    "Haryana": "delhi-ncr",
    "Punjab": "delhi-ncr",
}

DEST_COUNTRY: dict[str, str] = {
    "dubai": "UAE",
}

HTML_TAG_RE = re.compile(r'<[^>]+>')

def strip_html(text: str) -> str:
    if not text:
        return ""
    text = HTML_TAG_RE.sub(" ", text)
    text = re.sub(r'\s+', ' ', text)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
    return text.strip()

def get_metric(metrics: list, name: str) -> int:
    for m in metrics or []:
        if m.get("name", "").lower() == name.lower():
            try:
                return int(m["value"])
            except (ValueError, KeyError):
                return 0
    return 0

def has_pool(amenities: list) -> bool:
    pool_keywords = ["pool", "swimming"]
    for a in amenities or []:
        name = (a.get("name") or "").lower()
        if any(k in name for k in pool_keywords):
            return True
    return False

def map_property_type(etype: str) -> str:
    t = (etype or "").upper()
    if t == "VILLA": return "villa"
    if t in ("ESTATE", "FARM"): return "estate"
    if t == "PENTHOUSE": return "penthouse"
    if t in ("RETREAT", "RESORT"): return "retreat"
    if t in ("COTTAGE", "BUNGALOW", "HOMESTAY"): return "bungalow"
    return "villa"

def clean_title(name: str) -> str:
    # "Laguna Aura | 4-BHK | Pvt Pool & Garden | Bar" → "Laguna Aura"
    # Keep the first segment (the actual name), strip BHK/generic descriptors
    parts = [p.strip() for p in name.split("|")]
    if len(parts) > 1:
        return parts[0].strip()
    return name.strip()

def get_per_night_price(item: dict):
    quotes = item.get("quotes") or []
    for q in quotes:
        ppn = q.get("netPerNightAmountAfterTax")
        if ppn and ppn > 0:
            return int(round(ppn))
    # Fallback: priceAmount / nights
    price_amt = item.get("priceAmount")
    if price_amt and price_amt > 0:
        return int(round(price_amt / 5))  # checkin to checkout = 5 nights default
    return None

def fetch_state(state_slug: str) -> list[dict]:
    properties = []
    page = 0
    total_pages = 1
    while page < total_pages:
        url = (
            f"{BASE}/v1/properties/rates"
            f"?checkinDate={CHECKIN}&checkoutDate={CHECKOUT}"
            f"&adults={ADULTS}&city={state_slug}&page={page}&pageSize={PAGE_SIZE}"
        )
        req = urllib.request.Request(url, headers={
            "Api-Key": API_KEY, "Channel-Id": CHANNEL_ID
        })
        with urllib.request.urlopen(req, timeout=30) as resp:
            d = json.loads(resp.read())
        total_pages = d.get("pagesCount", 1)
        items = d.get("list") or []
        properties.extend(items)
        print(f"  page {page+1}/{total_pages}: {len(items)} items", flush=True)
        page += 1
        if page < total_pages:
            time.sleep(0.4)
    return properties

def map_to_property(item: dict):
    prop_id = item.get("id", "")
    if not prop_id:
        return None

    slug = item.get("slug") or re.sub(r"[^a-z0-9]+", "-", item.get("name", "").lower()).strip("-")
    raw_city = item.get("city") or ""
    state    = item.get("state") or ""
    dest_slug = CITY_TO_DEST.get(raw_city) or STATE_TO_DEST.get(state) or "goa"
    country   = DEST_COUNTRY.get(dest_slug, "India")

    metrics   = item.get("metrics") or []
    bedrooms  = get_metric(metrics, "Bedrooms") or 1
    bathrooms = get_metric(metrics, "Bathrooms") or 1
    max_guests= item.get("maxAdults") or item.get("maxOccupancy") or 4

    amenities = [a["name"] for a in (item.get("amenities") or []) if a.get("name")]
    top_amenities = item.get("topAmenities") or []
    all_amenity_names = amenities + [a.get("name","") for a in top_amenities if isinstance(a, dict)]

    images = []
    for img in item.get("images") or []:
        url = img.get("url") or img.get("mobileUrl") or ""
        if url and "http" in url:
            images.append(url)
    if not images:
        return None  # skip properties with no images

    # Sections: check-in rules, house rules, meals, nearest places
    sections = []
    for s in item.get("sections") or []:
        title   = (s.get("title") or "").strip()
        content = strip_html(s.get("description") or s.get("content") or "")
        if title and content:
            sections.append({"title": title, "content": content})

    description   = strip_html(item.get("description") or "")
    short_desc    = description[:220].rstrip()
    if len(description) > 220:
        short_desc = short_desc.rsplit(" ", 1)[0] + "..."

    per_night = get_per_night_price(item)
    is_sold_out = item.get("soldOut", False)

    title = clean_title(item.get("name") or "")

    return {
        "id":               prop_id,
        "slug":             slug,
        "code":             prop_id,  # use elivaas id as code
        "title":            title,
        "destination_id":   dest_slug,
        "destination_slug": dest_slug,
        "city":             raw_city or state,
        "country":          country,
        "state":            state,
        "bedrooms":         bedrooms,
        "bathrooms":        bathrooms,
        "max_guests":       max_guests,
        "has_pool":         has_pool(item.get("amenities") or []),
        "description":      description or f"{title} — a luxury {map_property_type(item.get('type',''))} in {raw_city}.",
        "short_description": short_desc or f"Luxury {map_property_type(item.get('type',''))} in {raw_city}",
        "amenities":        list(dict.fromkeys(amenities)),  # deduplicate
        "images":           images,
        "sections":         sections,
        "featured":         False,
        "price_on_request": is_sold_out or per_night is None,
        "starting_price":   per_night,
        "property_type":    map_property_type(item.get("type") or "VILLA"),
    }

def to_ts_string(s: str) -> str:
    escaped = s.replace("\\", "\\\\").replace("`", "\\`").replace("$", "\\$")
    return f"`{escaped}`"

def prop_to_ts(p: dict) -> str:
    amenities_ts = ",\n      ".join(f'"{a}"' for a in p["amenities"])
    images_ts    = ",\n      ".join(f'"{u}"' for u in p["images"])
    starting_price_ts = f"\n    starting_price: {p['starting_price']}," if p["starting_price"] else ""
    sections = p.get("sections") or []
    sections_ts = ""
    if sections:
        inner = ",\n      ".join(
            f'{{ title: {to_ts_string(s["title"])}, content: {to_ts_string(s["content"])} }}'
            for s in sections
        )
        sections_ts = f"\n    sections: [\n      {inner}\n    ],"
    return f"""  {{
    id: "{p['id']}",
    slug: "{p['slug']}",
    code: "{p['code']}",
    title: {to_ts_string(p['title'])},
    destination_id: "{p['destination_id']}",
    destination_slug: "{p['destination_slug']}",
    city: "{p['city']}",
    country: "{p['country']}",
    state: "{p['state']}",
    bedrooms: {p['bedrooms']},
    bathrooms: {p['bathrooms']},
    max_guests: {p['max_guests']},
    has_pool: {str(p['has_pool']).lower()},
    description: {to_ts_string(p['description'])},
    short_description: {to_ts_string(p['short_description'])},
    amenities: [
      {amenities_ts}
    ],
    images: [
      {images_ts}
    ],
    featured: false,
    price_on_request: {str(p['price_on_request']).lower()},{starting_price_ts}{sections_ts}
    property_type: "{p['property_type']}",
  }}"""


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    API_KEY    = os.environ.get("ELIVAAS_API_KEY", "")
    CHANNEL_ID = os.environ.get("ELIVAAS_CHANNEL_ID", "")
    if not API_KEY or not CHANNEL_ID:
        print("ERROR: ELIVAAS_API_KEY and ELIVAAS_CHANNEL_ID must be set", file=sys.stderr)
        sys.exit(1)

    all_items: dict[str, dict] = {}  # id → raw API item
    for state in STATES:
        print(f"\n── {state} ──", flush=True)
        try:
            items = fetch_state(state)
            for item in items:
                pid = item.get("id")
                if pid and pid not in all_items:
                    all_items[pid] = item
        except Exception as e:
            print(f"  ERROR: {e}", flush=True)
        time.sleep(0.5)

    print(f"\n── Mapping {len(all_items)} unique properties ──")
    mapped: list[dict] = []
    skipped = 0
    for item in all_items.values():
        p = map_to_property(item)
        if p:
            mapped.append(p)
        else:
            skipped += 1

    print(f"Mapped: {len(mapped)} | Skipped (no images): {skipped}")

    # Sort by destination_slug, then city, then title
    mapped.sort(key=lambda p: (p["destination_slug"], p["city"], p["title"]))

    # Write TypeScript file
    out_path = Path(__file__).parent.parent / "data" / "elivaas-properties.ts"
    # Allow override via arg
    if len(sys.argv) > 1:
        out_path = Path(sys.argv[1])

    ts_entries = ",\n".join(prop_to_ts(p) for p in mapped)
    ts_content = f"""import {{ Property }} from "@/types";

// Auto-generated by scripts/fetch-elivaas.py — do not edit by hand.
// Source: Elivaas Distribution API ({'sandbox' if USE_SANDBOX else 'production'})
// Last fetched: {__import__('datetime').datetime.now().strftime('%Y-%m-%d')}
// Properties: {len(mapped)}

export const elivaasProperties: Property[] = [
{ts_entries}
];
"""

    out_path.write_text(ts_content, encoding="utf-8")
    print(f"\nWrote {len(mapped)} properties to {out_path}")
