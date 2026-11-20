import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Users, Calendar } from "lucide-react";
import { properties } from "@/data/properties";
import { VillasSearchBar } from "@/components/property/VillasSearchBar";
import { fetchLivePrices, uniqueStates } from "@/lib/elivaas-rates";

function normaliseCity(city: string): string {
  if (city === "North Goa" || city === "South Goa") return "Goa";
  return city;
}
function cityMatches(propertyCity: string, selected: string): boolean {
  if (propertyCity === selected) return true;
  if (normaliseCity(propertyCity) === selected) return true;
  return false;
}

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

const PAGE_SIZE = 24;

function pageHref(
  p: number,
  filters: { city: string; checkin: string; checkout: string; guests: number }
) {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.checkin) params.set("checkin", filters.checkin);
  if (filters.checkout) params.set("checkout", filters.checkout);
  if (filters.guests > 0) params.set("guests", String(filters.guests));
  if (p > 1) params.set("page", String(p));
  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

function PaginationLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-xs font-sans font-medium transition-colors ${
        active
          ? "bg-charcoal dark:bg-ivory text-ivory dark:text-charcoal"
          : "text-charcoal/50 dark:text-ivory/50 hover:text-charcoal dark:hover:text-ivory border border-stone-200 dark:border-stone-700 hover:border-gold-500"
      }`}
    >
      {label}
    </Link>
  );
}

export default async function VillasPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    guests?: string;
    checkin?: string;
    checkout?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const city = params.city ?? "";
  const guests = parseInt(params.guests ?? "0") || 0;
  const checkin = params.checkin ?? "";
  const checkout = params.checkout ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);

  let filtered = properties;
  if (city) filtered = filtered.filter((p) => cityMatches(p.city, city));
  if (guests > 0) filtered = filtered.filter((p) => p.max_guests >= guests);

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Fetch live prices from Elivaas API when dates are selected
  const livePrices: Record<string, number> = {};
  if (checkin && checkout) {
    const states = uniqueStates(filtered);
    const prices = await fetchLivePrices(checkin, checkout, states);
    Object.assign(livePrices, prices);
  }

  function propertyHref(slug: string) {
    const p = new URLSearchParams();
    if (checkin) p.set("checkin", checkin);
    if (checkout) p.set("checkout", checkout);
    if (guests > 0) p.set("guests", String(guests));
    const qs = p.toString();
    return qs ? `/properties/${slug}?${qs}` : `/properties/${slug}`;
  }

  function formatDate(d: string) {
    if (!d) return "";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="pt-20 min-h-screen bg-[#faf9f7] dark:bg-[#0a0a0a]">
      {/* Hero / Search Bar */}
      <div className="bg-white dark:bg-[#0f0f0f] border-b border-stone-200/60 dark:border-stone-800/60 py-10">
        <div className="luxury-container">
          <p className="label-text mb-2">Our Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-8">
            All Villas
          </h1>

          <Suspense fallback={null}>
            <VillasSearchBar
              destinations={allDestinations}
              currentCity={city}
              currentGuests={guests}
              currentCheckin={checkin}
              currentCheckout={checkout}
            />
          </Suspense>

          {/* Result count + date summary */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-sans text-charcoal/50 dark:text-ivory/50">
            <span>
              <span className="text-charcoal dark:text-ivory font-medium">
                {totalCount}
              </span>{" "}
              villas
              {city && (
                <span className="text-gold-600 dark:text-gold-400">
                  {" "}
                  in {city}
                </span>
              )}
              {guests > 0 && <span> · {guests}+ guests</span>}
            </span>
            {(checkin || checkout) && (
              <span className="flex items-center gap-1.5 text-gold-600 dark:text-gold-400 text-xs font-medium">
                <Calendar className="w-3 h-3" />
                {checkin && formatDate(checkin)}
                {checkin && checkout && " → "}
                {checkout && formatDate(checkout)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="luxury-container py-12">
        {totalCount === 0 ? (
          <div className="text-center py-24">
            <p className="text-charcoal/40 dark:text-ivory/40 font-sans text-sm mb-3">
              No villas found
            </p>
            <Link
              href="/properties"
              className="text-gold-600 dark:text-gold-400 text-xs font-sans underline underline-offset-2"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((property, i) => (
                <Link
                  key={property.id}
                  href={propertyHref(property.slug)}
                  className="group bg-white dark:bg-[#121212] overflow-hidden block transition-all duration-500 hover:shadow-luxury"
                >
                  <div className="relative h-60 overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <Image
                      src={`${property.images[0]}?w=800`}
                      alt={property.title}
                      fill
                      priority={i < 6}
                      loading={i < 6 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {property.has_pool && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[9px] font-sans font-medium tracking-[0.12em] uppercase border border-white/30">
                          Pool
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-white/70 text-[9px] font-sans tracking-[0.12em] uppercase">
                        {property.city}
                        {property.state ? `, ${property.state}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-light text-charcoal dark:text-ivory mb-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mb-4 line-clamp-2 leading-relaxed">
                      {property.short_description}
                    </p>
                    <div className="flex items-center gap-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-1.5 text-charcoal/40 dark:text-ivory/40">
                        <BedDouble className="w-3 h-3" />
                        <span className="text-[11px] font-sans">
                          {property.bedrooms}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-charcoal/40 dark:text-ivory/40">
                        <Bath className="w-3 h-3" />
                        <span className="text-[11px] font-sans">
                          {property.bathrooms}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-charcoal/40 dark:text-ivory/40">
                        <Users className="w-3 h-3" />
                        <span className="text-[11px] font-sans">
                          {property.max_guests} guests
                        </span>
                      </div>
                      <div className="ml-auto text-right">
                        {(livePrices[property.id] || property.starting_price) ? (
                          <>
                            <span className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40">from </span>
                            <span className="text-xs font-sans font-medium text-gold-600 dark:text-gold-400">
                              ₹{(livePrices[property.id] || property.starting_price!).toLocaleString("en-IN")}
                              <span className="text-[9px] font-normal text-charcoal/40 dark:text-ivory/40">/night</span>
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 tracking-wide uppercase">
                            Price on Request
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-2">
                {page > 1 && (
                  <PaginationLink
                    href={pageHref(page - 1, { city, checkin, checkout, guests })}
                    label="← Prev"
                  />
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationLink
                    key={p}
                    href={pageHref(p, { city, checkin, checkout, guests })}
                    label={String(p)}
                    active={p === page}
                  />
                ))}
                {page < totalPages && (
                  <PaginationLink
                    href={pageHref(page + 1, { city, checkin, checkout, guests })}
                    label="Next →"
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
