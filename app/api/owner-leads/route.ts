import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url"
    ) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      const { error } = await supabase.from("owner_leads").insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          property_name: body.property_name,
          property_location: body.property_location,
          bedrooms: body.bedrooms ? parseInt(body.bedrooms) : null,
          message: body.message,
          status: "pending",
        },
      ]);

      if (error) console.error("Supabase error:", error);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Owner lead submission error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
