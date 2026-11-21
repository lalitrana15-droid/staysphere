import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, Handshake, Home, Leaf, Star, Users } from "lucide-react";
import { properties, getPropertyBySlug } from "@/data/properties";
import { destinations } from "@/data/destinations";
import { filterPropertyImages, sizedImage } from "@/lib/image-utils";

export const metadata: Metadata = {
  title: "About StaysVacation — Our Story",
  description:
    "StaysVacation is India's premier luxury stay network, connecting discerning travellers with the most extraordinary private villas and retreats.",
};

// All photos are real shots of villas in our own collection.
function pic(slug: string, idx: number, width: number): string {
  const p = getPropertyBySlug(slug);
  const imgs = p ? filterPropertyImages(p.images) : [];
  return sizedImage(imgs[idx] ?? imgs[0], width);
}

const VALUES = [
  { icon: Gem, title: "Quality First", text: "Only exceptional, verified properties make it into our collection." },
  { icon: Handshake, title: "Trusted Partnerships", text: "Long-term relationships with property owners and travel partners." },
  { icon: Leaf, title: "Authentic Experiences", text: "Stays that celebrate local culture, nature and community." },
  { icon: Users, title: "Guest-Centric", text: "Thoughtful support at every step of your journey." },
];

const PILLARS = [
  { icon: Home, label: "Handpicked Properties" },
  { icon: Star, label: "Exceptional Experiences" },
  { icon: Users, label: "Personalised Support" },
];

export default function AboutPage() {
  const stats = [
    { value: `${Math.floor(properties.length / 10) * 10}+`, label: "Curated Villas" },
    { value: `${destinations.length}+`, label: "Destinations" },
    { value: "100%", label: "Verified Properties" },
    { value: "24/7", label: "Dedicated Support" },
  ];

  return (
    <div className="pt-20 bg-[#FAF6EF] dark:bg-[#0A0A0A]">
      {/* Hero */}
      <section className="relative h-[300px] md:h-[360px] overflow-hidden bg-[#14181f]">
        <Image
          src={pic("royce-4bhk-villa-with-private-pool", 0, 1920)}
          alt="A StaysVacation villa at dusk"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14181f] via-[#14181f]/70 to-transparent md:via-[#14181f]/35" />
        <div className="relative luxury-container h-full flex flex-col justify-center">
          <p className="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-gold-300 mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-5">About StaysVacation</h1>
          <p className="font-sans text-sm md:text-base text-white/80 max-w-md leading-relaxed">
            Curating extraordinary stays in India&apos;s most beautiful destinations — where homes, nature and genuine hospitality come together.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-16 md:py-24">
        <div className="luxury-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative h-[320px] md:h-[440px]">
            <div className="absolute left-0 top-0 w-[48%] h-[85%] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={pic("casa-ritzy-5bhk-villa-with-private-pool", 6, 800)}
                alt="Villa exterior"
                fill
                unoptimized
                sizes="25vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-0 w-[80%] h-[80%] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FAF6EF] dark:border-[#0A0A0A]">
              <Image
                src={pic("adarsh-3bhk-villa-with-private-pool", 1, 1200)}
                alt="Villa with private pool at night"
                fill
                unoptimized
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="label-text mb-4">Who We Are</p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal dark:text-ivory mb-6 leading-tight">
              India&apos;s Premier Luxury Stay Network
            </h2>
            <p className="font-sans text-sm md:text-base text-charcoal/70 dark:text-ivory/70 leading-relaxed mb-4">
              StaysVacation is a curated platform for exceptional villa stays, handpicked across India. We connect travellers with privately owned homes, heritage stays and unique retreats that offer space, privacy and a truly personal experience.
            </p>
            <p className="font-sans text-sm md:text-base text-charcoal/70 dark:text-ivory/70 leading-relaxed mb-8">
              Every property in our network is personally inspected and verified. We don&apos;t list everything — we list the extraordinary.
            </p>
            <div className="grid grid-cols-3 divide-x divide-stone-300 dark:divide-stone-700">
              {PILLARS.map(({ icon: Icon, label }) => (
                <div key={label} className="px-3 first:pl-0">
                  <span className="inline-flex w-10 h-10 rounded-lg bg-gold-100 dark:bg-gold-500/15 items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-gold-600" strokeWidth={1.5} />
                  </span>
                  <p className="font-sans text-sm font-medium text-charcoal dark:text-ivory">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden bg-[#14181f] py-12 md:py-14">
        <Image
          src={pic("casa-ritzy-5bhk-villa-with-private-pool", 8, 1600)}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="relative luxury-container grid grid-cols-2 md:grid-cols-4 gap-y-8 md:divide-x divide-white/15">
          {stats.map((s) => (
            <div key={s.label} className="text-center px-4">
              <p className="font-serif text-4xl md:text-5xl text-gold-300 mb-1">{s.value}</p>
              <p className="font-sans text-sm text-white/85">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="luxury-container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="label-text mb-4">Our Mission</p>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal dark:text-ivory mb-6 leading-tight">
              Making Extraordinary Accessible
            </h2>
            <p className="font-sans text-sm md:text-base text-charcoal/70 dark:text-ivory/70 leading-relaxed">
              To open the doors to India&apos;s most exceptional private properties for travellers who value comfort, authenticity and meaningful stays — while empowering property owners with a trusted platform and expert support.
            </p>
          </div>
          <div className="relative h-[280px] md:h-[360px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={pic("luuma-5bhk-villa-in-shimla", 2, 1200)}
              alt="Villa veranda overlooking the mountains"
              fill
              unoptimized
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-16 md:pb-24">
        <div className="luxury-container">
          <div className="text-center mb-12">
            <p className="label-text mb-3">What We Stand For</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal dark:text-ivory">Our Values</h2>
            <div className="luxury-divider" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:divide-x divide-stone-300 dark:divide-stone-700">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center px-6">
                <span className="inline-flex w-14 h-14 rounded-xl bg-gold-100 dark:bg-gold-500/15 items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold-600" strokeWidth={1.4} />
                </span>
                <h3 className="font-serif text-lg text-charcoal dark:text-ivory mb-2">{title}</h3>
                <p className="font-sans text-xs md:text-sm text-charcoal/60 dark:text-ivory/60 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-24">
        <div className="luxury-container">
          <div className="relative overflow-hidden rounded-2xl bg-[#14181f] px-6 md:px-14 py-12 md:py-16">
            <Image
              src={pic("tranquil-medows-5bhk-farmhouse-with-private-pool-delhi-ncr", 2, 1600)}
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#14181f] via-[#14181f]/70 to-transparent" />
            <div className="relative max-w-xl">
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                Experience the StaysVacation Difference
              </h2>
              <p className="font-sans text-sm text-white/80 mb-7">
                Discover handpicked villas and curated experiences across India.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold-300 hover:bg-gold-200 text-charcoal text-sm font-sans font-semibold rounded-md transition-colors"
                >
                  Explore Villas <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-white/50 text-white hover:bg-white hover:text-charcoal text-sm font-sans font-semibold rounded-md transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
