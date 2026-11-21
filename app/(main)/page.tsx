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

// Hero uses real exterior photos of our highest-priced villas (no stock / AI images).
// [slug, index of the exterior shot in the property's gallery]
const HERO_VILLAS: [string, number][] = [
  ["the-royce-rose-4bhk-villa-with-private-pool", 0],
  ["casa-ritzy-5bhk-villa-with-private-pool", 6],
  ["royce-4bhk-villa-with-private-pool", 0],
  ["luuma-5bhk-villa-in-shimla", 0],
];

function heroImages(): string[] {
  const imgs = HERO_VILLAS.map(([slug, idx]) => {
    const p = getPropertyBySlug(slug);
    return p ? filterPropertyImages(p.images)[idx] : undefined;
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
