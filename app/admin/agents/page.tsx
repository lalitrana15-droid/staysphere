import { createClient } from "@/lib/supabase/server";
import { CopyReferralButton } from "./CopyReferralButton";

async function getAgentLeads() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
    ) {
      return [];
    }
    const supabase = await createClient();
    const { data } = await supabase
      .from("agent_leads")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

async function getReferralStats() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
    ) {
      return {};
    }
    const supabase = await createClient();
    const { data } = await supabase
      .from("leads")
      .select("ref_agent_code")
      .not("ref_agent_code", "is", null);
    const stats: Record<string, number> = {};
    (data || []).forEach((row: { ref_agent_code: string }) => {
      if (row.ref_agent_code) stats[row.ref_agent_code] = (stats[row.ref_agent_code] || 0) + 1;
    });
    return stats;
  } catch {
    return {};
  }
}

export default async function AdminAgentsPage() {
  const [agents, referralStats] = await Promise.all([getAgentLeads(), getReferralStats()]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
          Agent Applications
        </h1>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mt-1">
          Travel agent and B2B partnership enquiries · 10% commission per booking
        </p>
      </div>

      {agents.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-12 text-center">
          <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50 mb-3">
            No agent applications yet — or Supabase is not configured.
          </p>
          <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">
            Configure your Supabase credentials in <code>.env.local</code> to see applications here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  {["Name", "Agency", "Email", "Referral Code", "Leads", "Commission", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-4 text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/50 dark:text-ivory/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.map((agent: Record<string, string>) => {
                  const leadCount = referralStats[agent.referral_code] || 0;
                  return (
                    <tr
                      key={agent.id}
                      className="border-b border-stone-100 dark:border-stone-900 hover:bg-stone-50 dark:hover:bg-stone-900/30"
                    >
                      <td className="px-5 py-4 text-sm font-sans text-charcoal dark:text-ivory">
                        {agent.name}
                      </td>
                      <td className="px-5 py-4 text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                        {agent.agency_name}
                      </td>
                      <td className="px-5 py-4 text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                        {agent.email}
                      </td>
                      <td className="px-5 py-4">
                        {agent.referral_code ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-medium text-gold-600 dark:text-gold-400 bg-gold-500/8 px-2 py-1">
                              {agent.referral_code}
                            </span>
                            <CopyReferralButton code={agent.referral_code} />
                          </div>
                        ) : (
                          <span className="text-charcoal/30 dark:text-ivory/30 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-sans font-medium text-charcoal dark:text-ivory">
                        {leadCount > 0 ? leadCount : <span className="text-charcoal/30 dark:text-ivory/30">0</span>}
                      </td>
                      <td className="px-5 py-4 text-sm font-sans text-emerald-600 dark:text-emerald-400 font-medium">
                        {leadCount > 0 ? `10% × ${leadCount}` : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-sans font-medium tracking-wide uppercase ${
                            agent.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : agent.status === "rejected"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {agent.status || "pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                        {agent.created_at
                          ? new Date(agent.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
