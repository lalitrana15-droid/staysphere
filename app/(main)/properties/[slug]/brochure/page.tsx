import { notFound } from "next/navigation";
import Image from "next/image";
import { getPropertyBySlug } from "@/data/properties";
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

  // Split images: hero + gallery (all remaining, no blanks)
  const heroImg = property.images[0];
  const galleryImgs = property.images.slice(1); // images[1..] for gallery

  // images[1] shown full-width as gallery opener; images[2..] grouped into rows
  const galleryRemainder = galleryImgs.slice(1);
  const galleryRows: string[][] = [];
  for (let i = 0; i < galleryRemainder.length; i += 3) {
    galleryRows.push(galleryRemainder.slice(i, i + 3));
  }

  return (
    <div className="brochure-root">
      {/* Print / download buttons */}
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
          nav, footer, .no-print { display: none !important; }
          .brochure-root { max-width: 100%; box-shadow: none; }
          @page { margin: 0; size: A4; }
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          width: 100%;
          height: 480px;
          overflow: hidden;
        }
        .hero img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%);
        }
        .hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 36px 40px;
        }
        .brand-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 300;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 4px;
        }
        .brand-tagline {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(255,255,255,0.55); margin-bottom: 20px;
        }
        .property-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px; font-weight: 300;
          color: #fff; line-height: 1.1;
          letter-spacing: 0.02em; margin-bottom: 8px;
        }
        .property-location {
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.65);
        }

        /* ── Body ── */
        .body-section { padding: 44px 40px 0; }

        .section-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 14px;
        }
        .description {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px; font-weight: 300;
          line-height: 1.8; color: #2a2a2a;
        }
        .divider {
          width: 48px; height: 1px;
          background: #c9a84c; margin: 32px 0;
        }

        /* ── Stats ── */
        .stats-row {
          display: flex; gap: 40px; flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px; font-weight: 300;
          color: #1a1a1a; line-height: 1;
        }
        .stat-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: #999;
        }

        /* ── Amenities ── */
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .amenity-item {
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.04em; color: #444;
          padding: 9px 12px;
          border: 1px solid #e8e4df;
          background: #faf9f7;
        }

        /* ── Rules ── */
        .rules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 4px;
        }
        .rule-card {
          padding: 20px 24px;
          border: 1px solid #e8e4df;
          background: #faf9f7;
        }
        .rule-card-title {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 12px;
        }
        .rule-item {
          font-size: 12px; color: #444;
          line-height: 1.9; display: flex;
          align-items: flex-start; gap: 8px;
        }
        .rule-dot {
          width: 4px; height: 4px;
          border-radius: 50%; background: #c9a84c;
          flex-shrink: 0; margin-top: 7px;
        }

        /* ── Cancellation ── */
        .cancel-box {
          border: 1px solid #f0d0d0;
          background: #fff8f8;
          padding: 16px 20px;
          margin-top: 12px;
        }
        .cancel-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #c0392b; margin-bottom: 4px;
        }
        .cancel-desc {
          font-size: 12px; color: #666;
        }

        /* ── Location ── */
        .location-card {
          border: 1px solid #e8e4df;
          background: #faf9f7;
          padding: 20px 24px;
        }
        .location-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 300;
          color: #1a1a1a; margin-bottom: 6px;
        }
        .location-country {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: #888;
        }

        /* ── Gallery ── */
        .gallery-section { margin-top: 40px; }
        .gallery-row {
          display: grid;
          gap: 4px;
          margin-bottom: 4px;
        }
        .gallery-row img {
          width: 100%; height: 200px;
          object-fit: cover; display: block;
        }
        .gallery-hero-img {
          width: 100%; height: 340px;
          object-fit: cover; display: block;
          margin-bottom: 4px;
        }
        .unbranded-notice {
          background: #f8f7f4;
          border-bottom: 1px solid #e8e4df;
          padding: 8px 40px;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #aaa; text-align: center;
        }

        /* ── Footer ── */
        .footer-bar {
          background: #1a1a1a;
          padding: 24px 40px;
          display: flex; align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }
        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 300;
          letter-spacing: 0.1em; color: #c9a84c;
        }
        .footer-contact {
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.45);
          text-align: right; line-height: 1.7;
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="hero">
        <Image
          src={heroImg}
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
              <div className="brand-logo">StaysVacation</div>
              <div className="brand-tagline">Curated Luxury Stays</div>
            </>
          )}
          <h1 className="property-title">{property.code ?? property.title}</h1>
          <p className="property-location">
            {property.city}{property.state ? `, ${property.state}` : ""} · {property.country}
          </p>
        </div>
      </div>

      {!isBranded && (
        <div className="unbranded-notice">Confidential — For Agent Use Only</div>
      )}

      {/* ── BODY ── */}
      <div className="body-section">

        {/* Description */}
        <p className="section-label">About This Property</p>
        <p className="description">{property.description}</p>

        <div className="divider" />

        {/* Stats */}
        <p className="section-label">Overview</p>
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
          {property.starting_price && (
            <div className="stat-item">
              <span className="stat-value">₹{property.starting_price.toLocaleString("en-IN")}</span>
              <span className="stat-label">Starting From / Night</span>
            </div>
          )}
        </div>

        <div className="divider" />

        {/* Amenities */}
        <p className="section-label">Amenities & Features</p>
        <div className="amenities-grid" style={{ marginBottom: 32 }}>
          {property.amenities.map((a) => (
            <div key={a} className="amenity-item">{a}</div>
          ))}
        </div>

        <div className="divider" />

        {/* Check-in / Check-out */}
        <p className="section-label">House Rules</p>
        <div className="rules-grid">
          <div className="rule-card">
            <div className="rule-card-title">Check-In</div>
            <div className="rule-item"><span className="rule-dot" /><span>From 3:00 PM onwards</span></div>
            <div className="rule-item"><span className="rule-dot" /><span>Carry a valid ID for verification</span></div>
            <div className="rule-item"><span className="rule-dot" /><span>Early check-in on request (subject to availability)</span></div>
          </div>
          <div className="rule-card">
            <div className="rule-card-title">Check-Out</div>
            <div className="rule-item"><span className="rule-dot" /><span>By 11:00 AM</span></div>
            <div className="rule-item"><span className="rule-dot" /><span>Late check-out on request (subject to availability)</span></div>
          </div>
        </div>

        {/* Cancellation */}
        <div className="cancel-box">
          <div className="cancel-label">Cancellation Policy — No Refund</div>
          <div className="cancel-desc">This booking is non-refundable. Cancellations will not be eligible for any refund.</div>
        </div>

        <div className="divider" />

        {/* Location */}
        <p className="section-label">Location</p>
        <div className="location-card" style={{ marginBottom: 32 }}>
          <div className="location-name">{property.city}</div>
          <div className="location-country">{property.state ? `${property.state} · ` : ""}{property.country}</div>
          {property.city === "Dubai" && (
            <p style={{ fontSize: 12, color: "#666", marginTop: 10, lineHeight: 1.7 }}>
              Dubai — a city where modern architecture meets desert luxury. Enjoy world-class dining, pristine beaches, iconic landmarks, and an unmatched lifestyle experience.
            </p>
          )}
        </div>

      </div>

      {/* ── GALLERY — all images, no blank cells ── */}
      {galleryImgs.length > 0 && (
        <div className="gallery-section" style={{ padding: "0 0 0 0" }}>
          {/* Show second image full-width as gallery opener */}
          <img
            src={galleryImgs[0]}
            alt=""
            className="gallery-hero-img"
          />
          {/* Remaining images grouped into rows of 3 — last row uses actual count as columns */}
          {galleryRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="gallery-row"
              style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
            >
              {row.map((img, imgIdx) => (
                <img key={imgIdx} src={img} alt="" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── FOOTER ── */}
      <div className="footer-bar">
        {isBranded ? (
          <>
            <div className="footer-brand">StaysVacation</div>
            <div className="footer-contact">
              Enquiries: hello@staysvacation.com<br />
              staysvacation.com/properties/{property.slug}
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
