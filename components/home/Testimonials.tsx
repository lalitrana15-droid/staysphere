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

  return (
    <section className="section-padding bg-ivory dark:bg-[#0A0A0A] overflow-hidden">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="label-text mb-4">Guest Stories</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-5">
            What Our Guests Say
          </h2>
          <div className="luxury-divider" />
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className={cn(
                "bg-white dark:bg-[#121212] p-8 border transition-all duration-500",
                idx === 0
                  ? "border-gold-500/40 dark:border-gold-500/30"
                  : "border-stone-200/60 dark:border-stone-800/60 opacity-80"
              )}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-gold-500 text-gold-500"
                  />
                ))}
              </div>

              {/* Quote Mark */}
              <p className="font-display text-5xl font-light text-gold-500/30 leading-none -mt-2 mb-3">
                &ldquo;
              </p>

              {/* Quote */}
              <p className="font-serif text-base font-light text-charcoal/80 dark:text-ivory/80 leading-relaxed italic mb-6">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="pt-5 border-t border-stone-100 dark:border-stone-800">
                <p className="font-sans text-sm font-medium text-charcoal dark:text-ivory">
                  {testimonial.name}
                </p>
                <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mt-0.5">
                  {testimonial.location}
                </p>
                {testimonial.property && (
                  <p className="text-[10px] font-sans font-medium tracking-[0.1em] uppercase text-gold-600 dark:text-gold-400 mt-2">
                    {testimonial.property}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center border border-stone-300 dark:border-stone-700 text-charcoal/60 dark:text-ivory/60 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-all duration-200"
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
                  "transition-all duration-300",
                  idx === current
                    ? "w-6 h-1 bg-gold-500"
                    : "w-2 h-1 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400"
                )}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center border border-stone-300 dark:border-stone-700 text-charcoal/60 dark:text-ivory/60 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
