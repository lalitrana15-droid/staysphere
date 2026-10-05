"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  property_name: z.string().min(2, "Please enter your property name"),
  property_location: z.string().min(2, "Please enter your property location"),
  bedrooms: z.string().optional(),
  message: z.string().min(10, "Please tell us about your property"),
});

type FormData = z.infer<typeof schema>;

export function OwnerInquiryForm() {
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
      await fetch("/api/owner-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
          Our property partnerships team will review your submission and reach out within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-8">
      <div className="mb-8">
        <p className="label-text mb-3">Property Enquiry</p>
        <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">
          Tell Us About Your Property
        </h2>
        <div className="w-10 h-px bg-gold-500 mt-4" />
        <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mt-4">
          No pricing information required at this stage. We simply want to learn about your property.
        </p>
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
            {...register("property_name")}
            placeholder="Property Name *"
            className={cn("input-luxury", errors.property_name && "border-red-400")}
          />
          {errors.property_name && (
            <p className="text-xs text-red-400 mt-1">{errors.property_name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("property_location")}
            placeholder="Property Location (City, State) *"
            className={cn("input-luxury", errors.property_location && "border-red-400")}
          />
          {errors.property_location && (
            <p className="text-xs text-red-400 mt-1">{errors.property_location.message}</p>
          )}
        </div>

        <div>
          <select {...register("bedrooms")} className="input-luxury">
            <option value="">Number of Bedrooms</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "bedroom" : "bedrooms"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            {...register("message")}
            placeholder="Tell us about your property — its unique features, facilities, and what makes it extraordinary *"
            rows={5}
            className={cn("input-luxury resize-none", errors.message && "border-red-400")}
          />
          {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
