import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About StaySphere — Our Story",
  description:
    "StaySphere is India's premier luxury stay distribution network, connecting discerning travellers with the world's most extraordinary private properties.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[350px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90"
          alt="About StaySphere"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 luxury-container pb-12">
          <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-300 mb-3">
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            About StaySphere
          </h1>
        </div>
      </div>

      {/* Story */}
      <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          <div className="max-w-3xl">
            <p className="label-text mb-5">Who We Are</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-8 leading-tight">
              India&apos;s Premier Luxury Stay Distribution Network
            </h2>
            <div className="space-y-5 text-sm font-sans text-charcoal/70 dark:text-ivory/70 leading-relaxed">
              <p>
                StaySphere was born from a simple observation: the world&apos;s most extraordinary private properties were inaccessible to the travellers most deserving of them. Hidden behind closed doors, passed between a handful of agents in hushed conversations, the best luxury stays in India were a secret — a remarkably well-kept one.
              </p>
              <p>
                We set out to change that. StaySphere is the Global Luxury Stay Distribution Network — a curated marketplace that connects discerning travellers, luxury travel agents, wedding planners, and corporate retreat specialists with India&apos;s (and the world&apos;s) most extraordinary private properties.
              </p>
              <p>
                Every property in our network has been personally inspected and verified against our exacting standards. We don&apos;t list everything — we list the extraordinary. Our team has walked through hundreds of properties to bring you the select few that genuinely live up to the word luxury.
              </p>
              <p>
                We serve both ends of the market with equal dedication. For travellers, we offer a curated collection of properties and a concierge team that orchestrates your stay from arrival to departure. For travel professionals — agents, wedding planners, corporate retreat specialists — we are the reliable, knowledgeable partner who makes your clients&apos; experiences exceptional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="section-padding bg-white dark:bg-[#0D0D0D]">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <p className="label-text mb-4">What We Stand For</p>
            <h2 className="font-serif text-4xl font-light text-charcoal dark:text-ivory">
              Our Values
            </h2>
            <div className="luxury-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                number: "01",
                title: "Curation Over Scale",
                description:
                  "We will never compromise the quality of our collection for the sake of volume. Every property we add makes the network better.",
              },
              {
                number: "02",
                title: "Relationships Over Transactions",
                description:
                  "We build lasting relationships with our guests, property partners, and agent network. A single stay should be the beginning, not an end.",
              },
              {
                number: "03",
                title: "Experience Over Accommodation",
                description:
                  "Luxury is not a thread count. It is the memory of arriving at a lakeside palace at sunset. We obsess over the entire experience.",
              },
            ].map((value) => (
              <div key={value.number} className="group">
                <p className="font-display text-5xl font-light text-gold-500/30 mb-4">
                  {value.number}
                </p>
                <h3 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
                  {value.title}
                </h3>
                <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Image */}
      <div className="section-padding bg-charcoal dark:bg-[#080808]">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-400 mb-4">
                Our Mission
              </p>
              <h2 className="font-serif text-4xl font-light text-ivory mb-6">
                Making Extraordinary Accessible
              </h2>
              <p className="text-sm font-sans text-ivory/60 leading-relaxed mb-8">
                The extraordinary should not be reserved for the privileged few who happen to know the right people. StaySphere opens the doors to India&apos;s most exceptional private properties for everyone who appreciates genuine luxury.
              </p>
              <div className="flex gap-4">
                <Link href="/destinations" className="btn-gold">
                  Explore Stays
                </Link>
                <Link href="/contact" className="btn-outline border-ivory/30 text-ivory hover:bg-ivory hover:text-charcoal">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative h-80 lg:h-96">
              <Image
                src="https://images.unsplash.com/photo-1582610116397-edb72278f447?w=800&q=90"
                alt="StaySphere Team"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
