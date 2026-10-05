"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I enquire about a property?",
    answer:
      "Simply click 'Enquire Now' on any property or destination page, fill in your details and dates, and our luxury travel specialists will respond within 2 hours with availability and pricing.",
  },
  {
    question: "Are your properties available for weddings and events?",
    answer:
      "Yes — many of our properties welcome weddings, private celebrations, corporate retreats, and content creation events. Our event specialists will work with you to understand your vision and create a bespoke proposal.",
  },
  {
    question: "Do you offer travel agent or B2B partnerships?",
    answer:
      "We have a dedicated Agent Program offering B2B pricing, priority support, and a dedicated account manager. Visit our Agent Program page or email us to learn more about partnering with StaySphere.",
  },
  {
    question: "What is included in the pricing?",
    answer:
      "Our pricing is bespoke to each booking. Most of our properties are priced on request, as pricing varies by dates, group size, and any additional services. Contact us for a tailored quote.",
  },
  {
    question: "Can I list my luxury property on StaySphere?",
    answer:
      "If you own or manage a luxury property that meets our quality standards, we would love to hear from you. Visit our Owner Partnership page to submit your property for consideration.",
  },
  {
    question: "What destinations do you cover?",
    answer:
      "We currently offer properties across India (Udaipur, Goa, Jaipur, Jodhpur, Kasauli, Mussoorie, Lonavala, Alibaug) and internationally in Dubai and Bali. We are continuously expanding our network to new destinations.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-white dark:bg-[#0D0D0D]">
      <div className="luxury-container">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="label-text mb-4">Questions & Answers</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-5">
              Frequently Asked
            </h2>
            <div className="luxury-divider" />
          </div>

          {/* FAQ Items */}
          <div className="space-y-0 divide-y divide-stone-200 dark:divide-stone-800">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-6">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="flex items-start justify-between w-full text-left gap-4 group"
                >
                  <h3 className="font-serif text-lg font-light text-charcoal dark:text-ivory group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors duration-200 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-stone-300 dark:border-stone-700 text-charcoal/50 dark:text-ivory/50 group-hover:border-gold-500 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-all duration-200">
                    {openIndex === idx ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-400 ease-in-out",
                    openIndex === idx ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="font-sans text-sm text-charcoal/60 dark:text-ivory/60 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
