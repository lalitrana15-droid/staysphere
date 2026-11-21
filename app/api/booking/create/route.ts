import { NextRequest, NextResponse } from "next/server";
import { getPropertyBySlug } from "@/data/properties";
import { fetchLivePrices } from "@/lib/elivaas-rates";
import { razorpayConfig, createOrder } from "@/lib/razorpay";
import { recordBooking } from "@/lib/booking-notify";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const AGENT = /^[A-Za-z0-9_-]{1,32}$/;

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const property = getPropertyBySlug(String(b.property_slug ?? ""));
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    const name = String(b.name ?? "").trim();
    const email = String(b.email ?? "").trim();
    const phone = String(b.phone ?? "").trim();
    const checkin = String(b.check_in ?? "");
    const checkout = String(b.check_out ?? "");
    const agent = b.agent_code && AGENT.test(String(b.agent_code)) ? String(b.agent_code) : null;
    const guests = b.guests ? String(parseInt(b.guests) || "") : "";

    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 10)
      return NextResponse.json({ error: "Please fill name, email and phone" }, { status: 400 });
    if (!DATE.test(checkin) || !DATE.test(checkout) || checkout <= checkin)
      return NextResponse.json({ error: "Please select valid check-in and check-out dates" }, { status: 400 });

    const nights = Math.round((Date.parse(checkout) - Date.parse(checkin)) / 86400000);

    // Price is ALWAYS computed server-side — never trusted from the browser
    let perNight: number | null = null;
    if (property.state) {
      const prices = await fetchLivePrices(checkin, checkout, [property.state]);
      perNight = prices[property.id] ?? null;
    }

    const cfg = razorpayConfig();

    // Step 1 of Book Now: show the price summary, nothing is saved or charged
    if (b.quote) {
      return NextResponse.json(
        perNight
          ? { mode: "quote", payable: !!cfg, perNight, nights, total: perNight * nights }
          : { mode: "quote", payable: false, nights }
      );
    }

    const base = { name, email, phone, property: property.title, check_in: checkin, check_out: checkout, guests, agent_code: agent };

    // No verified price or Razorpay not configured → booking request, team follows up with payment link
    if (!perNight || !cfg) {
      await recordBooking({ ...base, source: "book_now", message: "Book Now request — team to share payment link." });
      return NextResponse.json({ mode: "request" });
    }

    const total = perNight * nights;
    const order = await createOrder(cfg, total * 100, `sv_${Date.now()}`, {
      property: property.title.slice(0, 200), property_slug: property.slug,
      check_in: checkin, check_out: checkout, guests, nights: String(nights),
      total: String(total), name, email, phone, agent_code: agent ?? "",
    });
    return NextResponse.json({
      mode: "pay", keyId: cfg.keyId, orderId: order.id, amount: order.amount,
      total, nights,
      prefill: { name, email, contact: phone }, description: property.title,
    });
  } catch (e) {
    console.error("booking/create error:", e);
    return NextResponse.json({ error: "Could not start booking" }, { status: 500 });
  }
}
