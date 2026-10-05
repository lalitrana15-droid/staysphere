import { NextRequest, NextResponse } from "next/server";

function generateReferralCode(name: string, agency: string): string {
  const nameSlug = name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6);
  const agencySlug = agency.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `SC-${nameSlug}${agencySlug}-${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const referral_code = generateReferralCode(body.name || "AGENT", body.agency_name || "AGT");

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url"
    ) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      const { error } = await supabase.from("agent_leads").insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          agency_name: body.agency_name,
          website: body.website || null,
          years_experience: body.years_experience || null,
          message: body.message || "",
          status: "pending",
          referral_code,
          commission_rate: 10,
        },
      ]);

      if (error) console.error("Supabase error:", error);
    }

    return NextResponse.json({ success: true, referral_code }, { status: 200 });
  } catch (error) {
    console.error("Agent lead submission error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
