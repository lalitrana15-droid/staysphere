import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { properties } from "@/data/properties";
import { VillasSearchBar } from "@/components/property/VillasSearchBar";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { ListingToolbar } from "@/components/property/ListingToolbar";
import { fetchLivePrices, uniqueStates } from "@/lib/elivaas-rates";
import { filterPropertyImages } from "@/lib/image-utils";
import {
  applyFilters,
  facetCounts,
  normaliseCity,
  parseList,
  type ListedProperty,
} from "@/lib/property-filters";

const PAGE_SIZE = 24;
const PLACEHOLDER_PRICE = 79152;

const allDestinations = Array.from(
  new Map(
    properties.map((p) => {
      const city = normaliseCity(p.city);
      return [city, { city, state: p.state ?? "", count: 0 }];
    })
  ).values()
)
  .map((d) => ({
    ...d,
    count: properties.filter((p) => normaliseCity(p.city) === d.city).length,
  }))
  .sort((a, b) => a.city.localeCompare(b.city));

type SP = {
  city?: string;
  guests?: string;
  checkin?: string;
  checkout?: string;
  page?: string;
  beds?: string;
  amenities?: string;
  types?: string;
  sort?: string;
  view?: string;
};

function buildHref(sp: SP, page: number) {
  const params = new URLSearchParams();
  (Object.entries(sp) as [string, string | undefined][]).forEach(([k, v]) => {
    if (v && k !== "page") params.set(k, v);
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

export default async function VillasPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const cities = parseList(sp.city);
  const guests = parseInt(sp.guests ?? "0") || 0;
  const checkin = sp.checkin ?? "";
  const checkout = sp.checkout ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);
  const view = sp.view === "list" ? "list" : "grid";
  const sort = sp.sort ?? "recommended";

  const filtered = applyFilters(properties, {
    cities,
    guests,
    beds: parseList(sp.beds),
    amenities: parseList(sp.amenities),
    types: parseList(sp.types),
    sort,
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Live prices only when dates are selected
  const livePrices: Record<string, number> = {};
  if (checkin && checkout) {
    Object.assign(livePrices, await fetchLivePrices(checkin, checkout, uniqueStates(paginated)));
  }

  const detailQuery = new URLSearchParams();
  if (checkin) detailQuery.set("checkin", checkin);
  if (checkout) detailQuery.set("checkout", checkout);
  if (guests > 0) detailQuery.set("guests", String(guests));
  const dq = detailQuery.toString();
  const propertyHref = (slug: string) => (dq ? `/properties/${slug}?${dq}` : `/properties/${slug}`);

  return (
    <div className="pt-20 min-h-screen bg-[#faf9f7] dark:bg-[#0a0a0a]">
      {/* Header + search */}
      <div className="luxury-container pt-8 pb-8">
        <nav className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 mb-5">
          <Link href="/" className="hover:text-gold-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal dark:text-ivory">Villas</span>
        </nav>
        <p className="text-[11px] font-sans font-semibold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400 mb-2">
          Our Collection
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-charcoal dark:text-ivory mb-3">
          Find your perfect villa
        </h1>
        <p className="font-sans text-sm md:text-base text-charcoal/70 dark:text-ivory/70 mb-8 max-w-2xl">
          Discover handpicked villas for your next getaway. Search, filter and book stays across India and beyond.
        </p>

        <Suspense fallback={null}>
          <VillasSearchBar
            destinations={allDestinations}
            currentCity={cities.length === 1 ? cities[0] : ""}
            currentGuests={guests}
            currentCheckin={checkin}
            currentCheckout={checkout}
          />
        </Suspense>
      </div>

      {/* Filters + results */}
      <div className="luxury-container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={null}>
              <PropertyFilters destinations={allDestinations} counts={facetCounts()} />
            </Suspense>
          </aside>

          <section>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="font-serif text-2xl text-charcoal dark:text-ivory">
                {totalCount} villa{totalCount === 1 ? "" : "s"}
              </h2>
              <Suspense fallback={null}>
                <ListingToolbar sort={sort} view={view} />
              </Suspense>
            </div>

            {totalCount === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-[#121212] rounded-2xl border border-stone-200/70 dark:border-stone-800">
                <p className="text-charcoal/50 dark:text-ivory/50 font-sans text-sm mb-3">
                  No villas match these filters
                </p>
                <Link href="/properties" className="text-gold-600 dark:text-gold-400 text-sm font-sans underline underline-offset-2">
                  Clear all filters
                </Link>
              </div>
            ) : (
              <>
                <div
                  className={
                    view === "list"
                      ? "flex flex-col gap-5"
                      : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  }
                >
                  {paginated.map((property, i) => (
                    <VillaCard
                      key={property.id}
                      property={property}
                      view={view}
                      href={propertyHref(property.slug)}
                      price={
                        livePrices[property.id] ||
                        (property.starting_price && property.starting_price !== PLACEHOLDER_PRICE
                          ? property.starting_price
                          : null)
                      }
                      priority={i < 6}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                    {page > 1 && (
                      <Link
                        href={buildHref(sp, page - 1)}
                        aria-label="Previous page"
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#121212] hover:border-gold-500"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Link>
                    )}
                    {pageList(page, totalPages).map((p, i) =>
                      p === "…" ? (
                        <span key={`e${i}`} className="w-8 text-center text-charcoal/40">…</span>
                      ) : (
                        <Link
                          key={p}
                          href={buildHref(sp, p)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-sans transition-colors ${
                            p === page
                              ? "bg-gold-500 text-white"
                              : "text-charcoal/70 dark:text-ivory/70 hover:text-gold-600"
                          }`}
                        >
                          {p}
                        </Link>
                      )
                    )}
                    {page < totalPages && (
                      <Link
                        href={buildHref(sp, page + 1)}
                        aria-label="Next page"
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#121212] hover:border-gold-500"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function VillaCard({
  property,
  view,
  href,
  price,
  priority,
}: {
  property: ListedProperty;
  view: "grid" | "list";
  href: string;
  price: number | null;
  priority: boolean;
}) {
  const image = filterPropertyImages(property.images)[0] ?? property.images[0];
  const list = view === "list";

  return (
    <Link
      href={href}
      className={`group bg-white dark:bg-[#121212] rounded-2xl overflow-hidden border border-stone-200/60 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 ${
        list ? "flex flex-col sm:flex-row" : "block"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-stone-100 dark:bg-stone-900 ${
          list ? "sm:w-72 sm:flex-none h-56 sm:h-auto" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={image}
          alt={property.title}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={list ? "288px" : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        {property.has_pool && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gold-200/95 text-charcoal text-[10px] font-sans font-semibold tracking-[0.12em] uppercase">
            Pool
          </span>
        )}
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-sans">
          <MapPin className="w-3.5 h-3.5 text-gold-300" />
          {property.city}
          {property.state ? `, ${property.state}` : ""}
        </span>
      </div>

      <div className={`p-5 flex flex-col ${list ? "flex-1" : ""}`}>
        <h3 className="font-serif text-xl text-charcoal dark:text-ivory mb-1.5 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors line-clamp-1">
          {property.title.split("|")[0].trim()}
        </h3>
        <p className={`text-[13px] font-sans text-charcoal/65 dark:text-ivory/65 leading-relaxed mb-4 ${list ? "line-clamp-3" : "line-clamp-2"}`}>
          {property.short_description}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-charcoal/60 dark:text-ivory/60">
          <span className="flex items-center gap-1.5 text-xs font-sans"><BedDouble className="w-4 h-4" />{property.bedrooms}</span>
          <span className="flex items-center gap-1.5 text-xs font-sans"><Bath className="w-4 h-4" />{property.bathrooms}</span>
          <span className="flex items-center gap-1.5 text-xs font-sans"><Users className="w-4 h-4" />{property.max_guests} guests</span>
          <span className="ml-auto text-right whitespace-nowrap">
            {price ? (
              <>
                <span className="text-[11px] font-sans text-charcoal/50 dark:text-ivory/50">from </span>
                <span className="text-sm font-sans font-semibold text-charcoal dark:text-ivory">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-sans text-charcoal/50 dark:text-ivory/50">/night</span>
              </>
            ) : (
              <span className="text-[10px] font-sans text-charcoal/50 dark:text-ivory/50 tracking-wide uppercase">
                Price on Request
              </span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
