"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, ChevronDown, Calendar, Users, Gem, CalendarCheck, Headset, ArrowRight, Play } from "lucide-react";
import { destinations } from "@/data/destinations";

const heroImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=90",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=90",
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&q=90",
];

export function HeroSection() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [destination, setDestination] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  function handleSearch() {
    const params = new URLSearchParams();
    if (destination) params.set("city", destination);
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (guests) params.set("guests", guests);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  const fieldCls =
    "flex items-center gap-3 px-5 py-3.5 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-colors";
  const labelCls = "text-[11px] font-sans text-white/60 mb-0.5";
  const inputCls =
    "w-full bg-transparent text-white text-sm font-sans focus:outline-none cursor-pointer appearance-none";

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Background Images */}
      {heroImages.map((img, idx) => (
        <div
          key={img}
          className="absolute inset-0 transition-opacity duration-2000"
          style={{ opacity: idx === currentImage ? 1 : 0 }}
        >
          <Image
            src={img}
            alt="Luxury villa"
            fill
            priority={idx === 0}
            className="object-cover object-center"
            sizes="100vw"
            unoptimized
          />
        </div>
      ))}

      {/* Overlays: dark on the left for text, warm fade at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="relative z-10 w-full luxury-container pt-36 pb-10 md:pb-14 text-white">
        {/* Text block */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="text-[11px] md:text-xs font-sans font-semibold tracking-[0.25em] uppercase text-gold-300 mb-5 animate-fade-in">
            Private Villas · Curated Stays · India &amp; Beyond
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] mb-6 animate-slide-up">
            Luxury Villas for
            <br />
            Extraordinary Stays
          </h1>

          <p className="font-sans text-base md:text-lg font-light text-white/85 max-w-md leading-relaxed mb-8">
            Handpicked private villas, nature retreats and heritage homes for families, friends and special getaways.
          </p>

          {/* Trust points */}
          <div className="flex items-center gap-0 mb-9">
            {[
              { icon: Gem, label: "Verified Villas" },
              { icon: CalendarCheck, label: "Best Rates" },
              { icon: Headset, label: "Dedicated Support" },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-2 px-4 sm:px-6 first:pl-0 ${i > 0 ? "border-l border-white/25" : ""}`}
              >
                <Icon className="w-6 h-6 text-gold-300" strokeWidth={1.4} />
                <span className="text-[11px] sm:text-xs font-sans text-white/90 text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gold-300 hover:bg-gold-200 text-charcoal text-sm font-sans font-medium rounded-md transition-colors"
            >
              Explore Villas <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/experiences"
              className="inline-flex items-center gap-3 text-sm font-sans font-medium text-white hover:text-gold-300 transition-colors"
            >
              <span className="w-11 h-11 rounded-full border border-white/60 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current" />
              </span>
              Our Experiences
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-black/55 backdrop-blur-xl border border-white/15 rounded-2xl md:rounded-full overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-stretch">
            <div className={`${fieldCls} md:flex-[1.3] md:pl-8`}>
              <MapPin className="w-5 h-5 text-gold-300 flex-shrink-0" strokeWidth={1.5} />
              <div className="flex-1 text-left">
                <p className={labelCls}>Destination</p>
                <div className="relative">
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className={inputCls}>
                    <option value="" className="text-charcoal bg-white">All destinations</option>
                    {destinations.map((dest) => (
                      <option key={dest.slug} value={dest.name} className="text-charcoal bg-white">
                        {dest.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/60 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className={`${fieldCls} md:flex-1`}>
              <Calendar className="w-5 h-5 text-gold-300 flex-shrink-0" strokeWidth={1.5} />
              <div className="flex-1 text-left">
                <p className={labelCls}>Check-in</p>
                <input
                  type="date"
                  value={checkin}
                  min={today}
                  onChange={(e) => {
                    setCheckin(e.target.value);
                    if (checkout && e.target.value >= checkout) setCheckout("");
                  }}
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </div>
            </div>

            <div className={`${fieldCls} md:flex-1`}>
              <Calendar className="w-5 h-5 text-gold-300 flex-shrink-0" strokeWidth={1.5} />
              <div className="flex-1 text-left">
                <p className={labelCls}>Check-out</p>
                <input
                  type="date"
                  value={checkout}
                  min={checkin || tomorrow}
                  onChange={(e) => setCheckout(e.target.value)}
                  className={`${inputCls} [color-scheme:dark]`}
                />
              </div>
            </div>

            <div className={`${fieldCls} md:flex-1`}>
              <Users className="w-5 h-5 text-gold-300 flex-shrink-0" strokeWidth={1.5} />
              <div className="flex-1 text-left">
                <p className={labelCls}>Guests</p>
                <div className="relative">
                  <select value={guests} onChange={(e) => setGuests(e.target.value)} className={inputCls}>
                    <option value="" className="text-charcoal bg-white">Any guests</option>
                    {[2, 4, 6, 8, 10, 12, 15].map((n) => (
                      <option key={n} value={n} className="text-charcoal bg-white">
                        {n} guests
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/60 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="p-2.5 md:p-2.5 flex">
              <button
                onClick={handleSearch}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-gold-300 hover:bg-gold-200 text-charcoal text-sm font-sans font-medium rounded-xl md:rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
                Search Villas
              </button>
            </div>
          </div>
        </div>

        {/* Image dots */}
        <div className="flex items-center gap-2 mt-8">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`transition-all duration-300 h-1 ${
                idx === currentImage ? "w-8 bg-gold-300" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
