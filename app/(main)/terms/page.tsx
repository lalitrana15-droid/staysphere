import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — StaysVacation",
  description: "StaysVacation's terms of service — the terms and conditions governing use of our platform and services.",
};

export default function TermsPage() {
  return (
    <div className="pt-20 section-padding bg-ivory dark:bg-[#0A0A0A] min-h-screen">
      <div className="luxury-container max-w-3xl">
        <p className="label-text mb-5">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-4">
          Terms of Service
        </h1>
        <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50 mb-12">
          Last updated: January 2025
        </p>

        <div className="space-y-10 text-sm font-sans text-charcoal/70 dark:text-ivory/70 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the StaysVacation website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              2. Our Services
            </h2>
            <p>
              StaysVacation operates as a luxury stay distribution network, connecting travellers and travel professionals with premium private properties. We act as an intermediary between guests and property owners. All bookings are subject to the specific terms and conditions of the individual property.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              3. Enquiries and Bookings
            </h2>
            <p className="mb-4">
              Submitting an enquiry through our website does not constitute a confirmed booking. All bookings are subject to availability and are confirmed only upon receipt of a written confirmation from StaysVacation and payment of the required deposit.
            </p>
            <p>
              Prices displayed on our website are indicative only and may vary based on travel dates, occupancy, and seasonality. Final pricing will be confirmed at the time of booking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              4. Cancellations and Refunds
            </h2>
            <p>
              Cancellation policies vary by property. The applicable cancellation policy will be clearly communicated at the time of booking confirmation. StaysVacation's service fee is non-refundable in the event of a guest-initiated cancellation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              5. Intellectual Property
            </h2>
            <p>
              All content on the StaysVacation website — including text, photographs, graphics, logos, and software — is the property of StaysVacation or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              6. Limitation of Liability
            </h2>
            <p>
              StaysVacation acts as an intermediary and is not responsible for the acts or omissions of property owners or third-party service providers. To the maximum extent permitted by law, our liability for any claim arising out of your use of our services is limited to the fees paid to StaysVacation in connection with the relevant booking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              7. Governing Law
            </h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, India.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              8. Contact
            </h2>
            <p>
              For questions regarding these terms, please contact us at:{" "}
              <a href="mailto:hello@staysvacation.com" className="text-gold-600 dark:text-gold-400 hover:underline">
                hello@staysvacation.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
