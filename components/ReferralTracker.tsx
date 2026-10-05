"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      try {
        localStorage.setItem("sc_ref", ref);
        localStorage.setItem("sc_ref_ts", Date.now().toString());
      } catch {}
    }
  }, [searchParams]);

  return null;
}

export function getReferralCode(): string | null {
  try {
    const ref = localStorage.getItem("sc_ref");
    const ts = localStorage.getItem("sc_ref_ts");
    if (!ref || !ts) return null;
    // Referral attribution valid for 30 days
    if (Date.now() - parseInt(ts) > 30 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem("sc_ref");
      localStorage.removeItem("sc_ref_ts");
      return null;
    }
    return ref;
  } catch {
    return null;
  }
}
