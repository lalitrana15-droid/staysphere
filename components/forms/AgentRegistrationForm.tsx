"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, Copy, Link } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  agency_name: z.string().min(2, "Please enter your agency name"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  years_experience: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AgentRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.referral_code) setReferralCode(json.referral_code);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-12 text-center">
        <CheckCircle className="w-12 h-12 text-gold-500 mx-auto mb-5" />
        <h3 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-3">
          Application Received
        </h3>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mb-6">
          Our agent partnerships team will review your application and be in touch within 24 hours.
        </p>
        {referralCode && (
          <div className="border border-gold-500/30 bg-gold-500/5 p-6 text-left">
            <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-3 flex items-center gap-2">
              <Link className="w-3.5 h-3.5" />
              Your Referral Details
            </p>
            <p className="font-mono text-lg font-medium text-charcoal dark:text-ivory mb-1">
              {referralCode}
            </p>
            <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mb-4 break-all">
              {typeof window !== "undefined" ? window.location.origin : ""}/?ref={referralCode}
            </p>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white text-xs font-sans font-medium tracking-wide uppercase hover:bg-gold-600 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy Referral Link"}
            </button>
            <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 mt-3">
              You earn 10% commission on every booking made through your link.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-8">
      <div className="mb-8">
        <p className="label-text mb-3">Apply Now</p>
        <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">
          Agent Registration
        </h2>
        <div className="w-10 h-px bg-gold-500 mt-4" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <input
              {...register("name")}
              placeholder="Your Name *"
              className={cn("input-luxury", errors.name && "border-red-400")}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address *"
              className={cn("input-luxury", errors.email && "border-red-400")}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <input
            {...register("phone")}
            placeholder="Phone Number *"
            className={cn("input-luxury", errors.phone && "border-red-400")}
          />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <input
            {...register("agency_name")}
            placeholder="Agency / Company Name *"
            className={cn("input-luxury", errors.agency_name && "border-red-400")}
          />
          {errors.agency_name && (
            <p className="text-xs text-red-400 mt-1">{errors.agency_name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("website")}
            placeholder="Website (optional)"
            className="input-luxury"
          />
        </div>

        <div>
          <select {...register("years_experience")} className="input-luxury">
            <option value="">Years of Experience</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        <div>
          <textarea
            {...register("message")}
            placeholder="Tell us about your business, specialisations, and why you want to partner with StaySphere"
            rows={4}
            className="input-luxury resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
        </button>

        <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 text-center">
          We review all applications within 24 hours
        </p>
      </form>
    </div>
  );
}
