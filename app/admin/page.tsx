import { createClient } from "@/lib/supabase/server";
import { AgentTable } from "./agents/AgentTable";

async function getData() {
  try {
    const supabase = await createClient();

    const [{ data: agents }, { data: leads }, { data: kyc }] = await Promise.all([
      supabase.from("agent_leads").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("guest_kyc").select("*").order("created_at", { ascending: false }),
    ]);

    return {
      agents: agents || [],
      leads: leads || [],
      kyc: kyc || [],
    };
  } catch {
    return { agents: [], leads: [], kyc: [] };
  }
}

export default async function AdminDashboard() {
  const { agents, leads, kyc } = await getData();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
          Agent Management
        </h1>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mt-1">
          {agents.length} registered agents · approve, reject, and view their activity
        </p>
      </div>

      <AgentTable agents={agents} allLeads={leads} allKyc={kyc} />
    </div>
  );
}
