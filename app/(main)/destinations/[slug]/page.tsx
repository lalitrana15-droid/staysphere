import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, BedDouble, Bath, Users, Waves } from "lucide-react";
import { destinations, getDestinationBySlug } from "@/data/destinations";
import { getPropertiesByDestination } from "@/data/properties";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return { title: "Destination Not Found" };

  return {
    title: `Luxury Villas in ${destination.name} — ${destination.state ? `${destination.state}, ` : ""}${destination.country}`,
    description: `Discover the most extraordinary luxury villas and private estates in ${destination.name}. ${destination.short_description}`,
    keywords: [
      `luxury villas ${destination.name}`,
      `luxury stays ${destination.name}`,
      `private villas ${destination.name}`,
      `villa rental ${destination.name}`,
    ],
    openGraph: {
      title: `Luxury Villas in ${destination.name} | StaySphere`,
      description: destination.description,
      images: [{ url: destination.hero_image }],
    },
  };
}

export async function generateStaticParams() {
  return destinations.map((dest) => ({ slug: dest.slug }));
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();

  const properties = getPropertiesByDestination(slug);

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[450px] flex items-end overflow-hidden">
        <Image
          src={destination.hero_image}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="relative z-10 luxury-container pb-12">
          <div className="flex items-center gap-2 text-white/60 text-xs font-sans mb-3">
            <Link href="/destinations" className="hover:text-white transition-colors">
              Destinations
            </Link>
            <span>/</span>
            <span className="text-white">{destination.name}</span>
          </div>
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-300 mb-3">
            {destination.state ? `${destination.state} · ` : ""}
            {destination.country}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white">
            {destination.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Description */}
            <div className="lg:col-span-2">
              <p className="label-text mb-4">About</p>
              <h2 className="font-serif text-3xl font-light text-charcoal dark:text-ivory mb-6">
                {destination.short_description}
              </h2>
              <p className="font-sans text-sm text-charcoal/70 dark:text-ivory/70 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {destination.highlights && (
                <div className="bg-white dark:bg-[#121212] p-6 border border-stone-200/60 dark:border-stone-800/60">
                  <p className="label-text mb-4">Highlights</p>
                  <ul className="space-y-3">
                    {destination.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-3 text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {destination.best_time_to_visit && (
                <div className="bg-white dark:bg-[#121212] p-6 border border-stone-200/60 dark:border-stone-800/60">
                  <p className="label-text mb-3">Best Time to Visit</p>
                  <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                    {destination.best_time_to_visit}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Properties */}
          <div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="label-text mb-2">Our Collection</p>
                <h2 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
                  Properties in {destination.name}
                </h2>
              </div>
              <span className="text-sm font-sans text-charcoal/50 dark:text-ivory/50">
                {properties.length} {properties.length === 1 ? "property" : "properties"}
              </span>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.slug}`}
                    className="group bg-white dark:bg-[#121212] overflow-hidden block transition-all duration-500 hover:shadow-luxury"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {property.featured && (
                          <span className="px-3 py-1 bg-gold-500 text-white text-[9px] font-sans font-medium tracking-[0.15em] uppercase">
                            Featured
                          </span>
                        )}
                        {property.has_pool && (
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[9px] font-sans font-medium tracking-[0.15em] uppercase border border-white/30">
                            Pool
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                        {property.code ?? property.title}
                      </h3>
                      <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed mb-5 line-clamp-2">
                        {property.short_description}
                      </p>
                      <div className="flex items-center gap-5 pt-4 border-t border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-1.5 text-charcoal/50 dark:text-ivory/50">
                          <BedDouble className="w-3.5 h-3.5" />
                          <span className="text-xs font-sans">{property.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-charcoal/50 dark:text-ivory/50">
                          <Bath className="w-3.5 h-3.5" />
                          <span className="text-xs font-sans">{property.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-charcoal/50 dark:text-ivory/50">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-xs font-sans">{property.max_guests} guests</span>
                        </div>
                        <div className="ml-auto flex items-center gap-1 text-gold-600 dark:text-gold-400 group-hover:gap-2 transition-all duration-300">
                          <span className="text-xs font-sans font-medium tracking-[0.08em] uppercase">
                            View
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50">
                  Properties coming soon. Contact us for options in {destination.name}.
                </p>
                <Link href="/contact" className="btn-primary mt-6 inline-flex">
                  Enquire Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
