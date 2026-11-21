import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedVillas } from "@/components/home/FeaturedVillas";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { LuxuryExperiences } from "@/components/home/LuxuryExperiences";
import { ListYourProperty } from "@/components/home/ListYourProperty";
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
      <FeaturedVillas />
      <FeaturedDestinations />
      <LuxuryExperiences />
      <ListYourProperty />
      <Testimonials />
      <FAQSection />
    </>
  );
}
