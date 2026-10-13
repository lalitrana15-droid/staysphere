"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Users, Search } from "lucide-react";
import { properties } from "@/data/properties";

// Build unique destination list from actual property data
const allDestinations = Array.from(
  new Map(properties.map((p) => [p.destination_slug, { slug: p.destination_slug, city: p.city }])).values()
).sort((a, b) => a.city.localeCompare(b.city));

export default function VillasPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen bg-[#faf9f7] dark:bg-[#0a0a0a]" />}>
      <VillasContent />
    </Suspense>
  );
}

function VillasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string>(searchParams.get("destination") ?? "all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const dest = searchParams.get("destination");
    setSelected(dest ?? "all");
  }, [searchParams]);

  function selectDestination(slug: string) {
    setSelected(slug);
    if (slug === "all") {
      router.replace("/properties", { scroll: false });
    } else {
      router.replace(`/properties?destination=${slug}`, { scroll: false });
    }
  }

  const filtered = useMemo(() => {
    let list = selected === "all" ? properties : properties.filter((p) => p.destination_slug === selected);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.code ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [selected, search]);

  return (
    <div className="pt-20 min-h-screen bg-[#faf9f7] dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-white dark:bg-[#0f0f0f] border-b border-stone-200/60 dark:border-stone-800/60 py-12">
        <div className="luxury-container">
          <p className="label-text mb-3">Our Collection</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory">
              All Villas
            </h1>
            <span className="font-sans text-sm text-charcoal/50 dark:text-ivory/50">
              {filtered.length} {filtered.length === 1 ? "villa" : "villas"}
              {selected !== "all" && (
                <span className="text-gold-600 dark:text-gold-400">
                  {" "}in {allDestinations.find((d) => d.slug === selected)?.city}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="luxury-container py-4">
          {/* Search */}
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/30 dark:text-ivory/30" />
            <input
              type="text"
              placeholder="Search villas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm font-sans bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-charcoal dark:text-ivory placeholder:text-charcoal/30 dark:placeholder:text-ivory/30 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Destination tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => selectDestination("all")}
              className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-sans font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
                selected === "all"
                  ? "bg-charcoal text-ivory dark:bg-ivory dark:text-charcoal"
                  : "bg-stone-100 dark:bg-stone-800 text-charcoal/60 dark:text-ivory/60 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              All ({properties.length})
            </button>
            {allDestinations.map((dest) => {
              const count = properties.filter((p) => p.destination_slug === dest.slug).length;
              return (
                <button
                  key={dest.slug}
                  onClick={() => selectDestination(dest.slug)}
                  className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-sans font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
                    selected === dest.slug
                      ? "bg-gold-500 text-white"
                      : "bg-stone-100 dark:bg-stone-800 text-charcoal/60 dark:text-ivory/60 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  {dest.city} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="luxury-container py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-charcoal/40 dark:text-ivory/40 font-sans text-sm">
            No villas found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="group bg-white dark:bg-[#121212] overflow-hidden block transition-all duration-500 hover:shadow-luxury"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.has_pool && (
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[9px] font-sans font-medium tracking-[0.12em] uppercase border border-white/30">
                        Pool
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white/70 text-[9px] font-sans tracking-[0.12em] uppercase">
                      {property.city}{property.state ? `, ${property.state}` : ""}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-light text-charcoal dark:text-ivory mb-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300 line-clamp-1">
                    {property.code ?? property.title}
                  </h3>
                  <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mb-4 line-clamp-2 leading-relaxed">
                    {property.short_description}
                  </p>
                  <div className="flex items-center gap-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-1.5 text-charcoal/40 dark:text-ivory/40">
                      <BedDouble className="w-3 h-3" />
                      <span className="text-[11px] font-sans">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-charcoal/40 dark:text-ivory/40">
                      <Bath className="w-3 h-3" />
                      <span className="text-[11px] font-sans">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-charcoal/40 dark:text-ivory/40">
                      <Users className="w-3 h-3" />
                      <span className="text-[11px] font-sans">{property.max_guests} guests</span>
                    </div>
                    {property.starting_price && (
                      <div className="ml-auto text-right">
                        <span className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40">from </span>
                        <span className="text-xs font-sans font-medium text-gold-600 dark:text-gold-400">
                          ₹{property.starting_price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
