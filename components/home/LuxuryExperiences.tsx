import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Briefcase, PlayCircle, Flower2, Sparkles, type LucideIcon } from "lucide-react";
import { getFeaturedExperiences } from "@/data/experiences";

const ICONS: Record<string, LucideIcon> = {
  weddings: Heart,
  corporate: Briefcase,
  creator: PlayCircle,
  wellness: Flower2,
};

// Real photo of one of our villas (served from our own image CDN)
const BG_IMAGE = "https://img.staysvacation.com/1_H7_A6784_HDR_a4c3156666.webp?w=1920";

export function LuxuryExperiences() {
  const experiences = getFeaturedExperiences();

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#0d0b08] text-ivory">
      {/* Atmospheric background */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b08] via-[#0d0b08]/70 to-[#0d0b08]" />

      <div className="relative luxury-container">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="h-px w-12 md:w-20 bg-gold-400/70" />
            <p className="text-[11px] md:text-xs font-sans font-semibold tracking-[0.35em] uppercase text-gold-300">
              Beyond the Stay
            </p>
            <span className="h-px w-12 md:w-20 bg-gold-400/70" />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-normal text-white mb-6">
            Luxury Experiences
          </h2>
          <p className="font-sans text-sm md:text-base text-white/75 max-w-2xl mx-auto leading-relaxed">
            From intimate celebrations to immersive wellness retreats — StaysVacation curates extraordinary experiences that turn your stay into a lasting memory.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {experiences.map((experience) => {
            const Icon = ICONS[experience.category] ?? Sparkles;
            return (
              <Link
                key={experience.id}
                href={`/experiences/${experience.slug}`}
                className="group relative block h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-gold-400/25 hover:border-gold-300/60 transition-colors"
              >
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <Icon className="w-8 h-8 text-gold-300 mb-3" strokeWidth={1.3} />
                  <h3 className="font-serif text-xl md:text-2xl text-white mb-2 leading-tight">
                    {experience.title}
                  </h3>
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-xs md:text-[13px] font-sans text-white/80 leading-relaxed line-clamp-3">
                      {experience.short_description}
                    </p>
                    <span className="flex-none w-9 h-9 rounded-full border border-gold-300/70 flex items-center justify-center text-gold-300 group-hover:bg-gold-300 group-hover:text-charcoal transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-3 px-9 py-4 bg-gold-300 hover:bg-gold-200 text-charcoal text-xs font-sans font-semibold tracking-[0.18em] uppercase rounded-md transition-colors"
          >
            Explore All Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
