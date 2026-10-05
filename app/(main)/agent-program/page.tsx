import type { Metadata } from "next";
import Image from "next/image";
import { AgentRegistrationForm } from "@/components/forms/AgentRegistrationForm";
import { Check, TrendingUp, Users, Headphones, Zap, IndianRupee, Link } from "lucide-react";

export const metadata: Metadata = {
  title: "Agent Program — Partner With StaySphere",
  description:
    "Join StaySphere's Agent Program. Earn 10% commission on every booking. Access B2B pricing, dedicated support, exclusive inventory, and faster bookings.",
};

const benefits = [
  {
    icon: IndianRupee,
    title: "10% Commission",
    description: "Earn 10% on every confirmed booking made through your unique referral link — paid directly to you.",
  },
  {
    icon: Link,
    title: "Personal Referral Link",
    description: "Get your own trackable referral link and code the moment you register. Share with clients instantly.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Your own account manager with direct contact — not a ticketing system.",
  },
  {
    icon: TrendingUp,
    title: "B2B Pricing",
    description: "Exclusive agent rates on our full inventory, significantly below consumer pricing.",
  },
  {
    icon: Zap,
    title: "Faster Bookings",
    description: "Priority confirmation and express processing for time-sensitive bookings.",
  },
  {
    icon: Users,
    title: "Luxury Inventory",
    description: "Access to our full curated network, including off-market properties not publicly listed.",
  },
];

export default function AgentProgramPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1920&q=90"
          alt="Agent Program"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 luxury-container pb-12">
          <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-300 mb-3">
            For Travel Professionals
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-3">
            Partner With StaySphere
          </h1>
          <p className="text-sm font-sans text-white/70 max-w-lg">
            Join India&apos;s most trusted luxury stay distribution network.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Benefits */}
            <div>
              <p className="label-text mb-5">Why Partner With Us</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal dark:text-ivory mb-8">
                Built for Luxury Travel Professionals
              </h2>
              <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70 leading-relaxed mb-10">
                StaySphere was built with travel professionals in mind. We understand that your reputation depends on the quality of what you recommend — which is why we offer only the finest inventory, backed by the support infrastructure that luxury bookings demand.
              </p>

              {/* Benefits */}
              <div className="space-y-6 mb-12">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex items-start gap-5">
                      <div className="w-10 h-10 flex items-center justify-center border border-gold-500/30 bg-gold-500/5 flex-shrink-0">
                        <Icon className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-medium text-charcoal dark:text-ivory mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* What You Get */}
              <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
                <p className="label-text mb-5">What&apos;s Included</p>
                <ul className="space-y-3">
                  {[
                    "B2B portal access with real-time availability",
                    "Dedicated account manager",
                    "Agent commission on every booking",
                    "Priority property inspections",
                    "Marketing materials and collateral",
                    "Quarterly luxury familiarisation trips",
                    "24/7 emergency support line",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span className="text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Registration Form */}
            <div>
              <AgentRegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
