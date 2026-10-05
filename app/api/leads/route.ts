import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try Supabase if configured
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit" }, { status: 500 });
  }
}
