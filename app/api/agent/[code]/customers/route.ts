import { NextRequest, NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

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
  if (!supabase) return NextResponse.json([], { headers: CORS });
  const { data } = await supabase
    .from("agent_customers")
    .select("*")
    .eq("agent_code", code)
    .order("created_at", { ascending: false });
  return NextResponse.json(data || [], { headers: CORS });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await req.json();
  const supabase = await getSupabase();
  if (!supabase) return NextResponse.json({ success: true, id: Date.now().toString() }, { headers: CORS });
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
      labels: body.labels || [],
    }])
    .select()
    .single();
  if (error) return NextResponse.json({ success: false }, { status: 500, headers: CORS });
  return NextResponse.json({ success: true, customer: data }, { headers: CORS });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await req.json();
  const supabase = await getSupabase();
  if (!supabase) return NextResponse.json({ success: true }, { headers: CORS });
  const updateFields: Record<string, unknown> = {};
  if (body.status !== undefined) updateFields.status = body.status;
  if (body.notes !== undefined) updateFields.notes = body.notes;
  if (body.labels !== undefined) updateFields.labels = body.labels;
  const { error } = await supabase
    .from("agent_customers")
    .update(updateFields)
    .eq("id", body.id)
    .eq("agent_code", code);
  if (error) return NextResponse.json({ success: false }, { status: 500, headers: CORS });
  return NextResponse.json({ success: true }, { headers: CORS });
}
