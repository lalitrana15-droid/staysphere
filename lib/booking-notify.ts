/** Saves a booking lead in Supabase and emails the team. Server-side only. */
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
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
      const rows = [
        ["Property", d.property], ["Check-in", d.check_in], ["Check-out", d.check_out],
        ["Guests", d.guests], ["Name", d.name], ["Phone", d.phone], ["Email", d.email],
        ["Agent", d.agent_code], ["Details", d.message],
      ].filter(([, v]) => v).map(([k, v]) => `<p style="margin:4px 0"><b>${k}:</b> ${esc(String(v))}</p>`);
      await resend.emails.send({
        from: "StaysVacation <noreply@staysvacation.com>",
        to: process.env.ENQUIRY_EMAIL || "enquiries@staysvacation.com",
        subject: `${d.source === "booking_paid" ? "PAID Booking" : "Booking Request"} — ${d.property}${d.agent_code ? ` [${d.agent_code}]` : ""}`,
        html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#222">${rows.join("")}</div>`,
      });
    } catch (e) { console.error("Resend error:", e); }
  }
}
