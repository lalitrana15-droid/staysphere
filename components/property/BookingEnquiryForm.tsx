"use client";

import { useState } from "react";
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
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  guests: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BookingEnquiryFormProps {
  propertyTitle: string;
  propertySlug: string;
}

export function BookingEnquiryForm({ propertyTitle, propertySlug }: BookingEnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          property_id: propertySlug,
          source: "property",
          ref_agent_code: getReferralCode(),
        }),
      });
      setSubmitted(true);
    } catch {
      // fallback - still show success
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-8 text-center">
        <CheckCircle className="w-10 h-10 text-gold-500 mx-auto mb-4" />
        <h3 className="font-serif text-xl font-light text-charcoal dark:text-ivory mb-2">
          Enquiry Received
        </h3>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60">
          Our luxury travel specialist will be in touch within 2 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-8">
      <div className="mb-6">
        <p className="label-text mb-2">Get In Touch</p>
        <h3 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">
          Enquire About This Property
        </h3>
        <div className="w-10 h-px bg-gold-500 mt-4" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 dark:text-ivory/40 block mb-1.5">
              Check-in
            </label>
            <input
              {...register("check_in")}
              type="date"
              className="input-luxury"
            />
          </div>
          <div>
            <label className="text-[9px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 dark:text-ivory/40 block mb-1.5">
              Check-out
            </label>
            <input
              {...register("check_out")}
              type="date"
              className="input-luxury"
            />
          </div>
        </div>

        <div>
          <select {...register("guests")} className="input-luxury">
            <option value="">Number of Guests</option>
            {[2, 4, 6, 8, 10, 12, 15].map((n) => (
              <option key={n} value={n}>
                {n} guests
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            {...register("message")}
            placeholder="Any special requirements or questions?"
            rows={3}
            className="input-luxury resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Send Enquiry"
          )}
        </button>

        <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 text-center">
          Our specialist responds within 2 hours
        </p>
      </form>
    </div>
  );
}
