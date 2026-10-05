"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { destinations } from "@/data/destinations";

const heroImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=90",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=90",
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=90",
];

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [guestCount, setGuestCount] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {heroImages.map((img, idx) => (
        <div
          key={img}
          className="absolute inset-0 transition-opacity duration-2000"
          style={{ opacity: idx === currentImage ? 1 : 0 }}
        >
          <Image
            src={img}
            alt="Luxury Villa"
            fill
            priority={idx === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full luxury-container text-center text-white">
        {/* Label */}
        <p className="text-xs font-sans font-medium tracking-[0.3em] uppercase text-gold-300 mb-6 animate-fade-in">
          Global Luxury Stay Distribution Network
        </p>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-none tracking-tight mb-6 animate-slide-up">
          Discover
          <br />
          <em className="font-light italic">Extraordinary</em>
          <br />
          Luxury Stays
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-base md:text-lg font-light text-white/80 max-w-xl mx-auto mb-12 leading-relaxed">
          Curated villas, retreats and luxury homes across India and the world.
        </p>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2">
            <div className="flex flex-col md:flex-row gap-0">
              {/* Destination */}
              <div className="flex-1 flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-white/15 transition-colors duration-200 cursor-pointer group">
                <MapPin className="w-4 h-4 text-gold-300 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-0.5">
                    Destination
                  </p>
                  <select
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-white text-sm font-sans font-light focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="" className="text-charcoal bg-white">
                      Where are you going?
                    </option>
                    {destinations.map((dest) => (
                      <option
                        key={dest.slug}
                        value={dest.slug}
                        className="text-charcoal bg-white"
                      >
                        {dest.name}, {dest.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/20" />

              {/* Guests */}
              <div className="flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-white/15 transition-colors duration-200">
                <div className="flex-1 text-left">
                  <p className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-0.5">
                    Guests
                  </p>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-transparent text-white text-sm font-sans font-light focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="" className="text-charcoal bg-white">
                      How many guests?
                    </option>
                    {[2, 4, 6, 8, 10, 12, 15, "15+"].map((n) => (
                      <option
                        key={n}
                        value={n}
                        className="text-charcoal bg-white"
                      >
                        {n} guests
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <Link
                href={
                  searchQuery
                    ? `/destinations/${searchQuery}`
                    : "/destinations"
                }
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white text-sm font-sans font-medium tracking-[0.1em] uppercase transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                Explore
              </Link>
            </div>
          </div>
        </div>

        {/* Image Dots */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`transition-all duration-300 ${
                idx === currentImage
                  ? "w-8 h-1 bg-gold-400"
                  : "w-2 h-1 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
