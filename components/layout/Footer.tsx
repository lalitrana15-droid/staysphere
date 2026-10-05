import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal dark:bg-[#080808] text-ivory/80">
      {/* Main Footer */}
      <div className="luxury-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="font-display text-2xl font-light tracking-[0.08em] text-ivory">
                StaySphere
              </span>
              <p className="text-[9px] font-sans font-medium tracking-[0.25em] uppercase text-gold-400 mt-1">
                Global Luxury Stay Distribution Network
              </p>
            </div>
            <p className="text-sm font-sans text-ivory/60 leading-relaxed mb-6">
              The world&apos;s most curated marketplace for extraordinary luxury stays — from lakeside palaces in Udaipur to clifftop villas in Bali.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-gold-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-gold-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-gold-400 transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-400 mb-5">
              Destinations
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Udaipur", slug: "udaipur" },
                { label: "Goa", slug: "goa" },
                { label: "Jaipur", slug: "jaipur" },
                { label: "Jodhpur", slug: "jodhpur" },
                { label: "Kasauli", slug: "kasauli" },
                { label: "Mussoorie", slug: "mussoorie" },
                { label: "Dubai", slug: "dubai" },
                { label: "Bali", slug: "bali" },
              ].map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-sm font-sans text-ivory/50 hover:text-gold-400 transition-colors duration-200"
                  >
                    {dest.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences & Company */}
          <div>
            <h4 className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-400 mb-5">
              Experiences
            </h4>
            <ul className="space-y-3 mb-8">
              {[
                { label: "Luxury Weddings", href: "/experiences/weddings" },
                { label: "Corporate Retreats", href: "/experiences/corporate-retreats" },
                { label: "Creator Retreats", href: "/experiences/creator-retreats" },
                { label: "Private Dining", href: "/experiences/private-dining" },
                { label: "Wellness Escapes", href: "/experiences/wellness-escapes" },
              ].map((exp) => (
                <li key={exp.href}>
                  <Link
                    href={exp.href}
                    className="text-sm font-sans text-ivory/50 hover:text-gold-400 transition-colors duration-200"
                  >
                    {exp.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-400 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About StaySphere", href: "/about" },
                { label: "Agent Program", href: "/agent-program" },
                { label: "List Your Property", href: "/owner-partnership" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-ivory/50 hover:text-gold-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-400 mb-5">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:hello@staysphere.com"
                className="flex items-center gap-3 text-sm font-sans text-ivory/50 hover:text-gold-400 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@staysphere.com
              </a>
              <a
                href="tel:+919999999999"
                className="flex items-center gap-3 text-sm font-sans text-ivory/50 hover:text-gold-400 transition-colors duration-200"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91 99999 99999
              </a>
              <div className="flex items-start gap-3 text-sm font-sans text-ivory/50">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Mumbai, India</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-sans font-medium tracking-[0.1em] uppercase hover:bg-[#25D366]/20 transition-all duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="luxury-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-ivory/30 tracking-wide">
            © 2025 StaySphere. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs font-sans text-ivory/30 hover:text-ivory/60 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-sans text-ivory/30 hover:text-ivory/60 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
