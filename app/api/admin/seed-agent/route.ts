import { NextResponse } from "next/server";

// One-time seed endpoint — remove after use
export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase")) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // Check if already exists
    const { data: existing } = await supabase
      .from("agent_leads")
      .select("id, name, referral_code")
      .eq("referral_code", "NEHA26SEP")
      .single();

    if (existing) {
      return NextResponse.json({ message: "Already exists", agent: existing });
    }

    // Check if referral_code column exists
    const { error: insertError, data } = await supabase
      .from("agent_leads")
      .insert({
        name: "Neha",
        email: "neha@staysvacation.com",
        phone: "9999999999",
        agency_name: "StaysVacation Demo",
        referral_code: "NEHA26SEP",
        status: "approved",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, agent: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
