import { NextRequest, NextResponse } from "next/server";
import { sendMail, MAIL_FROM_ADDRESS } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Save to Supabase
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url"
    ) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      const { error } = await supabase.from("leads").insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          message: body.message || "",
          property_id: body.property_id || null,
          destination: body.destination || null,
          check_in: body.check_in || null,
          check_out: body.check_out || null,
          guests: body.guests ? parseInt(body.guests) : null,
          source: body.source || "contact",
          ref_agent_code: body.ref_agent_code || null,
        },
      ]);

      if (error) console.error("Supabase error:", error);
    }

    // Send email notification to the team
    {
      try {

        const lines: string[] = [];
        if (body.property_id) lines.push(`<b>Property:</b> ${body.property_id}`);
        if (body.check_in)    lines.push(`<b>Check-in:</b> ${body.check_in}`);
        if (body.check_out)   lines.push(`<b>Check-out:</b> ${body.check_out}`);
        if (body.guests)      lines.push(`<b>Guests:</b> ${body.guests}`);
        lines.push(`<b>Name:</b> ${body.name}`);
        lines.push(`<b>Phone:</b> ${body.phone}`);
        if (body.email)       lines.push(`<b>Email:</b> ${body.email}`);
        if (body.destination) lines.push(`<b>Destination:</b> ${body.destination}`);
        if (body.message)     lines.push(`<b>Message:</b> ${body.message}`);
        lines.push(`<b>Source:</b> ${body.source || "contact"}`);
        if (body.ref_agent_code) lines.push(`<b>Agent:</b> ${body.ref_agent_code}`);

        await sendMail({
          to: process.env.ENQUIRY_EMAIL || MAIL_FROM_ADDRESS,
          replyTo: body.email || undefined,
          subject: `New Enquiry${body.property_id ? ` — ${body.property_id}` : ""}${body.ref_agent_code ? ` [${body.ref_agent_code}]` : ""}`,
          html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.7;color:#222">
            <h2 style="margin-bottom:20px">New Enquiry — StaysVacation</h2>
            ${lines.map(l => `<p style="margin:4px 0">${l}</p>`).join("")}
          </div>`,
        });
      } catch (emailErr) {
        console.error("Mail error:", emailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit" }, { status: 500 });
  }
}
