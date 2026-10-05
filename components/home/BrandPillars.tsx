const pillars = [
  {
    roman: "I",
    title: "Curated Access",
    tagline: "Only the finest.",
    description:
      "Every property in our network is hand-picked, personally inspected, and held to an exacting standard. We turn down more than we accept.",
    accent: true,
  },
  {
    roman: "II",
    title: "Bespoke Experiences",
    tagline: "Beyond the villa.",
    description:
      "Private chefs, helicopter arrivals, sunset boat cruises — we craft experiences that are as extraordinary as the properties themselves.",
    accent: false,
  },
  {
    roman: "III",
    title: "White-Glove Service",
    tagline: "Every detail, handled.",
    description:
      "From first enquiry to checkout, our luxury travel specialists manage every detail — private chefs, transfers, bespoke experiences.",
    accent: false,
  },
  {
    roman: "IV",
    title: "Unmatched Reach",
    tagline: "34 destinations. 500+ villas.",
    description:
      "India's most comprehensive luxury villa network — Udaipur to Dubai, Goa to the Himalayas — with an ever-expanding global footprint.",
    accent: false,
  },
];

export function BrandPillars() {
  return (
    <section className="bg-charcoal-900 dark:bg-[#0A0A0A]">
      {/* Header */}
      <div className="luxury-container py-20 pb-0">
        <div className="flex items-center gap-6">
          <div className="h-px flex-1 bg-gold-500/20" />
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-gold-400">
            The StaySphere Difference
          </p>
          <div className="h-px flex-1 bg-gold-500/20" />
        </div>
      </div>

      {/* 2×2 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {pillars.map((p) => (
          <div
            key={p.roman}
            className={`relative group px-12 py-16 md:px-16 md:py-20 border-b border-r border-gold-500/10 overflow-hidden transition-colors duration-500 ${
              p.accent
                ? "bg-gold-500 hover:bg-gold-400"
                : "bg-charcoal-900 dark:bg-[#0A0A0A] hover:bg-charcoal-800"
            }`}
          >
            {/* Ghost Roman Numeral */}
            <span
              className={`absolute -right-4 -bottom-8 font-display text-[9rem] md:text-[12rem] font-bold leading-none select-none pointer-events-none transition-opacity duration-500 ${
                p.accent
                  ? "text-charcoal-900/20 group-hover:text-charcoal-900/30"
                  : "text-gold-500/8 group-hover:text-gold-500/12"
              }`}
            >
              {p.roman}
            </span>

            {/* Content */}
            <div className="relative z-10">
              <p
                className={`text-[10px] font-sans font-medium tracking-[0.2em] uppercase mb-6 ${
                  p.accent ? "text-charcoal-800" : "text-gold-500/70"
                }`}
              >
                {p.tagline}
              </p>
              <h3
                className={`font-serif text-3xl md:text-4xl font-light mb-4 leading-tight ${
                  p.accent ? "text-charcoal-900" : "text-ivory"
                }`}
              >
                {p.title}
              </h3>
              <div
                className={`w-10 h-px mb-6 ${
                  p.accent ? "bg-charcoal-900/40" : "bg-gold-500/50"
                }`}
              />
              <p
                className={`text-sm font-sans leading-relaxed max-w-xs ${
                  p.accent ? "text-charcoal-800/80" : "text-ivory/50"
                }`}
              >
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Stats Strip */}
      <div className="luxury-container py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "500+", label: "Curated Properties" },
            { number: "34", label: "Destinations" },
            { number: "2,000+", label: "Luxury Stays Curated" },
            { number: "500+", label: "Agent Partners" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl md:text-5xl font-light text-ivory mb-2">
                {stat.number}
              </p>
              <p className="text-[9px] font-sans font-medium tracking-[0.18em] uppercase text-ivory/30">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
