"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
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
  agent_code: z
    .string()
    .regex(/^[A-Za-z0-9_-]{0,32}$/, "Letters, numbers, - and _ only")
    .optional(),
});

type FormData = z.infer<typeof schema>;

interface BookingEnquiryFormProps {
  propertyTitle: string;
  propertySlug: string;
  enableBooking?: boolean;
  enquiryHeading?: string;
}

interface Quote {
  payable: boolean;
  perNight?: number;
  nights: number;
  total?: number;
}

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const sc = document.createElement("script");
    sc.src = "https://checkout.razorpay.com/v1/checkout.js";
    sc.onload = () => resolve(true);
    sc.onerror = () => resolve(false);
    document.body.appendChild(sc);
  });
}

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const fmtDate = (d?: string) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

const labelCls =
  "text-[9px] font-sans font-semibold tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1";
const cellInput =
  "w-full bg-transparent text-sm font-sans text-charcoal dark:text-ivory outline-none placeholder:text-charcoal/30 dark:placeholder:text-ivory/30";

export function BookingEnquiryForm({ propertyTitle, propertySlug, enableBooking = false, enquiryHeading = "Enquire About This Property" }: BookingEnquiryFormProps) {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [doneMsg, setDoneMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pending, setPending] = useState<FormData | null>(null);
  const [showAgent, setShowAgent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const checkIn = watch("check_in");
  const today = new Date().toISOString().slice(0, 10);
  const minCheckout = checkIn
    ? new Date(Date.parse(checkIn) + 86400000).toISOString().slice(0, 10)
    : today;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkin = params.get("checkin");
    const checkout = params.get("checkout");
    const guests = params.get("guests");

    const validCheckin =
      checkin && /^\d{4}-\d{2}-\d{2}$/.test(checkin) && checkin >= today ? checkin : null;
    const validCheckout =
      checkout && /^\d{4}-\d{2}-\d{2}$/.test(checkout) && validCheckin && checkout > validCheckin
        ? checkout
        : null;
    const validGuests = guests && /^\d+$/.test(guests) && parseInt(guests) > 0 ? guests : null;

    if (validCheckin) setValue("check_in", validCheckin);
    if (validCheckout) setValue("check_out", validCheckout);
    if (validGuests) setValue("guests", validGuests);

    const ref = getReferralCode();
    if (ref) {
      setValue("agent_code", ref);
      setShowAgent(true);
    }
  }, [setValue, today]);

  const agentOf = (d: FormData) => d.agent_code?.trim() || getReferralCode();

  const bookingPayload = (d: FormData, extra: Record<string, unknown> = {}) => ({
    property_slug: propertySlug,
    name: d.name,
    email: d.email,
    phone: d.phone,
    check_in: d.check_in,
    check_out: d.check_out,
    guests: d.guests,
    agent_code: agentOf(d),
    ...extra,
  });

  // Enquiry (no payment)
  const onEnquire = async (data: FormData) => {
    setError(null);
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          property_id: propertySlug,
          source: "property",
          ref_agent_code: agentOf(data),
        }),
      });
    } catch {
      // still show success
    } finally {
      setLoading(false);
      setDoneMsg(null);
      setStep("done");
    }
  };

  // Book Now step 1: get price summary
  const onBook = async (data: FormData) => {
    setError(null);
    if (!data.check_in || !data.check_out) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload(data, { quote: true })),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error || "Could not start booking.");
        return;
      }
      setQuote(j);
      setPending(data);
      setStep("confirm");
    } catch {
      setError("Something went wrong. Please try again or send an enquiry.");
    } finally {
      setLoading(false);
    }
  };

  // Book Now step 2: pay (or send booking request when price/gateway unavailable)
  const onConfirm = async () => {
    if (!pending) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload(pending)),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error || "Could not start booking.");
        return;
      }
      if (j.mode === "request") {
        setDoneMsg(
          "Booking request received. Our team will confirm availability and send you a secure payment link shortly."
        );
        setStep("done");
        return;
      }
      if (!(await loadRazorpay()) || !window.Razorpay) {
        setError("Payment gateway failed to load. Please try again.");
        return;
      }
      const rzp = new window.Razorpay({
        key: j.keyId,
        order_id: j.orderId,
        amount: j.amount,
        currency: "INR",
        name: "StaysVacation",
        description: `${j.description} — ${j.nights} night${j.nights > 1 ? "s" : ""}`,
        prefill: j.prefill,
        theme: { color: "#B8860B" },
        handler: async (r: Record<string, string>) => {
          const v = await fetch("/api/booking/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
          });
          setDoneMsg(
            v.ok
              ? "Payment received — your booking is confirmed. A confirmation will be sent shortly."
              : "Payment received. We are confirming your booking and will contact you shortly."
          );
          setStep("done");
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again or send an enquiry.");
    } finally {
      setLoading(false);
    }
  };

  const card = "bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6 sm:p-8";

  // ---------- Done ----------
  if (step === "done") {
    return (
      <div className={cn(card, "text-center")}>
        <CheckCircle className="w-10 h-10 text-gold-500 mx-auto mb-4" />
        <h3 className="font-serif text-xl font-light text-charcoal dark:text-ivory mb-2">
          {doneMsg ? "Thank You" : "Enquiry Received"}
        </h3>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60">
          {doneMsg ?? "Our luxury travel specialist will be in touch within 2 hours."}
        </p>
      </div>
    );
  }

  // ---------- Confirm & pay ----------
  if (step === "confirm" && quote && pending) {
    return (
      <div className={card}>
        <button
          type="button"
          onClick={() => { setStep("form"); setError(null); }}
          className="inline-flex items-center gap-1.5 text-xs font-sans text-charcoal/50 dark:text-ivory/50 hover:text-gold-600 mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Edit details
        </button>

        <p className="label-text mb-2">Review Booking</p>
        <h3 className="font-serif text-2xl font-light text-charcoal dark:text-ivory leading-snug">
          {propertyTitle}
        </h3>
        <div className="w-10 h-px bg-gold-500 my-4" />

        <dl className="text-sm font-sans divide-y divide-stone-200/70 dark:divide-stone-800/70">
          <div className="flex justify-between py-3">
            <dt className="text-charcoal/50 dark:text-ivory/50">Dates</dt>
            <dd className="text-charcoal dark:text-ivory text-right">
              {fmtDate(pending.check_in)} → {fmtDate(pending.check_out)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-charcoal/50 dark:text-ivory/50">Guests</dt>
            <dd className="text-charcoal dark:text-ivory">{pending.guests ? `${pending.guests} guests` : "—"}</dd>
          </div>
          {quote.perNight ? (
            <>
              <div className="flex justify-between py-3">
                <dt className="text-charcoal/50 dark:text-ivory/50">
                  {inr(quote.perNight)} × {quote.nights} night{quote.nights > 1 ? "s" : ""}
                </dt>
                <dd className="text-charcoal dark:text-ivory">{inr(quote.total!)}</dd>
              </div>
              <div className="flex justify-between py-4 font-medium">
                <dt className="text-charcoal dark:text-ivory">Total (INR)</dt>
                <dd className="text-charcoal dark:text-ivory text-lg">{inr(quote.total!)}</dd>
              </div>
            </>
          ) : (
            <div className="py-4 text-charcoal/70 dark:text-ivory/70">
              Price for these dates is on request. Our team will confirm the rate and availability.
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="mt-4 w-full inline-flex items-center justify-center px-6 py-3.5 text-xs font-sans font-medium tracking-[0.15em] uppercase bg-gold-500 text-white hover:bg-gold-600 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : quote.payable && quote.perNight ? (
            `Pay ${inr(quote.total!)}`
          ) : (
            "Request to Book"
          )}
        </button>
        {error && <p className="text-xs text-red-400 text-center mt-3">{error}</p>}
        <p className="flex items-center justify-center gap-1.5 text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 mt-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          {quote.payable && quote.perNight ? "Secure payment via Razorpay" : "You won't be charged yet"}
        </p>
      </div>
    );
  }

  // ---------- Main form ----------
  const fieldErr = (m?: string) => m && <p className="text-xs text-red-400 mt-1">{m}</p>;

  return (
    <div className={card}>
      <div className="mb-6">
        <p className="label-text mb-2">{enableBooking ? "Reserve Your Stay" : "Get In Touch"}</p>
        <h3 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">
          {enableBooking ? "Book This Property" : enquiryHeading}
        </h3>
        <div className="w-10 h-px bg-gold-500 mt-4" />
      </div>

      <form onSubmit={handleSubmit(onEnquire)} className="space-y-5" noValidate>
        {/* Dates + guests — one grouped box */}
        <div className="border border-stone-300 dark:border-stone-700 divide-y divide-stone-300 dark:divide-stone-700">
          <div className="grid grid-cols-2 divide-x divide-stone-300 dark:divide-stone-700">
            <label className="block px-3 py-2.5 cursor-pointer">
              <span className={labelCls}>Check-in</span>
              <input {...register("check_in")} type="date" min={today} className={cellInput} />
            </label>
            <label className="block px-3 py-2.5 cursor-pointer">
              <span className={labelCls}>Check-out</span>
              <input {...register("check_out")} type="date" min={minCheckout} className={cellInput} />
            </label>
          </div>
          <label className="block px-3 py-2.5 cursor-pointer">
            <span className={labelCls}>Guests</span>
            <select {...register("guests")} className={cn(cellInput, "cursor-pointer")}>
              <option value="">Select guests</option>
              {[2, 4, 6, 8, 10, 12, 15].map((n) => (
                <option key={n} value={n}>
                  {n} guests
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <p className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50">
            Your details
          </p>
          <div>
            <input
              {...register("name")}
              placeholder="Full name *"
              autoComplete="name"
              className={cn("input-luxury", errors.name && "border-red-400")}
            />
            {fieldErr(errors.name?.message)}
          </div>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email address *"
              autoComplete="email"
              className={cn("input-luxury", errors.email && "border-red-400")}
            />
            {fieldErr(errors.email?.message)}
          </div>
          <div>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Phone number *"
              autoComplete="tel"
              className={cn("input-luxury", errors.phone && "border-red-400")}
            />
            {fieldErr(errors.phone?.message)}
          </div>
          <textarea
            {...register("message")}
            placeholder="Special requests (optional)"
            rows={2}
            className="input-luxury resize-none"
          />

          {showAgent ? (
            <div>
              <input
                {...register("agent_code")}
                placeholder="Agent code"
                autoCapitalize="characters"
                className={cn("input-luxury", errors.agent_code && "border-red-400")}
              />
              {fieldErr(errors.agent_code?.message)}
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
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          {enableBooking ? (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit(onBook)}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 text-xs font-sans font-medium tracking-[0.15em] uppercase bg-gold-500 text-white hover:bg-gold-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book Now"}
              </button>
              <p className="text-[11px] font-sans text-charcoal/50 dark:text-ivory/50 text-center">
                You won&apos;t be charged yet
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-xs font-sans font-medium tracking-[0.15em] uppercase border border-charcoal/30 dark:border-ivory/30 text-charcoal dark:text-ivory hover:border-gold-500 hover:text-gold-600 transition-colors disabled:opacity-60"
              >
                Send Enquiry Instead
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Enquiry"}
            </button>
          )}
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 text-center">
            Our specialist responds within 2 hours
          </p>
        </div>
      </form>
    </div>
  );
}
