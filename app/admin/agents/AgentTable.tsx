"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check, X, Clock, Phone, Mail, User, FileText } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  agency_name: string;
  referral_code: string;
  status: string;
  commission_rate: number;
  created_at: string;
  message?: string;
}

interface Lead {
  id: number;
  name: string;
  email?: string;
  phone: string;
  property?: string;
  message?: string;
  ref_agent_code?: string;
  created_at: string;
}

interface KycRecord {
  id: number;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  ref_agent_code?: string;
  status?: string;
  created_at: string;
  property_name?: string;
}

export function AgentTable({
  agents,
  allLeads,
  allKyc,
}: {
  agents: Agent[];
  allLeads: Lead[];
  allKyc: KycRecord[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(agents.map((a) => [a.referral_code, a.status || "pending"]))
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, "leads" | "kyc">>({});

  const updateStatus = async (code: string, status: string) => {
    setLoading(code + status);
    try {
      await fetch(`/api/admin/agents/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setStatuses((prev) => ({ ...prev, [code]: status }));
    } finally {
      setLoading(null);
    }
  };

  if (agents.length === 0) {
    return (
      <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-12 text-center">
        <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50">No agent applications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {agents.map((agent) => {
        const status = statuses[agent.referral_code] || "pending";
        const isOpen = expanded === agent.referral_code;
        const agentLeads = allLeads.filter((l) => l.ref_agent_code === agent.referral_code);
        const agentKyc = allKyc.filter((k) => k.ref_agent_code === agent.referral_code);
        const tab = activeTab[agent.referral_code] || "leads";

        return (
          <div key={agent.id} className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
            {/* Row */}
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900/30 transition-colors"
              onClick={() => setExpanded(isOpen ? null : agent.referral_code)}
            >
              {/* Status indicator */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                status === "approved" ? "bg-emerald-500" :
                status === "rejected" ? "bg-red-500" : "bg-amber-400"
              }`} />

              {/* Name + agency */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory truncate">{agent.name}</p>
                <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 truncate">{agent.agency_name}</p>
              </div>

              {/* Contact */}
              <div className="hidden md:block w-48">
                <p className="text-xs font-sans text-charcoal/70 dark:text-ivory/70 truncate">{agent.email}</p>
                <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50">{agent.phone}</p>
              </div>

              {/* Referral code */}
              <div className="hidden lg:block w-36">
                <span className="font-mono text-[10px] font-medium text-gold-600 dark:text-gold-400 bg-gold-500/10 px-2 py-1">
                  {agent.referral_code || "—"}
                </span>
              </div>

              {/* Stats */}
              <div className="hidden lg:flex gap-4 text-center">
                <div>
                  <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{agentLeads.length}</p>
                  <p className="text-[9px] font-sans text-charcoal/40 dark:text-ivory/40 uppercase tracking-wide">Leads</p>
                </div>
                <div>
                  <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{agentKyc.length}</p>
                  <p className="text-[9px] font-sans text-charcoal/40 dark:text-ivory/40 uppercase tracking-wide">KYC</p>
                </div>
              </div>

              {/* Status badge */}
              <span className={`text-[9px] font-sans font-medium tracking-wide uppercase px-2 py-1 flex-shrink-0 ${
                status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                status === "rejected" ? "bg-red-500/10 text-red-500" :
                "bg-amber-500/10 text-amber-600"
              }`}>
                {status}
              </span>

              {/* Approve/Reject buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {status !== "approved" && (
                  <button
                    onClick={() => updateStatus(agent.referral_code, "approved")}
                    disabled={loading === agent.referral_code + "approved"}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 transition-colors disabled:opacity-50"
                    title="Approve"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                {status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(agent.referral_code, "rejected")}
                    disabled={loading === agent.referral_code + "rejected"}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/60 transition-colors disabled:opacity-50"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {status !== "pending" && (
                  <button
                    onClick={() => updateStatus(agent.referral_code, "pending")}
                    disabled={loading === agent.referral_code + "pending"}
                    className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 transition-colors disabled:opacity-50"
                    title="Set Pending"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Expand */}
              {isOpen ? <ChevronUp className="w-4 h-4 text-charcoal/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-charcoal/30 flex-shrink-0" />}
            </div>

            {/* Expanded detail */}
            {isOpen && (
              <div className="border-t border-stone-100 dark:border-stone-900">
                {/* Agent info strip */}
                <div className="px-5 py-3 bg-stone-50 dark:bg-stone-900/30 flex flex-wrap gap-6 text-xs font-sans text-charcoal/60 dark:text-ivory/60">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{agent.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{agent.phone}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{agent.agency_name}</span>
                  <span>Joined: {new Date(agent.created_at).toLocaleDateString("en-IN")}</span>
                  {agent.message && <span className="flex items-start gap-1.5"><FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /><span className="italic">{agent.message}</span></span>}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-100 dark:border-stone-900 px-5">
                  <button
                    onClick={() => setActiveTab((prev) => ({ ...prev, [agent.referral_code]: "leads" }))}
                    className={`py-2.5 mr-6 text-[10px] font-sans font-medium tracking-[0.12em] uppercase transition-colors border-b-2 ${
                      tab === "leads" ? "text-charcoal dark:text-ivory border-gold-500" : "text-charcoal/40 dark:text-ivory/40 border-transparent"
                    }`}
                  >
                    Customer Leads ({agentLeads.length})
                  </button>
                  <button
                    onClick={() => setActiveTab((prev) => ({ ...prev, [agent.referral_code]: "kyc" }))}
                    className={`py-2.5 text-[10px] font-sans font-medium tracking-[0.12em] uppercase transition-colors border-b-2 ${
                      tab === "kyc" ? "text-charcoal dark:text-ivory border-gold-500" : "text-charcoal/40 dark:text-ivory/40 border-transparent"
                    }`}
                  >
                    KYC Submissions ({agentKyc.length})
                  </button>
                </div>

                {/* Leads tab */}
                {tab === "leads" && (
                  <div className="px-5 py-4">
                    {agentLeads.length === 0 ? (
                      <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40 py-4 text-center">No leads from this agent yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {agentLeads.map((lead) => (
                          <div key={lead.id} className="flex items-start justify-between gap-4 py-3 border-b border-stone-100 dark:border-stone-900 last:border-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{lead.name}</p>
                              {lead.message && (
                                <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mt-0.5 truncate">{lead.message}</p>
                              )}
                              <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 mt-0.5">
                                {new Date(lead.created_at).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {lead.phone && (
                                <a
                                  href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs font-sans text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </a>
                              )}
                              {lead.email && (
                                <a href={`mailto:${lead.email}`} className="text-[10px] font-sans text-charcoal/50 dark:text-ivory/50 hover:underline block mt-0.5">
                                  {lead.email}
                                </a>
                              )}
                              {lead.property && (
                                <p className="text-[10px] font-sans text-gold-600 dark:text-gold-400 mt-0.5">{lead.property}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* KYC tab */}
                {tab === "kyc" && (
                  <div className="px-5 py-4">
                    {agentKyc.length === 0 ? (
                      <p className="text-xs font-sans text-charcoal/40 dark:text-ivory/40 py-4 text-center">No KYC submissions from this agent yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {agentKyc.map((record) => (
                          <div key={record.id} className="flex items-start justify-between gap-4 py-3 border-b border-stone-100 dark:border-stone-900 last:border-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">
                                {record.full_name || record.name || "—"}
                              </p>
                              {record.property_name && (
                                <p className="text-xs font-sans text-gold-600 dark:text-gold-400 mt-0.5">{record.property_name}</p>
                              )}
                              <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40 mt-0.5">
                                {new Date(record.created_at).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {record.phone && (
                                <a
                                  href={`https://wa.me/91${record.phone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs font-sans text-emerald-600 dark:text-emerald-400 hover:underline justify-end"
                                >
                                  <Phone className="w-3 h-3" />
                                  {record.phone}
                                </a>
                              )}
                              {record.email && (
                                <a href={`mailto:${record.email}`} className="text-[10px] font-sans text-charcoal/50 dark:text-ivory/50 hover:underline block mt-0.5">
                                  {record.email}
                                </a>
                              )}
                              <span className={`mt-1 inline-block text-[9px] font-sans font-medium tracking-wide uppercase px-2 py-0.5 ${
                                record.status === "verified" ? "bg-emerald-500/10 text-emerald-600" :
                                record.status === "rejected" ? "bg-red-500/10 text-red-500" :
                                "bg-amber-500/10 text-amber-600"
                              }`}>
                                {record.status || "pending"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
