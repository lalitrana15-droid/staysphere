import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/data/experiences";

export const metadata: Metadata = {
  title: "Luxury Experiences — Weddings, Retreats & Private Events",
  description:
    "Extraordinary experiences beyond the stay. Luxury weddings, corporate retreats, creator escapes, private dining, and wellness retreats curated by StaySphere.",
};

const categoryLabels: Record<string, string> = {
  weddings: "Weddings",
  corporate: "Corporate",
  celebrations: "Celebrations",
  creator: "Creator",
  photography: "Photography",
  dining: "Dining",
  transfers: "Transfers",
  wellness: "Wellness",
};

export default function ExperiencesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=90"
          alt="Luxury Experiences"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 text-center text-white luxury-container">
          <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-300 mb-4">
            Beyond the Stay
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4">
            Luxury Experiences
          </h1>
          <div className="w-16 h-px bg-gold-500 mx-auto mb-6" />
          <p className="text-sm font-sans text-white/70 max-w-lg mx-auto">
            From intimate lakeside weddings to immersive corporate retreats — we craft experiences that become lifelong memories.
          </p>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience, idx) => (
              <Link
                key={experience.id}
                href={`/experiences/${experience.slug}`}
                className="group bg-white dark:bg-[#121212] overflow-hidden block transition-all duration-500 hover:shadow-luxury"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[9px] font-sans font-medium tracking-[0.15em] uppercase">
                      {categoryLabels[experience.category] || experience.category}
                    </span>
                  </div>
                  {experience.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gold-500 text-white text-[9px] font-sans font-medium tracking-[0.15em] uppercase">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-xl font-light text-charcoal dark:text-ivory mb-3 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                    {experience.title}
                  </h2>
                  <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed mb-5 line-clamp-2">
                    {experience.short_description}
                  </p>
                  <div className="flex items-center gap-1 text-gold-600 dark:text-gold-400 group-hover:gap-2 transition-all duration-300">
                    <span className="text-xs font-sans font-medium tracking-[0.08em] uppercase">
                      Learn More
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-charcoal dark:bg-[#080808] text-center">
        <div className="luxury-container">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-400 mb-4">
            Custom Experiences
          </p>
          <h2 className="font-serif text-4xl font-light text-ivory mb-5">
            Have Something Unique in Mind?
          </h2>
          <div className="w-16 h-px bg-gold-500 mx-auto mb-8" />
          <p className="text-sm font-sans text-ivory/60 max-w-lg mx-auto mb-10">
            Our luxury experience specialists design entirely bespoke events. Tell us your vision and we will create the extraordinary.
          </p>
          <Link href="/contact" className="btn-gold">
            Speak to Our Team
          </Link>
        </div>
      </div>
    </div>
  );
}
