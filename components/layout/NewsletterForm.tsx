"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter subscriber",
          email,
          phone: "N/A",
          message: "Newsletter signup from website footer",
          source: "newsletter",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2 text-sm font-sans text-gold-300">
        <Check className="w-4 h-4" /> Thank you — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex items-stretch rounded-xl border border-white/20 bg-white/5 overflow-hidden focus-within:border-gold-300/70 transition-colors">
        <span className="flex items-center pl-4 text-ivory/60">
          <Mail className="w-5 h-5" strokeWidth={1.5} />
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="Enter your email"
          aria-label="Email address"
          className="flex-1 min-w-0 bg-transparent px-3 py-3.5 text-sm font-sans text-ivory placeholder:text-ivory/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Subscribe"
          className="flex-none w-14 flex items-center justify-center bg-gold-300 hover:bg-gold-200 text-charcoal transition-colors disabled:opacity-70"
        >
          {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs font-sans text-red-300">Please enter a valid email and try again.</p>
      )}
    </form>
  );
}
