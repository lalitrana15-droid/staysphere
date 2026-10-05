import { createClient } from "@/lib/supabase/server";

async function getLeads() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
    ) {
      return [];
    }
    const supabase = await createClient();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory">
          Leads
        </h1>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mt-1">
          All customer enquiries from the website
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-12 text-center">
          <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50 mb-3">
            No leads yet — or Supabase is not configured.
          </p>
          <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">
            Configure your Supabase credentials in <code>.env.local</code> to see leads here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  {["Name", "Email", "Phone", "Source", "Property", "Date", "Actions"].map((h) => (
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
                {leads.map((lead: Record<string, string>) => (
                  <tr
                    key={lead.id}
                    className="border-b border-stone-100 dark:border-stone-900 hover:bg-stone-50 dark:hover:bg-stone-900/30"
                  >
                    <td className="px-5 py-4 text-sm font-sans text-charcoal dark:text-ivory">
                      {lead.name}
                    </td>
                    <td className="px-5 py-4 text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                      {lead.email}
                    </td>
                    <td className="px-5 py-4 text-sm font-sans text-charcoal/70 dark:text-ivory/70">
                      {lead.phone}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-900 text-[9px] font-sans font-medium tracking-wide uppercase text-charcoal/60 dark:text-ivory/60">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                      {lead.property_id || "—"}
                    </td>
                    <td className="px-5 py-4 text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-xs font-sans text-gold-600 dark:text-gold-400 hover:underline"
                      >
                        Reply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
