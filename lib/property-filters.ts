import { properties } from "@/data/properties";

export type ListedProperty = (typeof properties)[number];

export const BEDROOM_OPTIONS = [
  { key: "1", label: "1 Bedroom" },
  { key: "2", label: "2 Bedrooms" },
  { key: "3", label: "3 Bedrooms" },
  { key: "4", label: "4 Bedrooms" },
  { key: "5", label: "5+ Bedrooms" },
];

const has = (p: ListedProperty, word: string) =>
  p.amenities.some((a) => a.toLowerCase().includes(word)) ||
  p.title.toLowerCase().includes(word) ||
  (p.tags ?? []).some((t) => t.toLowerCase().includes(word));

export const AMENITY_OPTIONS: { key: string; label: string; test: (p: ListedProperty) => boolean }[] = [
  { key: "pool", label: "Pool", test: (p) => p.has_pool },
  {
    key: "pet",
    label: "Pet Friendly",
    test: (p) =>
      /\bpet[- ]?friendly\b|\bpets? (are )?(allowed|welcome)\b/i.test(
        [p.title, p.short_description, p.description, ...p.amenities, ...(p.tags ?? [])].join(" ")
      ),
  },
  { key: "garden", label: "Garden", test: (p) => has(p, "garden") },
  { key: "chef", label: "Chef on Call", test: (p) => has(p, "chef") },
  { key: "ac", label: "Air Conditioning", test: (p) => has(p, "airconditioning") || has(p, "air conditioning") },
  { key: "parking", label: "Parking", test: (p) => has(p, "parking") },
  { key: "wifi", label: "Wi-Fi", test: (p) => has(p, "wifi") },
];

export const TYPE_OPTIONS = [
  { key: "villa", label: "Villa" },
  { key: "estate", label: "Estate" },
  { key: "bungalow", label: "Bungalow" },
  { key: "retreat", label: "Retreat" },
  { key: "penthouse", label: "Penthouse" },
];

export const SORT_OPTIONS = [
  { key: "recommended", label: "Recommended" },
  { key: "beds", label: "Most bedrooms" },
  { key: "guests", label: "Most guests" },
  { key: "name", label: "Name (A–Z)" },
];

export function normaliseCity(city: string): string {
  if (city === "North Goa" || city === "South Goa") return "Goa";
  return city;
}

export const parseList = (v?: string) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

export interface Filters {
  cities: string[];
  guests: number;
  beds: string[];
  amenities: string[];
  types: string[];
  sort: string;
}

export function applyFilters(list: ListedProperty[], f: Filters): ListedProperty[] {
  let out = list.filter((p) => {
    if (f.cities.length && !f.cities.includes(normaliseCity(p.city)) && !f.cities.includes(p.city)) return false;
    if (f.guests > 0 && p.max_guests < f.guests) return false;
    if (f.beds.length) {
      const ok = f.beds.some((b) => (b === "5" ? p.bedrooms >= 5 : p.bedrooms === Number(b)));
      if (!ok) return false;
    }
    if (f.types.length && !f.types.includes(p.property_type)) return false;
    for (const key of f.amenities) {
      const opt = AMENITY_OPTIONS.find((a) => a.key === key);
      if (opt && !opt.test(p)) return false;
    }
    return true;
  });

  if (f.sort === "beds") out = [...out].sort((a, b) => b.bedrooms - a.bedrooms);
  else if (f.sort === "guests") out = [...out].sort((a, b) => b.max_guests - a.max_guests);
  else if (f.sort === "name") out = [...out].sort((a, b) => a.title.localeCompare(b.title));
  return out;
}

/** Facet counts over the whole catalogue (static, shown next to each option). */
export function facetCounts() {
  const all = properties;
  return {
    beds: Object.fromEntries(
      BEDROOM_OPTIONS.map((o) => [o.key, all.filter((p) => (o.key === "5" ? p.bedrooms >= 5 : p.bedrooms === Number(o.key))).length])
    ),
    amenities: Object.fromEntries(AMENITY_OPTIONS.map((o) => [o.key, all.filter(o.test).length])),
    types: Object.fromEntries(TYPE_OPTIONS.map((o) => [o.key, all.filter((p) => p.property_type === o.key).length])),
  };
}
