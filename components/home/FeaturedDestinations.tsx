"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { destinations } from "@/data/destinations";
export function FeaturedDestinations() {
  return (
    <section className="section-padding bg-white dark:bg-[#0D0D0D]">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="label-text mb-4">Where Will You Go?</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-5">
            Featured Destinations
          </h2>
          <div className="luxury-divider" />
          <p className="font-sans text-sm text-charcoal/60 dark:text-ivory/60 max-w-xl mx-auto mt-6 leading-relaxed">
            From the lake palaces of Rajasthan to the clifftops of Bali — every destination in our network has been chosen for its capacity to astonish.
          </p>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.slice(0, 8).map((dest) => (
            <DestinationCard
              key={dest.slug}
              destination={dest}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium tracking-[0.1em] uppercase text-gold-600 dark:text-gold-400 hover:gap-4 transition-all duration-300"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DestinationCard({
  destination,
}: {
  destination: (typeof destinations)[0];
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative overflow-hidden block h-[220px] md:h-[260px]"
    >
      <Image
        src={destination.hero_image}
        alt={destination.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <p className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-gold-300 mb-1">
          {destination.state || destination.country}
        </p>
        <h3 className="font-serif text-white font-light text-xl md:text-2xl leading-tight">
          {destination.name}
        </h3>
        <div className="flex items-center gap-1 mt-2 text-gold-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-xs font-sans font-medium tracking-[0.1em] uppercase">Explore</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
