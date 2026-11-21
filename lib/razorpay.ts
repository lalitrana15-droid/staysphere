/**
 * Razorpay helpers — SERVER-SIDE ONLY. Secret never reaches the browser.
 * Env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET (full amount is charged)
 */
import crypto from "crypto";

export function razorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

function auth(cfg: { keyId: string; keySecret: string }) {
  return "Basic " + Buffer.from(`${cfg.keyId}:${cfg.keySecret}`).toString("base64");
}

export async function createOrder(
  cfg: NonNullable<ReturnType<typeof razorpayConfig>>,
  amountPaise: number,
  receipt: string,
  notes: Record<string, string>
) {
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: auth(cfg), "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
  });
  if (!res.ok) throw new Error(`Razorpay order failed: ${res.status}`);
  return (await res.json()) as { id: string; amount: number; notes: Record<string, string> };
}

export async function fetchOrder(
  cfg: NonNullable<ReturnType<typeof razorpayConfig>>,
  orderId: string
) {
  const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: auth(cfg) },
  });
  if (!res.ok) throw new Error(`Razorpay fetch order failed: ${res.status}`);
  return (await res.json()) as { id: string; amount: number; amount_paid: number; notes: Record<string, string> };
}

export function verifySignature(
  keySecret: string,
  orderId: string,
  paymentId: string,
  signature: string
) {
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
