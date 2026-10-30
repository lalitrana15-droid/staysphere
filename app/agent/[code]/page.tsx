import { redirect } from "next/navigation";
import { AgentDashboard } from "./AgentDashboard";

interface Props {
  params: Promise<{ code: string }>;
}

// Admin/test agent — always works, no Supabase needed
const ADMIN_AGENTS: Record<string, { name: string; agency_name: string; status: string }> = {
  NEHA26SEP: { name: "Neha Sharma", agency_name: "StaysVacation Admin", status: "approved" },
};

type AgentResult =
  | { status: "ok"; agent: Record<string, string>; leads: Record<string, string>[]; kycRecords: Record<string, string>[] }
  | { status: "not_found" }
  | { status: "service_error" };

async function getAgentData(code: string): Promise<AgentResult> {
  // Admin/test codes — always work, no Supabase needed
  if (ADMIN_AGENTS[code]) {
    return {
      status: "ok",
      agent: { ...ADMIN_AGENTS[code], referral_code: code },
      leads: [],
      kycRecords: [],
    };
  }

  // Supabase not configured on this server
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
  ) {
    return { status: "service_error" };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: agent, error: agentError } = await supabase
      .from("agent_leads")
      .select("*")
      .eq("referral_code", code)
      .single();

    // Supabase connection error (not "row not found")
    if (agentError && agentError.code !== "PGRST116") {
      return { status: "service_error" };
    }

    if (!agent) return { status: "not_found" };

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

    return { status: "ok", agent, leads: leads || [], kycRecords: kycRecords || [] };
  } catch {
    // Network / unexpected error — don't blame the agent's code
    return { status: "service_error" };
  }
}

export default async function AgentPortalPage({ params }: Props) {
  const { code } = await params;
  const result = await getAgentData(code);

  if (result.status === "not_found") redirect("/agent-program?error=invalid_code");

  if (result.status === "service_error") {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-amber-600 mb-4">Server Issue</p>
          <h1 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-3">
            Dashboard temporarily unavailable
          </h1>
          <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mb-6 leading-relaxed">
            Aapka agent code <strong className="font-mono text-charcoal dark:text-ivory">{code}</strong> sahi hai —
            server mein temporary issue hai. Kuch minutes mein dobara try karo.
          </p>
          <a
            href={`/agent/${code}`}
            className="inline-block px-6 py-2.5 bg-gold-500 text-white text-xs font-sans font-medium uppercase tracking-wide hover:bg-gold-600 transition-colors"
          >
            Retry
          </a>
          <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40 mt-4">
            Problem continue ho toh support@staysvacation.com pe contact karo.
          </p>
        </div>
      </div>
    );
  }

  const { agent, leads, kycRecords } = result;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://staysvacation.com";
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
