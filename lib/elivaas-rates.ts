/**
 * Fetches per-night prices from Elivaas Distribution API for given dates.
 * Called server-side only — API key never exposed to browser.
 */

const BASE = process.env.ELIVAAS_BASE_URL || "https://sandbox.elivaas.com";
const PAGE_SIZE = 100;
const PLACEHOLDER_PRICE = 79152;

// All Elivaas state slugs
const ALL_STATE_SLUGS = [
  "statedelhi",
  "stategoa",
  "stateharyana",
  "statehimachal-pradesh",
  "statekarnataka",
  "statekerala",
  "statemaharashtra",
  "staterajasthan",
  "statetamil-nadu",
  "stateuttarakhand",
];

// Map property state names → Elivaas API city param
const STATE_TO_SLUG: Record<string, string> = {
  Goa: "stategoa",
  Kerala: "statekerala",
  Maharashtra: "statemaharashtra",
  Rajasthan: "staterajasthan",
  "Himachal Pradesh": "statehimachal-pradesh",
  Uttarakhand: "stateuttarakhand",
  Karnataka: "statekarnataka",
  "Tamil Nadu": "statetamil-nadu",
  Delhi: "statedelhi",
  Haryana: "stateharyana",
  Punjab: "stateharyana",
};

function perNightPrice(item: Record<string, unknown>): number | null {
  const quotes = (item.quotes as Array<Record<string, unknown>>) || [];
  for (const q of quotes) {
    const ppn = q.netPerNightAmountAfterTax as number;
    if (ppn && ppn > 0) return Math.round(ppn);
  }
  const priceAmt = item.priceAmount as number;
  if (priceAmt && priceAmt > 0) {
    const checkin = item._checkin as string;
    const checkout = item._checkout as string;
    if (checkin && checkout) {
      const nights =
        (new Date(checkout).getTime() - new Date(checkin).getTime()) /
        86400000;
      if (nights > 0) return Math.round(priceAmt / nights);
    }
  }
  return null;
}

async function fetchStateRates(
  stateSlug: string,
  checkin: string,
  checkout: string,
  apiKey: string,
  channelId: string
): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const url = `${BASE}/v1/properties/rates?checkinDate=${checkin}&checkoutDate=${checkout}&adults=2&city=${stateSlug}&page=${page}&pageSize=${PAGE_SIZE}`;
    const res = await fetch(url, {
      headers: { "Api-Key": apiKey, "Channel-Id": channelId },
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) break;
    const data = await res.json();
    totalPages = data.pagesCount ?? 1;
    for (const item of data.list ?? []) {
      const id = item.id as string;
      if (!id) continue;
      // tag dates for fallback calc
      item._checkin = checkin;
      item._checkout = checkout;
      const ppn = perNightPrice(item);
      // 79152 is a sandbox placeholder shared by most properties — treat as "Price on Request"
      if (ppn && ppn !== PLACEHOLDER_PRICE) prices[id] = ppn;
    }
    page++;
  }
  return prices;
}

/**
 * Returns { [elivaasPropertyId]: perNightPrice } for the given dates.
 * Pass `states` to limit which states are fetched (uses all states if empty).
 */
export async function fetchLivePrices(
  checkin: string,
  checkout: string,
  states?: string[]
): Promise<Record<string, number>> {
  const apiKey = process.env.ELIVAAS_API_KEY;
  const channelId = process.env.ELIVAAS_CHANNEL_ID;
  if (!apiKey || !channelId) return {};

  const slugs =
    states && states.length > 0
      ? states.map((s) => STATE_TO_SLUG[s]).filter(Boolean)
      : ALL_STATE_SLUGS;

  const results = await Promise.allSettled(
    slugs.map((slug) =>
      fetchStateRates(slug, checkin, checkout, apiKey, channelId)
    )
  );

  const merged: Record<string, number> = {};
  for (const r of results) {
    if (r.status === "fulfilled") Object.assign(merged, r.value);
  }
  return merged;
}

/** Convenience: get unique state names from a list of properties */
export function uniqueStates(
  properties: Array<{ state?: string }>
): string[] {
  return [...new Set(properties.map((p) => p.state ?? "").filter(Boolean))];
}

export type ElivaasBookingResult = { ok: boolean; sandbox: boolean; detail: string };

/**
 * Creates the booking on the supplier side after a verified payment. Server-side only.
 * Never throws — the caller must still confirm the guest and alert the team on failure.
 */
export async function createElivaasBooking(p: {
  propertyId: string;
  checkin: string;
  checkout: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
}): Promise<ElivaasBookingResult> {
  const sandbox = BASE.includes("sandbox");
  const apiKey = process.env.ELIVAAS_API_KEY;
  const channelId = process.env.ELIVAAS_CHANNEL_ID;
  if (!apiKey || !channelId) return { ok: false, sandbox, detail: "API key not configured" };
  const headers = { "Api-Key": apiKey, "Channel-Id": channelId };
  try {
    const guests = Math.max(1, p.guests || 1);
    const rateUrl = `${BASE}/v1/properties/rates?checkinDate=${p.checkin}&checkoutDate=${p.checkout}&adults=${guests}&propertyId=${encodeURIComponent(p.propertyId)}&page=0&pageSize=5`;
    const rr = await fetch(rateUrl, { headers, cache: "no-store" });
    if (!rr.ok) return { ok: false, sandbox, detail: `rate lookup failed (${rr.status})` };
    const item = ((await rr.json()).list ?? []).find((i: { id?: string }) => i.id === p.propertyId);
    if (!item || item.soldOut) return { ok: false, sandbox, detail: "not available for these dates" };
    const quote = (item.quotes ?? []).find(
      (q: { netPerNightAmountAfterTax?: number }) => (q.netPerNightAmountAfterTax ?? 0) > 0
    );
    if (!quote?.ratePlanId) return { ok: false, sandbox, detail: "no rate plan for these dates" };

    const maxAdults = Number(item.maxAdults) || guests;
    const adults = Math.min(guests, maxAdults);
    const parts = p.name.trim().split(/\s+/);
    const res = await fetch(`${BASE}/v1/bookings`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        guest: {
          firstName: parts[0],
          lastName: parts.slice(1).join(" ") || "-",
          email: p.email,
          phone: p.phone.replace(/\D/g, "").slice(-10),
        },
        propertyId: p.propertyId,
        ratePlanId: quote.ratePlanId,
        checkinDate: p.checkin,
        checkoutDate: p.checkout,
        adults,
        children: guests - adults,
        nights: [],
      }),
      cache: "no-store",
    });
    if (res.ok) return { ok: true, sandbox, detail: `booking created (HTTP ${res.status})` };
    const text = (await res.text()).slice(0, 200);
    return { ok: false, sandbox, detail: `HTTP ${res.status} ${text}` };
  } catch (e) {
    return { ok: false, sandbox, detail: `error: ${e instanceof Error ? e.message : "unknown"}` };
  }
}
