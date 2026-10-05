import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Users, Waves, Check, ArrowRight, Calendar } from "lucide-react";
import { properties, getPropertyBySlug, getRelatedProperties } from "@/data/properties";
import { getDestinationBySlug } from "@/data/destinations";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { BookingEnquiryForm } from "@/components/property/BookingEnquiryForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };

  return {
    title: `${property.title} — Luxury Villa in ${property.city}`,
    description: `${property.short_description}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, up to ${property.max_guests} guests${property.has_pool ? ", private pool" : ""}.`,
    openGraph: {
      title: `${property.title} | StaySphere`,
      description: property.short_description,
      images: [{ url: property.images[0] }],
    },
  };
}

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const destination = getDestinationBySlug(property.destination_slug);
  const related = getRelatedProperties(property, 3);

  const amenityGroups = [
    {
      label: "Spaces",
      items: property.amenities.filter((a) =>
        ["Pool", "Rooftop", "Garden", "Courtyard", "Terrace", "Deck", "Library", "Home Theatre", "Cinema Room", "Games Room", "Gym", "Spa"].some(
          (keyword) => a.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
    },
    {
      label: "Services",
      items: property.amenities.filter((a) =>
        ["Butler", "Chef", "Concierge", "Housekeeping", "Transfer", "Camel", "Cultural"].some(
          (keyword) => a.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
    },
    {
      label: "Connectivity",
      items: property.amenities.filter((a) =>
        ["WiFi", "Air Conditioning", "Smart Home"].some(
          (keyword) => a.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
    },
  ].map((g) => ({ ...g, items: Array.from(new Set(g.items)) }));

  const otherAmenities = property.amenities.filter(
    (a) => !amenityGroups.some((g) => g.items.includes(a))
  );

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.title,
    description: property.description,
    image: property.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressCountry: property.country,
    },
    numberOfRooms: property.bedrooms,
    amenityFeature: property.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="pt-20">
        {/* Gallery */}
        <div className="hidden md:block">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* Mobile Hero */}
        <div className="md:hidden relative h-72">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
          <div className="luxury-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: Property Details */}
              <div className="lg:col-span-2 space-y-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                  <Link href="/destinations" className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                    Destinations
                  </Link>
                  <span>/</span>
                  {destination && (
                    <>
                      <Link href={`/destinations/${destination.slug}`} className="hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                        {destination.name}
                      </Link>
                      <span>/</span>
                    </>
                  )}
                  <span className="text-charcoal dark:text-ivory">{property.title}</span>
                </div>

                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    <span className="text-xs font-sans font-medium text-gold-600 dark:text-gold-400 tracking-[0.1em] uppercase">
                      {property.city}, {property.country}
                    </span>
                  </div>
                  <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-4">
                    {property.code ?? property.title}
                  </h1>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex items-center gap-2 text-charcoal/60 dark:text-ivory/60">
                      <BedDouble className="w-4 h-4" />
                      <span className="text-sm font-sans">
                        {property.bedrooms} Bedrooms
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-charcoal/60 dark:text-ivory/60">
                      <Bath className="w-4 h-4" />
                      <span className="text-sm font-sans">
                        {property.bathrooms} Bathrooms
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-charcoal/60 dark:text-ivory/60">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-sans">
                        Up to {property.max_guests} Guests
                      </span>
                    </div>
                    {property.has_pool && (
                      <div className="flex items-center gap-2 text-charcoal/60 dark:text-ivory/60">
                        <Waves className="w-4 h-4" />
                        <span className="text-sm font-sans">Private Pool</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="label-text mb-4">About This Property</p>
                  <p className="font-sans text-sm text-charcoal/70 dark:text-ivory/70 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Highlights */}
                {property.highlights && property.highlights.length > 0 && (
                  <div>
                    <p className="label-text mb-5">Highlights</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-start gap-3"
                        >
                          <Check className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                <div>
                  <p className="label-text mb-6">Amenities & Features</p>
                  <div className="space-y-6">
                    {amenityGroups
                      .filter((g) => g.items.length > 0)
                      .map((group) => (
                        <div key={group.label}>
                          <h4 className="text-xs font-sans font-medium tracking-[0.12em] uppercase text-charcoal/40 dark:text-ivory/40 mb-4">
                            {group.label}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {group.items.map((amenity) => (
                              <div
                                key={amenity}
                                className="flex items-center gap-2.5"
                              >
                                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                                <span className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                                  {amenity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    {otherAmenities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-sans font-medium tracking-[0.12em] uppercase text-charcoal/40 dark:text-ivory/40 mb-4">
                          Additional
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {otherAmenities.map((amenity) => (
                            <div
                              key={amenity}
                              className="flex items-center gap-2.5"
                            >
                              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                              <span className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                                {amenity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                {property.location_description && (
                  <div>
                    <p className="label-text mb-4">Location</p>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                        {property.location_description}
                      </p>
                    </div>
                    {/* Map placeholder */}
                    <div className="mt-4 h-64 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                      <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">
                        Map coming soon
                      </p>
                    </div>
                  </div>
                )}

                {/* ICS Download */}
                <div>
                  <p className="label-text mb-4">Calendar</p>
                  <a
                    href={`/api/properties/${property.slug}/ics`}
                    download={`${property.slug}.ics`}
                    className="inline-flex items-center gap-2.5 px-5 py-3 border border-stone-300 dark:border-stone-700 text-xs font-sans font-medium tracking-widest uppercase text-charcoal/70 dark:text-ivory/70 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Download ICS / Calendar File
                  </a>
                  <p className="mt-2 text-[10px] font-sans text-charcoal/40 dark:text-ivory/40">
                    Add to Apple Calendar, Google Calendar or Outlook
                  </p>
                </div>

                {/* Mobile Gallery */}
                <div className="md:hidden">
                  <p className="label-text mb-4">Gallery</p>
                  <div className="grid grid-cols-2 gap-2">
                    {property.images.slice(1, 5).map((img, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <Image
                          src={img}
                          alt={`${property.title} ${idx + 2}`}
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Enquiry Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <BookingEnquiryForm
                    propertyTitle={property.title}
                    propertySlug={property.slug}
                  />

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/919999999999?text=Hi, I'm interested in ${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 mt-3 py-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-sans font-medium tracking-[0.1em] uppercase hover:bg-[#25D366]/20 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enquire via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {related.length > 0 && (
          <div className="section-padding bg-white dark:bg-[#0D0D0D]">
            <div className="luxury-container">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="label-text mb-2">You May Also Like</p>
                  <h2 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
                    Related Properties
                  </h2>
                </div>
                {destination && (
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="hidden md:flex items-center gap-1 text-xs font-sans font-medium tracking-[0.1em] uppercase text-charcoal/50 dark:text-ivory/50 hover:text-gold-600 dark:hover:text-gold-400 hover:gap-2 transition-all duration-300"
                  >
                    All in {destination.name}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/properties/${rel.slug}`}
                    className="group block bg-ivory dark:bg-[#0A0A0A] overflow-hidden transition-all duration-500 hover:shadow-luxury"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={rel.images[0]}
                        alt={rel.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="33vw"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-gold-600 dark:text-gold-400 mb-1">
                        {rel.city}
                      </p>
                      <h3 className="font-serif text-xl font-light text-charcoal dark:text-ivory group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                        {rel.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
