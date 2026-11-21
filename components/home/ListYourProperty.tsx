import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarCheck, TrendingUp, Headset, ShieldCheck } from "lucide-react";

const POINTS = [
  { icon: CalendarCheck, label: "More Bookings" },
  { icon: TrendingUp, label: "Higher Earnings" },
  { icon: Headset, label: "End-to-End Support" },
  { icon: ShieldCheck, label: "Verified Guests" },
];

export function ListYourProperty() {
  return (
    <section className="relative overflow-hidden bg-[#0d0b08]">
      {/* Photo fills the section; dark gradient keeps the left text readable */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-right"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b08] from-30% via-[#0d0b08]/75 via-50% to-[#0d0b08]/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="relative luxury-container py-16 md:py-24">
        <div className="max-w-xl">
          <div className="flex items-center gap-4 mb-5">
            <p className="text-[11px] md:text-xs font-sans font-semibold tracking-[0.3em] uppercase text-gold-300">
              Property Owners
            </p>
            <span className="h-px w-14 bg-gold-400/70" />
          </div>

          <h2 className="font-serif text-4xl md:text-6xl font-normal text-white leading-[1.1] mb-5">
            List Your Property
            <br />
            With Us
          </h2>

          <p className="text-sm md:text-base font-sans text-white/80 leading-relaxed max-w-md mb-8">
            Join India&apos;s most trusted luxury villa network. We handle bookings, marketing, and guest management — you simply enjoy the returns.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:items-stretch gap-y-5 mb-9">
            {POINTS.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-2 px-3 sm:px-5 text-center ${
                  i > 0 ? "sm:border-l sm:border-white/20" : "sm:pl-0"
                }`}
              >
                <Icon className="w-6 h-6 text-gold-300" strokeWidth={1.4} />
                <span className="text-[11px] sm:text-xs font-sans text-white/90 leading-tight">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/owner-partnership"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-b from-gold-300 to-gold-400 hover:from-gold-200 hover:to-gold-300 text-charcoal text-sm font-sans font-semibold rounded-md transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/owner-partnership"
              className="inline-flex items-center gap-2.5 px-6 py-3 border border-gold-300/60 text-white hover:bg-white/10 text-sm font-sans font-medium rounded-md transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
