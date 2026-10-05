import type { Metadata } from "next";
import Image from "next/image";
import { OwnerInquiryForm } from "@/components/forms/OwnerInquiryForm";
import { Shield, TrendingUp, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "List Your Property — Partner With StaySphere",
  description:
    "List your luxury property on StaySphere. Join India's most trusted luxury stay distribution network and connect with discerning travellers worldwide.",
};

export default function OwnerPartnershipPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=90"
          alt="List Your Property"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 luxury-container pb-12">
          <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-300 mb-3">
            For Property Owners
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-3">
            List Your Property
          </h1>
          <p className="text-sm font-sans text-white/70 max-w-lg">
            Partner with India&apos;s premier luxury stay distribution network.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding bg-ivory dark:bg-[#0A0A0A]">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <p className="label-text mb-5">Why StaySphere</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal dark:text-ivory mb-8">
                Your Property Deserves the Right Audience
              </h2>
              <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70 leading-relaxed mb-10">
                StaySphere connects extraordinary properties with discerning travellers who appreciate genuine luxury. We don&apos;t just list your property — we position it, present it, and protect its reputation within our curated network.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  {
                    icon: Users,
                    title: "Qualified Leads",
                    description: "Direct access to our network of luxury travellers and travel professionals.",
                  },
                  {
                    icon: Shield,
                    title: "Verified Guests",
                    description: "Every booking enquiry is screened before it reaches you.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Premium Positioning",
                    description: "Your property presented in its best light to the right audience.",
                  },
                  {
                    icon: Star,
                    title: "White Glove Service",
                    description: "Our team handles all guest communications and logistics.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-5">
                      <Icon className="w-5 h-5 text-gold-500 mb-3" />
                      <h3 className="font-sans text-sm font-medium text-charcoal dark:text-ivory mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Standards note */}
              <div className="bg-gold-500/5 border border-gold-500/20 p-6">
                <p className="label-text mb-3">Our Standards</p>
                <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70 leading-relaxed">
                  StaySphere maintains one of the industry&apos;s most rigorous property selection processes. We personally inspect every property before listing and maintain ongoing quality standards. Only a select few applications are accepted each quarter.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <OwnerInquiryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
