import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { KycForm } from "@/components/forms/KycForm";

export const metadata: Metadata = {
  title: "Guest KYC — StaySphere",
  description: "Complete your identity verification before check-in at your StaySphere property.",
};

export default function KycPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-[#0A0A0A] pt-24 pb-16">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-gold-500" />
            <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-600 dark:text-gold-400">
              Secure Check-In
            </p>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal dark:text-ivory mb-4">
            Guest Verification
          </h1>
          <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50 max-w-md mx-auto">
            Please complete your identity verification at least 24 hours before your scheduled check-in.
          </p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <Lock className="w-3.5 h-3.5 text-charcoal/30" />
            <span className="text-[10px] font-sans text-charcoal/30 tracking-[0.1em] uppercase">SSL Encrypted · Secure Storage</span>
          </div>
        </div>

        {/* Form */}
        <Suspense fallback={<div className="text-center py-20 text-sm text-charcoal/40">Loading form...</div>}>
          <KycForm />
        </Suspense>
      </div>
    </div>
  );
}
