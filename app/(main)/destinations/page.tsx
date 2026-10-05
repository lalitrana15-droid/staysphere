import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { destinations } from "@/data/destinations";
import { getPropertiesByDestination } from "@/data/properties";

export const metadata: Metadata = {
  title: "Destinations — Luxury Stays Across India & The World",
  description:
    "Explore our curated collection of luxury destinations — from the lake palaces of Udaipur to the beaches of Bali. Find your perfect luxury escape.",
};

export default function DestinationsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-charcoal overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1477587458883-47145ed68bfe?w=1920&q=90"
          alt="Destinations"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="relative z-10 text-center text-white luxury-container">
          <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-300 mb-4">
            Explore
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light">
            Our Destinations
          </h1>
          <div className="w-16 h-px bg-gold-500 mx-auto mt-6" />
        </div>
      </div>

      {/* Destinations */}
      <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => {
              const props = getPropertiesByDestination(destination.slug);
              return (
                <Link
                  key={destination.slug}
                  href={`/destinations/${destination.slug}`}
                  className="group bg-white dark:bg-[#121212] overflow-hidden block transition-all duration-500 hover:shadow-luxury"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={destination.hero_image}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center gap-1 text-xs font-sans text-white/80">
                        <MapPin className="w-3 h-3" />
                        {destination.state ? `${destination.state}, ` : ""}
                        {destination.country}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                      {destination.name}
                    </h2>
                    <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed mb-4 line-clamp-2">
                      {destination.short_description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                      <span className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/40 dark:text-ivory/40">
                        {props.length} {props.length === 1 ? "Property" : "Properties"}
                      </span>
                      <div className="flex items-center gap-1 text-gold-600 dark:text-gold-400 group-hover:gap-2 transition-all duration-300">
                        <span className="text-xs font-sans font-medium tracking-[0.08em] uppercase">
                          Explore
                        </span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
