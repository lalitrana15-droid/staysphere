import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Users, Waves, Check, ArrowRight, ExternalLink, FileText, IndianRupee } from "lucide-react";
import { properties, getPropertyBySlug, getRelatedProperties } from "@/data/properties";
import { getDestinationBySlug } from "@/data/destinations";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { BookingEnquiryForm } from "@/components/property/BookingEnquiryForm";
import { PropertyShareWhatsAppButton, PropertyEnquireWhatsAppButton } from "@/components/property/PropertyWhatsAppButtons";
import { fetchLivePrices } from "@/lib/elivaas-rates";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkin?: string; checkout?: string; guests?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };

  return {
    title: `${property.title} — Luxury Villa in ${property.city}`,
    description: `${property.short_description}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, up to ${property.max_guests} guests${property.has_pool ? ", private pool" : ""}.`,
    openGraph: {
      title: `${property.title} | StaysVacation`,
      description: property.short_description,
      images: [{ url: property.images[0] }],
    },
  };
}

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const checkin = sp.checkin ?? "";
  const checkout = sp.checkout ?? "";
  const guests = sp.guests ?? "";

  // Fetch live price when dates provided
  let pricePerNight: number | null = null;
  if (checkin && checkout && property.state) {
    const prices = await fetchLivePrices(checkin, checkout, [property.state]);
    pricePerNight = prices[property.id] ?? null;
  }

  const destination = getDestinationBySlug(property.destination_slug);
  const related = getRelatedProperties(property, 3);

  const amenityGroups = [
    {
      label: "Outdoor & Spaces",
      items: property.amenities.filter((a) =>
        ["Pool", "Jacuzzi", "Garden", "Gazebo", "Terrace", "Rooftop", "Balcony", "Courtyard", "Sit-Out", "Bonfire", "BBQ", "Outdoor"].some(
          (keyword) => a.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
    },
    {
      label: "Recreation",
      items: property.amenities.filter((a) =>
        ["Game Zone", "Home Theatre", "Gym", "Spa", "Sauna", "Library", "Bar", "Discotheque", "Kids Play", "Lounge", "Conference"].some(
          (keyword) => a.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
    },
    {
      label: "Services",
      items: property.amenities.filter((a) =>
        ["Butler", "Chef", "Concierge", "Housekeeping", "Restaurant", "Café", "Cafe"].some(
          (keyword) => a.toLowerCase().includes(keyword.toLowerCase())
        )
      ),
    },
    {
      label: "Essentials",
      items: property.amenities.filter((a) =>
        ["WiFi", "Air Conditioning", "Television", "Bed Linen", "Iron", "First Aid", "Fire Extinguisher", "Indoor Games", "Parking", "Elevator", "Kitchen", "Bathtub"].some(
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
                    {property.title}
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

                {/* Property Info Sections (check-in, house rules, meals, etc.) */}
                {property.sections && property.sections.length > 0 && (
                  <div className="space-y-6">
                    {property.sections
                      .filter((s) => s.title !== "Villa Snapshot")
                      .map((section) => (
                        <div key={section.title}>
                          <p className="label-text mb-3">{section.title}</p>
                          <p className="font-sans text-sm text-charcoal/70 dark:text-ivory/70 leading-relaxed whitespace-pre-line">
                            {section.content}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* Spaces / Rooms */}
                {property.spaces && property.spaces.length > 0 && (
                  <div>
                    <p className="label-text mb-5">Rooms &amp; Spaces</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.spaces.map((space, idx) => (
                        <div key={idx} className="p-4 border border-stone-200 dark:border-stone-800">
                          <p className="text-xs font-sans font-medium tracking-[0.1em] uppercase text-gold-600 dark:text-gold-400 mb-1">
                            {space.title}
                          </p>
                          {space.description && (
                            <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed">
                              {space.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <p className="label-text mb-4">Location</p>
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                        {property.location_description ?? (
                          [property.area, property.city, property.state, property.country]
                            .filter(Boolean)
                            .join(", ")
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Google Maps embed */}
                  {property.google_map_embed ? (
                    <div className="mt-2">
                      <div
                        className="w-full h-64 overflow-hidden border border-stone-200 dark:border-stone-800"
                        dangerouslySetInnerHTML={{ __html: property.google_map_embed }}
                      />
                      {property.google_maps_link && (
                        <a
                          href={property.google_maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-xs font-sans text-charcoal/50 dark:text-ivory/50 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open in Google Maps
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 h-64 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                      <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">
                        Map coming soon
                      </p>
                    </div>
                  )}
                </div>

                {/* Pricing Details */}
                {(property.security_fee || property.extra_adult_rate) && (
                  <div>
                    <p className="label-text mb-4">Pricing Details</p>
                    <div className="space-y-3">
                      {property.security_fee && (
                        <div className="flex items-center justify-between py-3 border-b border-stone-200 dark:border-stone-800">
                          <span className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">Security Deposit</span>
                          <span className="flex items-center gap-1 text-sm font-sans font-medium text-charcoal dark:text-ivory">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {property.security_fee.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                      {property.extra_adult_rate && (
                        <div className="flex items-center justify-between py-3 border-b border-stone-200 dark:border-stone-800">
                          <span className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">Extra Adult Rate (per night)</span>
                          <span className="flex items-center gap-1 text-sm font-sans font-medium text-charcoal dark:text-ivory">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {property.extra_adult_rate.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Share / Brochure */}
                <div>
                  <p className="label-text mb-4">Share This Property</p>
                  <div className="flex flex-col gap-2">
                    <PropertyShareWhatsAppButton
                      propertyTitle={property.title}
                      propertySlug={property.slug}
                    />
                    <a
                      href={property.brochure_url ?? `/properties/${property.slug}/brochure`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-5 py-3 border border-stone-300 dark:border-stone-700 text-xs font-sans font-medium tracking-widest uppercase text-charcoal/70 dark:text-ivory/70 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Download Property PDF
                    </a>
                  </div>
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
                  {/* Price display */}
                  <div className="mb-5 pb-5 border-b border-stone-200 dark:border-stone-800">
                    {pricePerNight ? (
                      <div>
                        <p className="label-text mb-1">Starting From</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
                            ₹{pricePerNight.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">/night</span>
                        </div>
                        {checkin && checkout && (
                          <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 mt-1 tracking-wide">
                            {new Date(checkin + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            {" → "}
                            {new Date(checkout + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="label-text mb-1">Pricing</p>
                        <p className="font-serif text-2xl font-light text-charcoal dark:text-ivory">Price on Request</p>
                        <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 mt-1">
                          Select dates to see pricing
                        </p>
                      </div>
                    )}
                  </div>

                  <BookingEnquiryForm
                    propertyTitle={property.title}
                    propertySlug={property.slug}
                  />

                  {/* WhatsApp CTA */}
                  <PropertyEnquireWhatsAppButton propertyTitle={property.title} />
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
