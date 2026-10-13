import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";

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
                StaysVacation
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
                { label: "About StaysVacation", href: "/about" },
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
                href="mailto:hello@staysvacation.com"
                className="flex items-center gap-3 text-sm font-sans text-ivory/50 hover:text-gold-400 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@staysvacation.com
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="luxury-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-ivory/30 tracking-wide">
            © 2025 StaysVacation. All rights reserved.
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
