import { AgentDashboard } from "./AgentDashboard";

interface Props {
  params: Promise<{ code: string }>;
}

async function getAgentData(code: string) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
    ) return { agent: null, leads: [], kycRecords: [] };

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: agent } = await supabase
      .from("agent_leads")
      .select("*")
      .eq("referral_code", code)
      .single();

    const { data: leads } = await supabase
      .from("leads")
      .select("*")
      .eq("ref_agent_code", code)
      .order("created_at", { ascending: false });

    const { data: kycRecords } = await supabase
      .from("guest_kyc")
      .select("*")
      .eq("ref_agent_code", code)
      .order("created_at", { ascending: false });

    return { agent: agent || null, leads: leads || [], kycRecords: kycRecords || [] };
  } catch {
    return { agent: null, leads: [], kycRecords: [] };
  }
}

export default async function AgentPortalPage({ params }: Props) {
  const { code } = await params;
  const { agent, leads, kycRecords } = await getAgentData(code);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://staycove.in";
  const referralLink = `${baseUrl}/?ref=${code}`;
  const kycBaseUrl = `${baseUrl}/kyc?ref=${code}`;

  return (
    <AgentDashboard
      code={code}
      agent={agent}
      leads={leads}
      referralLink={referralLink}
      kycBaseUrl={kycBaseUrl}
      kycRecords={kycRecords}
    />
  );
}
