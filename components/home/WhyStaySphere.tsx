import { Shield, Star, HeadphonesIcon, Globe, Users, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Curated & Verified",
    description:
      "Every property in our network is personally inspected and verified to meet our exacting luxury standards.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Concierge",
    description:
      "Our luxury travel specialists are available around the clock to ensure every aspect of your stay is perfect.",
  },
  {
    icon: Globe,
    title: "Global Inventory",
    description:
      "Access over 500+ curated properties across India, Dubai, Bali, and an ever-expanding global network.",
  },
  {
    icon: Star,
    title: "Price on Request",
    description:
      "We negotiate exclusive rates on your behalf, often securing prices unavailable through any other channel.",
  },
  {
    icon: Users,
    title: "Expert Network",
    description:
      "Trusted by over 500 travel agents, wedding planners, and corporate retreat specialists across India.",
  },
  {
    icon: Award,
    title: "Bespoke Experiences",
    description:
      "From private chefs to helicopter arrivals, we orchestrate extraordinary experiences that go beyond the villa.",
  },
];

export function WhyStaySphere() {
  return (
    <section className="section-padding bg-white dark:bg-[#0D0D0D]">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="label-text mb-4">The Difference</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-5">
            Why StaySphere
          </h2>
          <div className="luxury-divider" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group">
                <div className="w-12 h-12 flex items-center justify-center border border-gold-500/30 bg-gold-500/5 mb-6 group-hover:bg-gold-500/10 group-hover:border-gold-500/50 transition-all duration-300">
                  <Icon className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                </div>
                <h3 className="font-serif text-xl font-light text-charcoal dark:text-ivory mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 pt-16 border-t border-stone-200 dark:border-stone-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Curated Properties" },
              { number: "10+", label: "Destinations" },
              { number: "2000+", label: "Luxury Stays Curated" },
              { number: "500+", label: "Agent Partners" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <p className="font-display text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-300">
                  {stat.number}
                </p>
                <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
