import { NextRequest, NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
  ) {
    return NextResponse.json({ agent: null }, { headers: CORS });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: agent } = await supabase
    .from("agent_leads")
    .select("id, name, agency_name, status, referral_code")
    .eq("referral_code", code)
    .single();

  if (!agent) {
    return NextResponse.json({ agent: null }, { status: 404, headers: CORS });
  }

  return NextResponse.json({ agent }, { headers: CORS });
}
