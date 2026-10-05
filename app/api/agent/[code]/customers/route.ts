import { NextRequest, NextResponse } from "next/server";

async function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
  ) return null;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const supabase = await getSupabase();
  if (!supabase) return NextResponse.json([]);
  const { data } = await supabase
    .from("agent_customers")
    .select("*")
    .eq("agent_code", code)
    .order("created_at", { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await req.json();
  const supabase = await getSupabase();
  if (!supabase) return NextResponse.json({ success: true, id: Date.now().toString() });
  const { data, error } = await supabase
    .from("agent_customers")
    .insert([{
      agent_code: code,
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      requirements: body.requirements || null,
      notes: body.notes || null,
      status: body.status || "prospect",
    }])
    .select()
    .single();
  if (error) return NextResponse.json({ success: false }, { status: 500 });
  return NextResponse.json({ success: true, customer: data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await req.json();
  const supabase = await getSupabase();
  if (!supabase) return NextResponse.json({ success: true });
  const { error } = await supabase
    .from("agent_customers")
    .update({ status: body.status, notes: body.notes })
    .eq("id", body.id)
    .eq("agent_code", code);
  if (error) return NextResponse.json({ success: false }, { status: 500 });
  return NextResponse.json({ success: true });
}
