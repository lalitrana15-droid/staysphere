"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, ChevronRight, ChevronLeft } from "lucide-react";

export interface VillaCard {
  slug: string;
  title: string;
  location: string;
  image: string;
  badge: string;
  price: number | null;
}

export function VillaCarousel({ villas }: { villas: VillaCard[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {villas.map((v) => (
          <Link
            key={v.slug}
            href={`/properties/${v.slug}`}
            className="group relative flex-none snap-start w-[78%] sm:w-[44%] lg:w-[calc(25%-15px)] aspect-[4/4.6] rounded-2xl overflow-hidden"
          >
            <Image
              src={v.image}
              alt={v.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

            <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-gold-200/90 text-charcoal text-[10px] font-sans font-semibold tracking-[0.12em] uppercase">
              {v.badge}
            </span>
            <span
              aria-hidden
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center text-white"
            >
              <Heart className="w-4 h-4" />
            </span>

            <div className="absolute bottom-0 inset-x-0 p-4">
              <h3 className="font-serif text-lg md:text-xl text-white leading-snug line-clamp-2 mb-2">
                {v.title.split("|")[0].trim()}
              </h3>
              <div className="flex items-center justify-between gap-2 text-white/80 text-xs font-sans">
                <span className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-gold-300 flex-shrink-0" />
                  <span className="truncate">{v.location}</span>
                </span>
                <span className="whitespace-nowrap">
                  {v.price ? (
                    <>
                      From <b className="text-white font-semibold">₹{v.price.toLocaleString("en-IN")}</b>
                      <span className="text-white/60"> /night</span>
                    </>
                  ) : (
                    <span className="uppercase tracking-wide text-[10px]">Price on Request</span>
                  )}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous villas"
        className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white dark:bg-[#1a1a1a] shadow-lg items-center justify-center text-charcoal dark:text-ivory hover:text-gold-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next villas"
        className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white dark:bg-[#1a1a1a] shadow-lg items-center justify-center text-charcoal dark:text-ivory hover:text-gold-600 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
