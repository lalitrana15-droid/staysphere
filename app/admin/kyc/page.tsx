import { ShieldCheck } from "lucide-react";
import { KycAdminClient } from "./KycAdminClient";

async function getKycRecords() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
    ) return [];
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("guest_kyc")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminKycPage() {
  const records = await getKycRecords();
  const pending = records.filter((r: Record<string, string>) => r.status === "pending").length;
  const approved = records.filter((r: Record<string, string>) => r.status === "approved").length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-gold-500" />
            <h1 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">Guest KYC</h1>
          </div>
          <p className="text-sm font-sans text-charcoal/40">Identity verification submissions from guests</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="font-serif text-2xl font-light text-amber-600">{pending}</p>
            <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wide">Pending</p>
          </div>
          <div className="w-px bg-stone-200 dark:bg-stone-800" />
          <div className="text-right">
            <p className="font-serif text-2xl font-light text-emerald-600">{approved}</p>
            <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wide">Approved</p>
          </div>
          <div className="w-px bg-stone-200 dark:bg-stone-800" />
          <div className="text-right">
            <p className="font-serif text-2xl font-light text-charcoal dark:text-ivory">{records.length}</p>
            <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-wide">Total</p>
          </div>
        </div>
      </div>

      <KycAdminClient initialRecords={records} />
    </div>
  );
}
