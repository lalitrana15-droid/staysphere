"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const REF_COOKIE = "sv_ref";
const REF_DAYS = 30;
const REF_REGEX = /^[A-Za-z0-9_-]{1,32}$/;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && REF_REGEX.test(ref)) {
      setCookie(REF_COOKIE, ref, REF_DAYS);
    }
  }, [searchParams]);

  return null;
}

export function getReferralCode(): string | null {
  return getCookieValue(REF_COOKIE);
}
