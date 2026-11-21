import type { Metadata } from "next";
import { getPropertyBySlug } from "@/data/properties";
import { filterPropertyImages, sizedImage } from "@/lib/image-utils";
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

// Hero uses real photos of our own listed villas (no stock / AI images)
const HERO_VILLA_SLUGS = [
  "amber-royale-3bhk-villa-with-private-pool",
  "aarul-farm-4bhk-farmhouse-with-private-pool",
  "cabanas-retreat-5bhk-villa-with-private-pool-in-alibaug",
  "the-pine-melody-4bhk-villa-with-pool-in-kasauli",
];

function heroImages(): string[] {
  const imgs = HERO_VILLA_SLUGS.map((slug) => {
    const p = getPropertyBySlug(slug);
    return p ? filterPropertyImages(p.images)[0] : undefined;
  }).filter((u): u is string => !!u && u.startsWith("https://"));
  return imgs.map((u) => sizedImage(u, 1920));
}

export default function HomePage() {
  return (
    <>
      <HeroSection heroImages={heroImages()} />
      <FeaturedVillas />
      <FeaturedDestinations />
      <LuxuryExperiences />
      <ListYourProperty />
      <Testimonials />
      <FAQSection />
    </>
  );
}
