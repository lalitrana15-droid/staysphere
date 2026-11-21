import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { properties } from "@/data/properties";
import { filterPropertyImages, sizedImage } from "@/lib/image-utils";
import { VillaCarousel, type VillaCard } from "./VillaCarousel";

const PLACEHOLDER_PRICE = 79152;

function badgeFor(p: (typeof properties)[number]): string {
  const tags = (p.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes("heritage"))) return "Heritage";
  if (p.has_pool) return "Pool Villa";
  if (p.featured) return "Luxury";
  return p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1);
}

/** Picks up to 8 villas: featured first, real-priced next, one per destination for variety. */
function pickVillas(): VillaCard[] {
  // Only villas whose first photo is a hosted URL (local /photoshoots files may be missing)
  const usable = properties.filter((p) => filterPropertyImages(p.images ?? [])[0]?.startsWith("https://"));
  const rank = (p: (typeof properties)[number]) =>
    (p.featured ? 2 : 0) + (p.starting_price && p.starting_price !== PLACEHOLDER_PRICE ? 1 : 0);
  const sorted = [...usable].sort((a, b) => rank(b) - rank(a));

  const seen = new Set<string>();
  const picked: typeof properties = [];
  for (const p of sorted) {
    if (seen.has(p.destination_slug)) continue;
    seen.add(p.destination_slug);
    picked.push(p);
    if (picked.length === 8) break;
  }

  return picked.map((p) => ({
    slug: p.slug,
    title: p.title,
    location: [p.city, p.state].filter(Boolean).join(", "),
    image: sizedImage(filterPropertyImages(p.images)[0], 800),
    badge: badgeFor(p),
    price:
      p.starting_price && p.starting_price !== PLACEHOLDER_PRICE ? p.starting_price : null,
  }));
}

export function FeaturedVillas() {
  const villas = pickVillas();

  return (
    <section className="pt-12 md:pt-28 pb-16 md:pb-24 bg-ivory dark:bg-[#0A0A0A]">
      <div className="luxury-container">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <p className="font-serif italic text-sm tracking-[0.15em] text-gold-600 dark:text-gold-400 mb-2">
              Our Collection
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-charcoal dark:text-ivory">
              Featured Villas
            </h2>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-sans text-charcoal/70 dark:text-ivory/70 hover:text-gold-600 dark:hover:text-gold-400 underline underline-offset-8 decoration-gold-500/50 whitespace-nowrap transition-colors"
          >
            View All Villas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <VillaCarousel villas={villas} />
      </div>
    </section>
  );
}
