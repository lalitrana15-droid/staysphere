import { NextRequest, NextResponse } from "next/server";
import { razorpayConfig, verifySignature, fetchOrder } from "@/lib/razorpay";
import { recordBooking } from "@/lib/booking-notify";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = await req.json();
    const cfg = razorpayConfig();
    if (!cfg || !o || !p || !s || !verifySignature(cfg.keySecret, o, p, s))
      return NextResponse.json({ success: false }, { status: 400 });

    // Details come from the server-created order notes, not from the browser
    const order = await fetchOrder(cfg, o);
    const n = order.notes ?? {};
    await recordBooking({
      name: n.name, email: n.email, phone: n.phone, property: n.property,
      check_in: n.check_in, check_out: n.check_out, guests: n.guests,
      agent_code: n.agent_code || null, source: "booking_paid",
      message: `PAID in full ₹${(order.amount / 100).toLocaleString("en-IN")} (${n.nights} nights). Razorpay payment ${p}, order ${o}.`,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("booking/verify error:", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
