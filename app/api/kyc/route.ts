import { NextRequest, NextResponse } from "next/server";

async function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
  ) return null;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await getSupabase();

    const record = {
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      property_name: body.property_name || null,
      checkin_date: body.checkin_date || null,
      checkout_date: body.checkout_date || null,
      id_type: body.id_type,
      id_number: body.id_number,
      guest_count: body.guest_count ? parseInt(body.guest_count) : 1,
      id_front: body.id_front || null,
      id_back: body.id_back || null,
      ref_agent_code: body.ref_agent_code || null,
      customer_id: body.customer_id || null,
      status: "pending",
    };

    if (supabase) {
      const { error } = await supabase.from("guest_kyc").insert([record]);
      if (error) console.error("Supabase KYC error:", error);
    }

    const ref = `SC-KYC-${Date.now().toString(36).toUpperCase()}`;
    return NextResponse.json({ success: true, ref });
  } catch (err) {
    console.error("KYC submission error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentCode = searchParams.get("agent");
    const supabase = await getSupabase();
    if (!supabase) return NextResponse.json([]);
    let query = supabase.from("guest_kyc").select("*").order("created_at", { ascending: false });
    if (agentCode) query = query.eq("ref_agent_code", agentCode);
    const { data } = await query;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await getSupabase();
    if (!supabase) return NextResponse.json({ success: true });
    const { error } = await supabase
      .from("guest_kyc")
      .update({ status: body.status })
      .eq("id", body.id);
    if (error) return NextResponse.json({ success: false }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
