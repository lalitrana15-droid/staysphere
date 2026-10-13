"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Users, MapPin, ChevronDown, Search } from "lucide-react";
import { properties } from "@/data/properties";

const allDestinations = Array.from(
  new Map(
    properties.map((p) => [p.city, { city: p.city, state: p.state, count: 0 }])
  ).values()
).map((d) => ({ ...d, count: properties.filter((p) => p.city === d.city).length }))
  .sort((a, b) => a.city.localeCompare(b.city));

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

  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get("city") ?? "");
  const [guests, setGuests] = useState<number>(parseInt(searchParams.get("guests") ?? "0") || 0);
  const [destOpen, setDestOpen] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedCity(searchParams.get("city") ?? "");
    setGuests(parseInt(searchParams.get("guests") ?? "0") || 0);
  }, [searchParams]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
        setDestSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredDests = allDestinations.filter((d) =>
    d.city.toLowerCase().includes(destSearch.toLowerCase())
  );

  function applySearch() {
    const params = new URLSearchParams();
    if (selectedCity) params.set("city", selectedCity);
    if (guests > 0) params.set("guests", String(guests));
    const qs = params.toString();
    router.replace(qs ? `/properties?${qs}` : "/properties", { scroll: false });
    setDestOpen(false);
  }

  const filtered = useMemo(() => {
    let list = properties;
    if (selectedCity) list = list.filter((p) => p.city === selectedCity);
    if (guests > 0) list = list.filter((p) => p.max_guests >= guests);
    return list;
  }, [selectedCity, guests]);

  return (
    <div className="pt-20 min-h-screen bg-[#faf9f7] dark:bg-[#0a0a0a]">
      {/* Hero / Search Bar */}
      <div className="bg-white dark:bg-[#0f0f0f] border-b border-stone-200/60 dark:border-stone-800/60 py-10">
        <div className="luxury-container">
          <p className="label-text mb-2">Our Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-8">
            All Villas
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#181818] shadow-sm">
            {/* Destination */}
            <div ref={destRef} className="relative flex-1 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-700">
              <button
                onClick={() => { setDestOpen((o) => !o); }}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-charcoal/40 dark:text-ivory/40 mb-0.5">Destination</p>
                  <p className={`text-sm font-sans truncate ${selectedCity ? "text-charcoal dark:text-ivory" : "text-charcoal/30 dark:text-ivory/30"}`}>
                    {selectedCity || "All destinations"}
                  </p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-charcoal/30 dark:text-ivory/30 transition-transform duration-200 ${destOpen ? "rotate-180" : ""}`} />
              </button>

              {destOpen && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-[#181818] border border-stone-200 dark:border-stone-700 shadow-luxury mt-1 max-h-72 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-stone-100 dark:border-stone-800">
                    <input
                      type="text"
                      placeholder="Search destinations..."
                      value={destSearch}
                      onChange={(e) => setDestSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm font-sans bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-charcoal dark:text-ivory placeholder:text-charcoal/30 dark:placeholder:text-ivory/30 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto">
                    <button
                      onClick={() => { setSelectedCity(""); setDestOpen(false); setDestSearch(""); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors ${!selectedCity ? "bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400" : "text-charcoal/70 dark:text-ivory/70 hover:bg-stone-50 dark:hover:bg-stone-800"}`}
                    >
                      All destinations
                      <span className="ml-2 text-xs text-charcoal/30 dark:text-ivory/30">({properties.length})</span>
                    </button>
                    {filteredDests.map((d) => (
                      <button
                        key={d.city}
                        onClick={() => { setSelectedCity(d.city); setDestOpen(false); setDestSearch(""); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors ${selectedCity === d.city ? "bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400" : "text-charcoal/70 dark:text-ivory/70 hover:bg-stone-50 dark:hover:bg-stone-800"}`}
                      >
                        {d.city}
                        {d.state ? <span className="text-charcoal/30 dark:text-ivory/30">, {d.state}</span> : null}
                        <span className="ml-2 text-xs text-charcoal/30 dark:text-ivory/30">({d.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-700 md:w-52">
              <Users className="w-4 h-4 text-gold-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-charcoal/40 dark:text-ivory/40 mb-0.5">Guests</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGuests((g) => Math.max(0, g - 1))}
                    className="w-5 h-5 flex items-center justify-center text-charcoal/40 dark:text-ivory/40 hover:text-charcoal dark:hover:text-ivory border border-stone-200 dark:border-stone-700 text-sm leading-none"
                  >−</button>
                  <span className="text-sm font-sans text-charcoal dark:text-ivory w-6 text-center">
                    {guests === 0 ? "Any" : guests}
                  </span>
                  <button
                    onClick={() => setGuests((g) => g + 1)}
                    className="w-5 h-5 flex items-center justify-center text-charcoal/40 dark:text-ivory/40 hover:text-charcoal dark:hover:text-ivory border border-stone-200 dark:border-stone-700 text-sm leading-none"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={applySearch}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px] font-sans font-semibold tracking-[0.15em] uppercase">Search</span>
            </button>
          </div>

          {/* Result count */}
          <p className="mt-4 text-sm font-sans text-charcoal/50 dark:text-ivory/50">
            <span className="text-charcoal dark:text-ivory font-medium">{filtered.length}</span> villas
            {selectedCity && <span className="text-gold-600 dark:text-gold-400"> in {selectedCity}</span>}
            {guests > 0 && <span> · {guests}+ guests</span>}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="luxury-container py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-charcoal/40 dark:text-ivory/40 font-sans text-sm mb-3">No villas found</p>
            <button onClick={() => { setSelectedCity(""); setGuests(0); router.replace("/properties", { scroll: false }); }}
              className="text-gold-600 dark:text-gold-400 text-xs font-sans underline underline-offset-2">
              Clear filters
            </button>
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
                  {property.has_pool && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[9px] font-sans font-medium tracking-[0.12em] uppercase border border-white/30">
                        Pool
                      </span>
                    </div>
                  )}
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
