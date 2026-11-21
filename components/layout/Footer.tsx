import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube, ShieldCheck, Headset, CreditCard } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

// Real photo of one of our villas (served from our own image CDN)
const FOOTER_BG = "https://img.staysvacation.com/1_H7_A6784_HDR_a4c3156666.webp?w=1600";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Villas", href: "/properties" },
      { label: "Experiences", href: "/experiences" },
      { label: "Destinations", href: "/destinations" },
    ],
  },
  {
    title: "Top Destinations",
    links: [
      { label: "Goa", href: "/destinations/goa" },
      { label: "Udaipur", href: "/destinations/udaipur" },
      { label: "Jaipur", href: "/destinations/jaipur" },
      { label: "Kasauli", href: "/destinations/kasauli" },
      { label: "Bali", href: "/destinations/bali" },
    ],
  },
  {
    title: "For Owners",
    links: [
      { label: "List Your Property", href: "/owner-partnership" },
      { label: "Agent Program", href: "/agent-program" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/#faq" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const TRUST = [
  { icon: ShieldCheck, title: "Verified Villas", text: "Quality-checked stays" },
  { icon: Headset, title: "Dedicated Support", text: "Help throughout your stay" },
  { icon: CreditCard, title: "Secure Payments", text: "Pay online with Razorpay" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0b0a08] text-ivory">
      {/* Atmospheric villa photo at the bottom */}
      <Image
        src={FOOTER_BG}
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="object-cover object-bottom opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0a08] via-[#0b0a08]/80 to-[#0b0a08]/25" />

      <div className="relative luxury-container pt-14 md:pt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.4fr_repeat(4,1fr)_1.5fr] gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl text-white">StaysVacation</span>
              <span className="block text-[10px] font-sans font-semibold tracking-[0.4em] uppercase text-gold-300 mt-1">
                Luxury Stays
              </span>
            </Link>
            <p className="mt-5 text-sm font-sans text-ivory/75 leading-relaxed max-w-xs">
              Handpicked villas, curated experiences and exclusive stays across India.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
                { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
                { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-ivory/80 hover:text-gold-300 hover:border-gold-300/60 transition-colors"
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-gold-300 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm font-sans text-ivory/85 hover:text-gold-300 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:border-l lg:border-white/15 lg:pl-8">
            <h4 className="font-serif text-2xl text-white mb-2">Stay in the Loop</h4>
            <p className="text-sm font-sans text-ivory/75 leading-relaxed mb-5">
              Get new villas, exclusive offers and experience updates.
            </p>
            <NewsletterForm />
            <a
              href="mailto:hello@staysvacation.com"
              className="mt-4 inline-block text-xs font-sans text-ivory/60 hover:text-gold-300 transition-colors"
            >
              hello@staysvacation.com
            </a>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 md:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x sm:divide-white/15">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 sm:px-8 first:sm:pl-0 sm:justify-start">
              <Icon className="w-8 h-8 text-gold-300 flex-none" strokeWidth={1.3} />
              <div>
                <p className="text-sm font-sans font-semibold text-white">{title}</p>
                <p className="text-xs font-sans text-ivory/70">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/15 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-sans text-ivory/70">
            © {new Date().getFullYear()} StaysVacation. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-sans text-ivory/70">
            <Link href="/privacy" className="hover:text-gold-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gold-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
