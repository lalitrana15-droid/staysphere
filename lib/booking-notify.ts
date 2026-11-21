import { sendMail, escapeHtml, MAIL_FROM_ADDRESS } from "@/lib/mailer";

/** Saves a booking lead in Supabase, emails the team and confirms to the guest. Server-side only. */
export async function recordBooking(d: {
  name: string; email: string; phone: string; property: string;
  check_in?: string; check_out?: string; guests?: string;
  agent_code?: string | null; source: string; message: string;
}) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url") {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase.from("leads").insert([{
        name: d.name, email: d.email, phone: d.phone, message: d.message,
        property_id: d.property, check_in: d.check_in || null, check_out: d.check_out || null,
        guests: d.guests ? parseInt(d.guests) : null, source: d.source,
        ref_agent_code: d.agent_code || null,
      }]);
      if (error) console.error("Supabase booking error:", error);
    } catch (e) { console.error("Supabase booking error:", e); }
  }
  const paid = d.source === "booking_paid";
  const rows = [
    ["Property", d.property], ["Check-in", d.check_in], ["Check-out", d.check_out],
    ["Guests", d.guests], ["Name", d.name], ["Phone", d.phone], ["Email", d.email],
    ["Agent", d.agent_code], ["Details", d.message],
  ].filter(([, v]) => v).map(([k, v]) => `<p style="margin:4px 0"><b>${k}:</b> ${escapeHtml(String(v))}</p>`);

  // 1. Alert to our team
  await sendMail({
    to: process.env.ENQUIRY_EMAIL || MAIL_FROM_ADDRESS,
    replyTo: d.email,
    subject: `${paid ? "PAID Booking" : "Booking Request"} — ${d.property}${d.agent_code ? ` [${d.agent_code}]` : ""}`,
    html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#222">${rows.join("")}</div>`,
  });

  // 2. Confirmation to the guest, from support@staysvacation.com
  if (d.email) {
    const dates = d.check_in && d.check_out ? `${escapeHtml(d.check_in)} → ${escapeHtml(d.check_out)}` : "";
    const summary = [
      ["Villa", d.property], ["Dates", dates], ["Guests", d.guests],
    ].filter(([, v]) => v).map(([k, v]) =>
      `<tr><td style="padding:6px 16px 6px 0;color:#777">${k}</td><td style="padding:6px 0"><b>${k === "Dates" ? v : escapeHtml(String(v))}</b></td></tr>`).join("");
    await sendMail({
      to: d.email,
      replyTo: MAIL_FROM_ADDRESS,
      subject: paid ? `Booking confirmed — ${d.property}` : `We received your request — ${d.property}`,
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;color:#222;line-height:1.7">
        <h2 style="font-weight:normal;margin-bottom:4px">${paid ? "Your booking is confirmed" : "Thank you for your request"}</h2>
        <p>Dear ${escapeHtml(d.name)},</p>
        <p>${paid
          ? "Thank you for booking with StaysVacation. We have received your payment and our team will share your check-in details shortly."
          : "Thank you for choosing StaysVacation. Our team will get back to you shortly with availability and the next steps."}</p>
        <table style="font-family:sans-serif;font-size:14px;margin:16px 0">${summary}</table>
        ${paid && d.message ? `<p style="font-family:sans-serif;font-size:13px;color:#555">${escapeHtml(d.message)}</p>` : ""}
        <p>Need help? Just reply to this email or write to ${MAIL_FROM_ADDRESS}.</p>
        <p style="margin-top:24px">Warm regards,<br/>Team StaysVacation<br/><a href="https://staysvacation.com" style="color:#b8860b">staysvacation.com</a></p>
      </div>`,
    });
  }
}
