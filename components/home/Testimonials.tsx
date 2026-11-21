"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <section className="py-16 md:py-24 bg-ivory dark:bg-[#0A0A0A] overflow-hidden">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-12 md:mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-12 md:w-16 bg-gold-500/60" />
            <p className="text-[11px] md:text-xs font-sans font-semibold tracking-[0.3em] uppercase text-gold-600 dark:text-gold-400">
              Guest Stories
            </p>
            <span className="h-px w-12 md:w-16 bg-gold-500/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-charcoal dark:text-ivory mb-4">
            What Our Guests Say
          </h2>
          <p className="font-sans text-sm md:text-base text-charcoal/60 dark:text-ivory/60 max-w-md mx-auto">
            Real stories from travellers and families who found their perfect stay with StaysVacation.
          </p>
        </div>

        {/* Testimonials */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visible.map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${idx}`}
                className={cn(
                  "bg-white dark:bg-[#121212] rounded-2xl p-6 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border transition-all duration-500",
                  idx === 0
                    ? "border-gold-500/40"
                    : "border-transparent md:opacity-90",
                  idx > 0 && "hidden md:block"
                )}
              >
                <p className="font-serif text-5xl leading-none text-gold-500 mb-2">&ldquo;</p>
                <p className="font-sans text-[15px] text-charcoal/80 dark:text-ivory/80 leading-relaxed mb-6 min-h-[96px]">
                  {testimonial.quote}
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-stone-100 dark:border-stone-800">
                  <span className="flex-none w-11 h-11 rounded-full bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 flex items-center justify-center font-serif text-sm">
                    {initials(testimonial.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-semibold text-charcoal dark:text-ivory truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 truncate">
                      {[testimonial.property, testimonial.location].filter(Boolean).join(" • ")}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#1a1a1a] shadow border border-stone-200 dark:border-stone-700 text-charcoal/70 dark:text-ivory/70 hover:text-gold-600 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  "rounded-full transition-all duration-300 h-2",
                  idx === current ? "w-6 bg-gold-500" : "w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400"
                )}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gold-500 text-white shadow hover:bg-gold-600 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
