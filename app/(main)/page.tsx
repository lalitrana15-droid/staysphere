import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandPillars } from "@/components/home/BrandPillars";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { LuxuryExperiences } from "@/components/home/LuxuryExperiences";
import { WhyStaySphere } from "@/components/home/WhyStaySphere";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";

export const metadata: Metadata = {
  title: "StaySphere — Discover Extraordinary Luxury Stays",
  description:
    "Discover curated luxury villas, retreats and private homes across India, Dubai, Bali and beyond. The world's most curated luxury stay marketplace.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandPillars />
      <FeaturedDestinations />
      <FeaturedProperties />
      <LuxuryExperiences />
      <WhyStaySphere />
      <Testimonials />
      <FAQSection />
    </>
  );
}
