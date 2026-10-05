import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getFeaturedExperiences } from "@/data/experiences";

export function LuxuryExperiences() {
  const experiences = getFeaturedExperiences();

  return (
    <section className="section-padding bg-charcoal dark:bg-[#080808] text-ivory">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-400 mb-4">
            Beyond the Stay
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ivory mb-5">
            Luxury Experiences
          </h2>
          <div className="w-16 h-px bg-gold-500 mx-auto mb-6" />
          <p className="font-sans text-sm text-ivory/60 max-w-xl mx-auto leading-relaxed">
            From intimate lakeside weddings to immersive Ayurvedic retreats — StaySphere crafts experiences that become lifelong memories.
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              href={`/experiences/${experience.slug}`}
              className="group relative overflow-hidden block"
            >
              <div className="relative h-[320px] md:h-[400px] overflow-hidden">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-xl font-light text-white mb-2 leading-tight">
                    {experience.title}
                  </h3>
                  <p className="text-xs font-sans text-white/60 leading-relaxed line-clamp-2 mb-4">
                    {experience.short_description}
                  </p>
                  <div className="flex items-center gap-1 text-gold-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase">
                      Discover
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/experiences"
            className="btn-outline border-ivory/30 text-ivory hover:bg-ivory hover:text-charcoal"
          >
            Explore All Experiences
          </Link>
        </div>
      </div>
    </section>
  );
}
