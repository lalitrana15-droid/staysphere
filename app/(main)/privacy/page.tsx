import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — StaysVacation",
  description: "StaysVacation's privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-20 section-padding bg-ivory dark:bg-[#0A0A0A] min-h-screen">
      <div className="luxury-container max-w-3xl">
        <p className="label-text mb-5">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50 mb-12">
          Last updated: January 2025
        </p>

        <div className="space-y-10 text-sm font-sans text-charcoal/70 dark:text-ivory/70 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              When you use StaysVacation, we may collect the following types of information:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                <span><strong className="text-charcoal dark:text-ivory font-medium">Contact information</strong> — name, email address, phone number, when you submit an enquiry or contact form.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                <span><strong className="text-charcoal dark:text-ivory font-medium">Booking details</strong> — travel dates, number of guests, property preferences, and special requirements.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                <span><strong className="text-charcoal dark:text-ivory font-medium">Usage data</strong> — pages visited, time on site, and browser information, collected via analytics tools.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                <span>Respond to your enquiries and facilitate bookings.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                <span>Send you relevant updates about properties and availability.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                <span>Improve the quality and relevance of our service.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                <span>Comply with legal obligations.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              3. Sharing of Information
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information with property partners strictly as necessary to fulfil a booking, and with service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              4. Data Security
            </h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All data transmitted between your browser and our servers is encrypted using SSL/TLS.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              5. Cookies
            </h2>
            <p>
              Our website uses cookies to enhance your browsing experience, analyse site traffic, and understand where visitors are coming from. You may configure your browser to refuse cookies; however, some parts of the website may not function correctly as a result.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              6. Your Rights
            </h2>
            <p className="mb-4">
              You have the right to access, correct, or request deletion of the personal data we hold about you. To exercise these rights, please contact us at:
            </p>
            <p>
              <a href="mailto:hello@staysvacation.com" className="text-gold-600 dark:text-gold-400 hover:underline">
                hello@staysvacation.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-4">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on this page with the updated date. Your continued use of our website after any changes constitutes your acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
