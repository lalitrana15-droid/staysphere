import { notFound } from "next/navigation";
import Image from "next/image";
import { getPropertyBySlug } from "@/data/properties";
import { BedDouble, Bath, Users, Waves, MapPin, CheckCircle } from "lucide-react";
import { PrintButton } from "@/components/property/PrintButton";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ branded?: string }>;
}

export default async function PropertyBrochurePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { branded } = await searchParams;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const isBranded = branded !== "false";

  return (
    <div className="brochure-root">
      {/* Print button — hidden on print */}
      <div className="no-print fixed bottom-6 right-6 z-50 flex gap-3">
        <a
          href={`/properties/${property.slug}/brochure?branded=true`}
          className="bg-[#c9a84c] text-white text-xs font-sans font-medium tracking-widest uppercase px-4 py-2.5 hover:bg-[#b5933e] transition-colors"
        >
          Branded PDF
        </a>
        <a
          href={`/properties/${property.slug}/brochure?branded=false`}
          className="bg-[#1a1a1a] text-white text-xs font-sans font-medium tracking-widest uppercase px-4 py-2.5 hover:bg-[#333] transition-colors"
        >
          Unbranded PDF
        </a>
        <PrintButton />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f8f7f4; }

        .brochure-root {
          font-family: 'Inter', sans-serif;
          color: #1a1a1a;
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
        }

        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .brochure-root { max-width: 100%; box-shadow: none; }
          @page { margin: 0; size: A4; }
        }

        .hero {
          position: relative;
          width: 100%;
          height: 480px;
          overflow: hidden;
        }

        .hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%);
        }

        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px;
        }

        .brand-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .brand-tagline {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
        }

        .property-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 300;
          color: #fff;
          line-height: 1.1;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
        }

        .property-location {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }

        .body-section {
          padding: 48px 40px;
        }

        .section-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 16px;
        }

        .description {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 300;
          line-height: 1.75;
          color: #2a2a2a;
        }

        .divider {
          width: 48px;
          height: 1px;
          background: #c9a84c;
          margin: 32px 0;
        }

        .stats-row {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          color: #1a1a1a;
          line-height: 1;
        }

        .stat-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #888;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }

        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #2a2a2a;
          line-height: 1.4;
        }

        .highlight-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c9a84c;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .amenity-item {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #555;
          padding: 8px 12px;
          border: 1px solid #e8e4df;
          background: #faf9f7;
        }

        .gallery-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          height: 280px;
        }

        .gallery-row img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .footer-bar {
          background: #1a1a1a;
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #c9a84c;
        }

        .footer-contact {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5);
          text-align: right;
        }

        .unbranded-notice {
          background: #f8f7f4;
          border-bottom: 1px solid #e8e4df;
          padding: 8px 40px;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          text-align: center;
        }
      `}</style>

      {/* Hero */}
      <div className="hero">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover"
          sizes="900px"
          priority
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          {isBranded && (
            <>
              <div className="brand-logo">StaySphere</div>
              <div className="brand-tagline">Curated Luxury Stays</div>
            </>
          )}
          <h1 className="property-title">{property.title}</h1>
          <p className="property-location">
            {property.city}
            {property.state ? `, ${property.state}` : ""} · {property.country}
          </p>
        </div>
      </div>

      {!isBranded && (
        <div className="unbranded-notice">
          Confidential — For Agent Use Only
        </div>
      )}

      {/* Main Body */}
      <div className="body-section">
        <p className="section-label">About This Property</p>
        <p className="description">{property.description}</p>

        <div className="divider" />

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">{property.bedrooms}</span>
            <span className="stat-label">Bedrooms</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{property.bathrooms}</span>
            <span className="stat-label">Bathrooms</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{property.max_guests}</span>
            <span className="stat-label">Max Guests</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ textTransform: "capitalize" }}>
              {property.property_type}
            </span>
            <span className="stat-label">Property Type</span>
          </div>
          {property.has_pool && (
            <div className="stat-item">
              <span className="stat-value">Yes</span>
              <span className="stat-label">Private Pool</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {property.highlights && property.highlights.length > 0 && (
          <>
            <p className="section-label">Highlights</p>
            <div className="highlights-grid">
              {property.highlights.map((h) => (
                <div key={h} className="highlight-item">
                  <span className="highlight-dot" />
                  {h}
                </div>
              ))}
            </div>
            <div className="divider" />
          </>
        )}

        {/* Amenities */}
        <p className="section-label">Amenities</p>
        <div className="amenities-grid">
          {property.amenities.map((a) => (
            <div key={a} className="amenity-item">{a}</div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      {property.images.length >= 3 && (
        <div className="gallery-row">
          <img src={property.images[1]} alt="" />
          <img src={property.images[2]} alt="" />
        </div>
      )}

      {/* Footer */}
      <div className="footer-bar">
        {isBranded ? (
          <>
            <div className="footer-brand">StaySphere</div>
            <div className="footer-contact">
              Enquiries: hello@staysphere.com<br />
              staysphere.com/properties/{property.slug}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
              CONFIDENTIAL — AGENT COPY
            </div>
            <div className="footer-contact">
              Price on Request · Contact your agent
            </div>
          </>
        )}
      </div>
    </div>
  );
}
