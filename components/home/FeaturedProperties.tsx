"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BedDouble, Bath, Users, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { properties } from "@/data/properties";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Beach View", value: "beach" },
  { label: "Lake View", value: "lake" },
  { label: "Mountain View", value: "mountain" },
  { label: "Ocean View", value: "ocean" },
] as const;

type FilterValue = typeof FILTERS[number]["value"];

function matchesFilter(tags: string[], filter: FilterValue) {
  if (filter === "all") return true;
  if (filter === "beach") return tags.some(t => ["beach", "beachfront", "secret beach"].includes(t));
  if (filter === "lake") return tags.some(t => t.includes("lake"));
  if (filter === "mountain") return tags.some(t => ["mountain", "mountains", "hills"].includes(t));
  if (filter === "ocean") return tags.some(t => t.includes("ocean"));
  return false;
}

export function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filtered = properties
    .filter(p => matchesFilter(p.tags ?? [], activeFilter))
    .slice(0, 6);

  return (
    <section className="section-padding bg-ivory dark:bg-[#0A0A0A]">
      <div className="luxury-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
          <div>
            <p className="label-text mb-4">Handpicked For You</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory">
              Featured Properties
            </h2>
            <div className="w-16 h-px bg-gold-500 mt-5" />
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium tracking-[0.1em] uppercase text-charcoal/60 dark:text-ivory/60 hover:text-gold-600 dark:hover:text-gold-400 hover:gap-4 transition-all duration-300"
          >
            View All Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 text-xs font-sans font-medium tracking-[0.1em] uppercase transition-all duration-200 ${
                activeFilter === f.value
                  ? "bg-charcoal dark:bg-ivory text-ivory dark:text-charcoal"
                  : "bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 text-charcoal/60 dark:text-ivory/60 hover:border-gold-500 hover:text-gold-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-sm font-sans text-charcoal/40 dark:text-ivory/40">
            No properties found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PropertyCard({ property }: { property: typeof properties[0] }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = property.images?.length ? property.images : ["/placeholder.jpg"];

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-white dark:bg-[#121212] overflow-hidden transition-all duration-500 hover:shadow-luxury"
    >
      {/* Image Carousel */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={images[imgIndex]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <span className="px-3 py-1 bg-gold-500 text-white text-[9px] font-sans font-medium tracking-[0.15em] uppercase">
              Featured
            </span>
          )}
          {property.has_pool && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[9px] font-sans font-medium tracking-[0.15em] uppercase border border-white/30">
              Pool
            </span>
          )}
        </div>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full transition-all ${i === imgIndex ? "bg-white w-3" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Price */}
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-sans font-light tracking-wide">
            Price on Request
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <p className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-1">
            {property.city}, {property.country}
          </p>
          <h3 className="font-serif text-xl font-light text-charcoal dark:text-ivory leading-snug group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
            {property.code ?? property.title}
          </h3>
        </div>
        <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed mb-5 line-clamp-2">
          {property.short_description}
        </p>
        <div className="flex items-center gap-5 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 text-charcoal/50 dark:text-ivory/50">
            <BedDouble className="w-3.5 h-3.5" />
            <span className="text-xs font-sans">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-charcoal/50 dark:text-ivory/50">
            <Bath className="w-3.5 h-3.5" />
            <span className="text-xs font-sans">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-charcoal/50 dark:text-ivory/50">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-sans">{property.max_guests}</span>
          </div>
          {property.has_pool && (
            <div className="flex items-center gap-1.5 text-charcoal/50 dark:text-ivory/50">
              <Waves className="w-3.5 h-3.5" />
              <span className="text-xs font-sans">Pool</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1 text-charcoal/40 dark:text-ivory/40 group-hover:text-gold-500 dark:group-hover:text-gold-400 group-hover:gap-2 transition-all duration-300">
            <span className="text-xs font-sans font-medium tracking-[0.08em] uppercase">View</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
