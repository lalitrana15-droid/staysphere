import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Users, Waves, ChevronRight, ExternalLink, IndianRupee, PawPrint, Leaf, Wifi, Utensils, Mountain, Car, Sparkles, ShieldCheck, Headset, type LucideIcon } from "lucide-react";
import { properties, getPropertyBySlug, getRelatedProperties } from "@/data/properties";
import { getDestinationBySlug } from "@/data/destinations";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { ReadMore } from "@/components/property/ReadMore";
import { AmenitiesGrid } from "@/components/property/AmenitiesGrid";
import { BookingEnquiryForm } from "@/components/property/BookingEnquiryForm";
import { fetchLivePrices } from "@/lib/elivaas-rates";
import { filterPropertyImages, sizedImage } from "@/lib/image-utils";

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
      images: [{ url: sizedImage(property.images[0], 1200) }],
    },
  };
}

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

const HIGHLIGHT_ICONS: [RegExp, LucideIcon][] = [
  [/pool|jacuzzi/i, Waves],
  [/pet/i, PawPrint],
  [/garden|lawn|green|nature/i, Leaf],
  [/wi-?fi/i, Wifi],
  [/restaurant|dining|chef|meal|kitchen/i, Utensils],
  [/view|lake|mountain|hill|beach|sea|ocean|backwater/i, Mountain],
  [/parking/i, Car],
];
const highlightIcon = (t: string): LucideIcon =>
  HIGHLIGHT_ICONS.find(([re]) => re.test(t))?.[1] ?? Sparkles;

const PLACEHOLDER_PRICE = 79152;

export default async function PropertyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const checkin = sp.checkin ?? "";
  const checkout = sp.checkout ?? "";

  // Fetch live price when dates provided
  let pricePerNight: number | null = null;
  if (checkin && checkout && property.state) {
    const prices = await fetchLivePrices(checkin, checkout, [property.state]);
    pricePerNight = prices[property.id] ?? null;
  }
  const displayPrice =
    pricePerNight ||
    (property.starting_price && property.starting_price !== PLACEHOLDER_PRICE ? property.starting_price : null);

  const destination = getDestinationBySlug(property.destination_slug);
  const related = getRelatedProperties(property, 4);
  const photos = filterPropertyImages(property.images);
  const infoSections = (property.sections ?? []).filter((x) => x.title !== "Villa Snapshot");
  const hasSpaces = !!property.spaces && property.spaces.length > 0;
  const hasPricing = !!(property.security_fee || property.extra_adult_rate);

  const tabs = [
    { id: "overview", label: "Overview" },
    ...(hasSpaces ? [{ id: "rooms", label: "Rooms" }] : []),
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
    ...(infoSections.length ? [{ id: "policies", label: "Policies" }] : []),
  ];

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.title,
    description: property.description,
    image: property.images.slice(0, 10).map((u) => sizedImage(u, 1200)),
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

  const sectionTitle = "font-serif text-2xl md:text-[28px] font-normal text-charcoal dark:text-ivory mb-5";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="pt-24 bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-sans text-charcoal/60 dark:text-ivory/60 mb-5">
            <Link href="/" className="hover:text-gold-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/properties" className="hover:text-gold-600">Villas</Link>
            <ChevronRight className="w-3 h-3" />
            {destination ? (
              <Link href={`/destinations/${destination.slug}`} className="hover:text-gold-600">{destination.name}</Link>
            ) : (
              <span>{property.city}</span>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-charcoal dark:text-ivory">{property.title}</span>
          </nav>

          {/* Gallery (desktop) */}
          <div className="hidden md:block">
            <PropertyGallery images={property.images} title={property.title} />
          </div>

          {/* Gallery (mobile): swipeable strip */}
          <div className="md:hidden -mx-4 px-4 flex gap-2 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.slice(0, 10).map((img, idx) => (
              <div key={idx} className="relative flex-none snap-center w-[86%] h-64 rounded-2xl overflow-hidden">
                <Image
                  src={sizedImage(img, 900)}
                  alt={`${property.title} ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="86vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-14 mt-8 pb-16">
            {/* ───────── Left column ───────── */}
            <div className="min-w-0">
              {/* Title */}
              <div className="flex items-center gap-1.5 text-sm font-sans text-charcoal/70 dark:text-ivory/70 mb-2">
                <MapPin className="w-4 h-4 text-gold-500" />
                {[property.city, property.state].filter(Boolean).join(", ")}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-normal text-charcoal dark:text-ivory mb-4">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                <span className="flex items-center gap-2"><BedDouble className="w-4 h-4" />{property.bedrooms} Bedroom{property.bedrooms > 1 ? "s" : ""}</span>
                <span className="flex items-center gap-2"><Bath className="w-4 h-4" />{property.bathrooms} Bathroom{property.bathrooms > 1 ? "s" : ""}</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4" />Up to {property.max_guests} Guests</span>
                {property.has_pool && <span className="flex items-center gap-2"><Waves className="w-4 h-4" />Private Pool</span>}
              </div>

              {/* Tabs */}
              <nav className="sticky top-20 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mt-7 bg-ivory/95 dark:bg-[#0A0A0A]/95 backdrop-blur border-b border-stone-200 dark:border-stone-800 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <ul className="flex gap-7 whitespace-nowrap">
                  {tabs.map((t, i) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className={`inline-block py-4 text-sm font-sans font-medium border-b-2 transition-colors ${
                          i === 0
                            ? "border-gold-500 text-gold-600 dark:text-gold-400"
                            : "border-transparent text-charcoal/70 dark:text-ivory/70 hover:text-gold-600"
                        }`}
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Overview */}
              <section id="overview" className="scroll-mt-40 pt-9">
                <h2 className={sectionTitle}>About This Property</h2>
                <ReadMore text={property.description} />
              </section>

              {/* Highlights */}
              {property.highlights && property.highlights.length > 0 && (
                <section className="pt-10">
                  <h2 className={sectionTitle}>Property Highlights</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 rounded-2xl bg-white dark:bg-[#121212] border border-stone-200/70 dark:border-stone-800 p-4">
                    {property.highlights.slice(0, 6).map((h) => {
                      const Icon = highlightIcon(h);
                      return (
                        <div key={h} className="flex flex-col items-center text-center gap-2 px-2 py-3">
                          <Icon className="w-7 h-7 text-gold-600 dark:text-gold-400" strokeWidth={1.4} />
                          <span className="text-xs font-sans text-charcoal/80 dark:text-ivory/80 leading-snug line-clamp-3">{h}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Amenities */}
              <section id="amenities" className="scroll-mt-40 pt-10">
                <h2 className={sectionTitle}>Amenities &amp; Features</h2>
                <AmenitiesGrid amenities={property.amenities} />
              </section>

              {/* Rooms */}
              {hasSpaces && (
                <section id="rooms" className="scroll-mt-40 pt-10">
                  <h2 className={sectionTitle}>Rooms &amp; Spaces ({property.spaces!.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.spaces!.map((space, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 rounded-2xl bg-white dark:bg-[#121212] border border-stone-200/70 dark:border-stone-800 p-5"
                      >
                        <span className="flex-none w-11 h-11 rounded-full bg-gold-100 dark:bg-gold-900/40 flex items-center justify-center">
                          <BedDouble className="w-5 h-5 text-gold-700 dark:text-gold-300" strokeWidth={1.5} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg text-charcoal dark:text-ivory mb-1">{space.title}</h3>
                          {space.description && (
                            <p className="text-sm font-sans text-charcoal/65 dark:text-ivory/65 leading-relaxed">{space.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Location */}
              <section id="location" className="scroll-mt-40 pt-10">
                <h2 className={sectionTitle}>Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                  <div className="md:col-span-3">
                    {property.google_map_embed?.startsWith("https://www.google.com/maps/embed") ? (
                      <iframe
                        src={property.google_map_embed}
                        title={`Map of ${property.title}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                        className="w-full h-72 rounded-2xl border border-stone-200 dark:border-stone-800"
                      />
                    ) : (
                      <div className="h-72 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                        <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">Map coming soon</p>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 rounded-2xl bg-white dark:bg-[#121212] border border-stone-200/70 dark:border-stone-800 p-5 flex flex-col">
                    <p className="text-xs font-sans font-semibold tracking-[0.15em] uppercase text-gold-600 dark:text-gold-400 mb-2">Where you&apos;ll be</p>
                    <p className="text-sm font-sans text-charcoal/75 dark:text-ivory/75 leading-relaxed">
                      {property.location_description ??
                        [property.area, property.city, property.state, property.country].filter(Boolean).join(", ")}
                    </p>
                    {property.google_maps_link && (
                      <a
                        href={property.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-sans font-medium text-gold-600 dark:text-gold-400 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" /> Open in Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </section>

              {/* Policies / info sections */}
              {infoSections.length > 0 && (
                <section id="policies" className="scroll-mt-40 pt-10">
                  <h2 className={sectionTitle}>Good to Know</h2>
                  <div className="space-y-3">
                    {infoSections.map((section) => (
                      <details
                        key={section.title}
                        className="group rounded-2xl bg-white dark:bg-[#121212] border border-stone-200/70 dark:border-stone-800 px-5 py-4"
                      >
                        <summary className="flex items-center justify-between cursor-pointer list-none font-serif text-lg text-charcoal dark:text-ivory">
                          {section.title}
                          <ChevronRight className="w-4 h-4 text-charcoal/50 transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="mt-3 font-sans text-sm text-charcoal/70 dark:text-ivory/70 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Pricing details */}
              {hasPricing && (
                <section className="pt-10">
                  <h2 className={sectionTitle}>Pricing Details</h2>
                  <div className="rounded-2xl bg-white dark:bg-[#121212] border border-stone-200/70 dark:border-stone-800 divide-y divide-stone-200/70 dark:divide-stone-800">
                    {property.security_fee ? (
                      <div className="flex items-center justify-between px-5 py-4 text-sm font-sans">
                        <span className="text-charcoal/70 dark:text-ivory/70">Security Deposit</span>
                        <span className="flex items-center gap-1 font-medium text-charcoal dark:text-ivory">
                          <IndianRupee className="w-3.5 h-3.5" />{property.security_fee.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ) : null}
                    {property.extra_adult_rate ? (
                      <div className="flex items-center justify-between px-5 py-4 text-sm font-sans">
                        <span className="text-charcoal/70 dark:text-ivory/70">Extra Adult Rate (per night)</span>
                        <span className="flex items-center gap-1 font-medium text-charcoal dark:text-ivory">
                          <IndianRupee className="w-3.5 h-3.5" />{property.extra_adult_rate.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </section>
              )}
            </div>

            {/* ───────── Right: booking card ───────── */}
            <aside>
              <div className="lg:sticky lg:top-28 space-y-4">
                <div className="rounded-2xl bg-white dark:bg-[#121212] border border-stone-200/70 dark:border-stone-800 shadow-[0_10px_40px_rgba(0,0,0,0.07)] p-6">
                  <div className="mb-5">
                    {displayPrice ? (
                      <>
                        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60">
                          {pricePerNight ? "Price for your dates" : "Starting from"}
                        </p>
                        <p className="flex items-baseline gap-1.5">
                          <span className="font-serif text-4xl text-charcoal dark:text-ivory">₹{displayPrice.toLocaleString("en-IN")}</span>
                          <span className="text-sm font-sans text-charcoal/50 dark:text-ivory/50">/night</span>
                        </p>
                        {!pricePerNight && (
                          <p className="text-[11px] font-sans text-charcoal/45 dark:text-ivory/45 mt-1">Select dates for exact pricing</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60">Pricing</p>
                        <p className="font-serif text-3xl text-charcoal dark:text-ivory">Price on Request</p>
                      </>
                    )}
                  </div>

                  <BookingEnquiryForm propertyTitle={property.title} propertySlug={property.slug} enableBooking bare />

                  <ul className="mt-6 pt-5 border-t border-stone-200/70 dark:border-stone-800 space-y-4">
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-gold-600 flex-none mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">Secure booking</p>
                        <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60">Your payment is protected</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Headset className="w-5 h-5 text-gold-600 flex-none mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">Dedicated support</p>
                        <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60">We&apos;re here to help, always</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Similar villas */}
        {related.length > 0 && (
          <section className="bg-white dark:bg-[#0D0D0D] py-14 md:py-16">
            <div className="luxury-container">
              <div className="flex items-end justify-between gap-4 mb-8">
                <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal dark:text-ivory">
                  Similar Villas in {property.city}
                </h2>
                <Link
                  href={destination ? `/destinations/${destination.slug}` : "/properties"}
                  className="text-sm font-sans text-gold-600 dark:text-gold-400 underline underline-offset-4 whitespace-nowrap"
                >
                  View More Villas →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((rel) => {
                  const relPrice =
                    rel.starting_price && rel.starting_price !== PLACEHOLDER_PRICE ? rel.starting_price : null;
                  return (
                    <Link
                      key={rel.id}
                      href={`/properties/${rel.slug}`}
                      className="group block rounded-2xl overflow-hidden bg-ivory dark:bg-[#0A0A0A] border border-stone-200/60 dark:border-stone-800 shadow-sm hover:shadow-xl transition-shadow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={sizedImage(filterPropertyImages(rel.images)[0] ?? rel.images[0], 700)}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-lg text-charcoal dark:text-ivory mb-1 line-clamp-1">{rel.title.split("|")[0].trim()}</h3>
                        <p className="flex items-center gap-1.5 text-xs font-sans text-charcoal/60 dark:text-ivory/60 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-gold-500" />
                          {[rel.city, rel.state].filter(Boolean).join(", ")}
                        </p>
                        <p className="text-sm font-sans text-charcoal dark:text-ivory">
                          {relPrice ? (
                            <>From <b>₹{relPrice.toLocaleString("en-IN")}</b> <span className="text-charcoal/50 dark:text-ivory/50 text-xs">/night</span></>
                          ) : (
                            <span className="text-[11px] uppercase tracking-wide text-charcoal/50 dark:text-ivory/50">Price on Request</span>
                          )}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
