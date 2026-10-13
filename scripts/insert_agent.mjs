import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Available env keys:", Object.keys(process.env).filter(k => k.includes("SUPA")));
  process.exit(1);
}

const supabase = createClient(url, key);

// Check existing row structure
const { data: sample } = await supabase.from("agent_leads").select("*").limit(1);
console.log("Existing columns:", sample ? Object.keys(sample[0] || {}) : "(empty table)");

// Insert test agent
const { data, error } = await supabase.from("agent_leads").insert({
  name: "Neha",
  email: "neha@staysvacation.com",
  phone: "9999999999",
  agency_name: "StaysVacation Test",
  referral_code: "NEHA26SEP",
  status: "approved",
}).select().single();

if (error) {
  console.error("Insert error:", error.message);
  // If column missing, try without referral_code
  if (error.message.includes("referral_code")) {
    console.log("referral_code column missing — need to add it first");
  }
} else {
  console.log("Success! Agent inserted:", data?.id, data?.name, data?.referral_code);
}
