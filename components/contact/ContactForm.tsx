"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getReferralCode } from "@/components/ReferralTracker";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  enquiry_type: z.string().min(1, "Please select an enquiry type"),
  destination: z.string().optional(),
  message: z.string().min(10, "Please tell us a bit more"),
  agent_code: z
    .string()
    .regex(/^[A-Za-z0-9_-]{0,32}$/, "Letters, numbers, - and _ only")
    .optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAgent, setShowAgent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const ref = getReferralCode();
    if (ref) {
      setValue("agent_code", ref);
      setShowAgent(true);
    }
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact", ref_agent_code: data.agent_code?.trim() || getReferralCode() }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-12 text-center">
        <CheckCircle className="w-12 h-12 text-gold-500 mx-auto mb-5" />
        <h3 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-3">
          Thank You
        </h3>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60">
          Our luxury travel specialist will be in touch within 2 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-8">
      <div className="mb-8">
        <p className="label-text mb-3">Send Us a Message</p>
        <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">
          How Can We Help?
        </h2>
        <div className="w-10 h-px bg-gold-500 mt-4" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <p className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50">
          Your details
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <input
              {...register("name")}
              placeholder="Your Name *"
              className={cn("input-luxury", errors.name && "border-red-400")}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address *"
              className={cn("input-luxury", errors.email && "border-red-400")}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <input
              {...register("phone")}
              placeholder="Phone Number *"
              className={cn("input-luxury", errors.phone && "border-red-400")}
            />
            {errors.phone && (
              <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <select
              {...register("enquiry_type")}
              className={cn("input-luxury", errors.enquiry_type && "border-red-400")}
            >
              <option value="">Type of Enquiry *</option>
              <option value="villa_booking">Villa Booking</option>
              <option value="wedding">Wedding / Event</option>
              <option value="corporate">Corporate Retreat</option>
              <option value="agent">Agent Partnership</option>
              <option value="owner">List My Property</option>
              <option value="other">Other</option>
            </select>
            {errors.enquiry_type && (
              <p className="text-xs text-red-400 mt-1">{errors.enquiry_type.message}</p>
            )}
          </div>
        </div>

        <div>
          <select {...register("destination")} className="input-luxury">
            <option value="">Preferred Destination (optional)</option>
            {[
              "Udaipur", "Goa", "Jaipur", "Jodhpur", "Kasauli",
              "Mussoorie", "Lonavala", "Alibaug", "Dubai", "Bali", "Other"
            ].map((dest) => (
              <option key={dest} value={dest.toLowerCase()}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            {...register("message")}
            placeholder="Tell us about your travel plans, dates, group size, or any special requirements *"
            rows={5}
            className={cn("input-luxury resize-none", errors.message && "border-red-400")}
          />
          {errors.message && (
            <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
          )}
        </div>

        {showAgent ? (
          <div>
            <input
              {...register("agent_code")}
              placeholder="Agent code"
              autoCapitalize="characters"
              className={cn("input-luxury", errors.agent_code && "border-red-400")}
            />
            {errors.agent_code && (
              <p className="text-xs text-red-400 mt-1">{errors.agent_code.message}</p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAgent(true)}
            className="text-xs font-sans text-gold-600 dark:text-gold-400 underline underline-offset-4"
          >
            Have an agent code?
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Send Message"
          )}
        </button>
        <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 text-center">
          Our specialist responds within 2 hours
        </p>
      </form>
    </div>
  );
}
