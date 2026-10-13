import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { LuxuryExperiences } from "@/components/home/LuxuryExperiences";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";

export const metadata: Metadata = {
  title: "StaysVacation — Discover Extraordinary Luxury Stays",
  description:
    "Discover curated luxury villas, retreats and private homes across India, Dubai, Bali and beyond. The world's most curated luxury stay marketplace.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />
      <LuxuryExperiences />
      <ListYourProperty />
      <Testimonials />
      <FAQSection />
    </>
  );
}

function ListYourProperty() {
  return (
    <section className="section-padding bg-charcoal dark:bg-[#080808]">
      <div className="luxury-container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-400 mb-5">
            Property Owners
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ivory mb-6 leading-tight">
            List Your Property With Us
          </h2>
          <div className="luxury-divider mb-8" />
          <p className="text-sm font-sans text-ivory/60 leading-relaxed max-w-xl mx-auto mb-10">
            Join India&apos;s most trusted luxury villa network. We handle bookings, marketing, and guest management — you simply enjoy the returns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/owner-partnership"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-charcoal text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300"
            >
              Get Started
            </Link>
            <Link
              href="/owner-partnership"
              className="inline-flex items-center gap-2 text-xs font-sans font-medium tracking-[0.15em] uppercase text-ivory/50 hover:text-gold-400 transition-colors duration-300"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
