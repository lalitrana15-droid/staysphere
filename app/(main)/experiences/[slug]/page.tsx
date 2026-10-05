import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences, getExperienceBySlug } from "@/data/experiences";
import { BookingEnquiryForm } from "@/components/property/BookingEnquiryForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);
  if (!experience) return { title: "Experience Not Found" };

  return {
    title: `${experience.title} | StaySphere Luxury Experiences`,
    description: experience.description,
  };
}

export async function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);
  if (!experience) notFound();

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 luxury-container pb-12">
          <Link href="/experiences" className="text-white/60 text-xs font-sans hover:text-white mb-4 block">
            ← All Experiences
          </Link>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            {experience.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="label-text mb-4">The Experience</p>
              <h2 className="font-serif text-3xl font-light text-charcoal dark:text-ivory mb-6">
                {experience.short_description}
              </h2>
              <p className="font-sans text-sm text-charcoal/70 dark:text-ivory/70 leading-relaxed">
                {experience.description}
              </p>

              <div className="mt-12">
                <p className="label-text mb-6">Why Choose StaySphere</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Personalised to your vision",
                    "Access to India's finest properties",
                    "Dedicated event coordinator",
                    "End-to-end planning support",
                    "Exclusive vendor network",
                    "24/7 on-site support",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                      <span className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <BookingEnquiryForm
                propertyTitle={experience.title}
                propertySlug={experience.slug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
