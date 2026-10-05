"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, IndianRupee, Link as LinkIcon,
  Copy, Check, Send, UserPlus, Phone, Mail,
  MessageCircle, X,
  Home, Edit2, Star, ShieldCheck, Clock, Shield, Wallet
} from "lucide-react";
import { properties } from "@/data/properties";

type Lead = Record<string, string>;
type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  requirements?: string;
  notes?: string;
  status: string;
  created_at?: string;
};
type KycRecord = Record<string, string>;

const LEAD_STATUSES = ["new", "contacted", "follow-up", "confirmed", "closed"] as const;
const CUSTOMER_STATUSES = ["prospect", "active", "confirmed", "vip", "closed"] as const;

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600",
  contacted: "bg-amber-500/10 text-amber-600",
  "follow-up": "bg-purple-500/10 text-purple-600",
  confirmed: "bg-emerald-500/10 text-emerald-600",
  closed: "bg-stone-200 text-stone-500",
  prospect: "bg-blue-500/10 text-blue-600",
  active: "bg-amber-500/10 text-amber-600",
  vip: "bg-gold-500/10 text-gold-600",
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors whitespace-nowrap">
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}

export function AgentDashboard({
  code, agent, leads: initialLeads, referralLink, kycBaseUrl, kycRecords: initialKycRecords,
}: {
  code: string;
  agent: Record<string, string> | null;
  leads: Lead[];
  referralLink: string;
  kycBaseUrl: string;
  kycRecords: KycRecord[];
}) {
  const [tab, setTab] = useState<"overview" | "leads" | "customers" | "send" | "kyc">("overview");
  const [kycRecords] = useState<KycRecord[]>(initialKycRecords);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [leadStatuses, setLeadStatuses] = useState<Record<string, string>>({});
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [sendPhone, setSendPhone] = useState("");
  const [sendProperty, setSendProperty] = useState("");
  const [sendCustomerId, setSendCustomerId] = useState("");
  const [searchProp, setSearchProp] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", requirements: "", notes: "", status: "prospect" });

  // Load lead statuses from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sc_lead_status_${code}`);
      if (saved) setLeadStatuses(JSON.parse(saved));
      const savedNotes = localStorage.getItem(`sc_lead_notes_${code}`);
      if (savedNotes) setLeadNotes(JSON.parse(savedNotes));
    } catch {}
  }, [code]);

  const fetchCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    try {
      const res = await fetch(`/api/agent/${code}/customers`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {}
    setLoadingCustomers(false);
  }, [code]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const saveLeadStatus = (leadId: string, status: string) => {
    const updated = { ...leadStatuses, [leadId]: status };
    setLeadStatuses(updated);
    try { localStorage.setItem(`sc_lead_status_${code}`, JSON.stringify(updated)); } catch {}
  };

  const saveLeadNote = (leadId: string, note: string) => {
    const updated = { ...leadNotes, [leadId]: note };
    setLeadNotes(updated);
    try { localStorage.setItem(`sc_lead_notes_${code}`, JSON.stringify(updated)); } catch {}
  };

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    const res = await fetch(`/api/agent/${code}/customers`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });
    const data = await res.json();
    if (data.customer) {
      setCustomers(prev => [data.customer, ...prev]);
    } else {
      // Supabase not configured, add locally
      setCustomers(prev => [{ ...newCustomer, id: Date.now().toString(), created_at: new Date().toISOString() }, ...prev]);
    }
    setNewCustomer({ name: "", phone: "", email: "", requirements: "", notes: "", status: "prospect" });
    setShowAddCustomer(false);
  };

  const updateCustomer = async (customer: Customer) => {
    await fetch(`/api/agent/${code}/customers`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: customer.id, status: customer.status, notes: customer.notes }),
    });
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    setEditingCustomer(null);
  };

  const sendViaWhatsApp = () => {
    const phone = sendCustomerId
      ? customers.find(c => c.id === sendCustomerId)?.phone
      : sendPhone;
    const prop = properties.find(p => p.id === sendProperty || p.slug === sendProperty);
    if (!phone || !prop) return;
    const siteBase = typeof window !== "undefined" ? window.location.origin.replace("/agent/" + code, "") : "https://staycove.in";
    const propUrl = `${siteBase}/properties/${prop.slug}?ref=${code}`;
    const msg = `Hi! I'm sharing a luxury villa from StaySphere that matches your requirements:\n\n*${prop.title}*\n📍 ${prop.city}, ${prop.country}\n🛏 ${prop.bedrooms} bed · 🛁 ${prop.bathrooms} bath · 👥 up to ${prop.max_guests} guests${prop.has_pool ? " · Pool" : ""}\n\n🔗 View property: ${propUrl}\n\nLet me know if you'd like more details!`;
    const clean = phone.replace(/\D/g, "");
    const waPhone = clean.startsWith("91") ? clean : `91${clean}`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const confirmedLeads = leads.filter(l => (leadStatuses[l.id] || "new") === "confirmed").length;
  const thisMonthLeads = leads.filter(l => new Date(l.created_at).getMonth() === new Date().getMonth()).length;

  const filteredProperties = properties.filter(p =>
    !searchProp || p.title.toLowerCase().includes(searchProp.toLowerCase()) || p.city.toLowerCase().includes(searchProp.toLowerCase()) || (p.code && p.code.toLowerCase().includes(searchProp.toLowerCase()))
  ).slice(0, 20);

  const pendingKyc = kycRecords.filter(r => r.status === "pending").length;

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "leads", label: `Leads (${leads.length})`, icon: TrendingUp },
    { id: "customers", label: `My Customers (${customers.length})`, icon: Users },
    { id: "send", label: "Send Property", icon: Send },
    { id: "kyc", label: `KYC${pendingKyc > 0 ? ` (${pendingKyc})` : ""}`, icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-lg font-light text-charcoal dark:text-ivory">StaySphere</Link>
            <span className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 bg-gold-500/10 px-2 py-1">Agent Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-charcoal/40 dark:text-ivory/40">{code}</span>
            {agent && <span className="text-sm font-sans text-charcoal/60 dark:text-ivory/60">{agent.name}</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-0 border-t border-stone-100 dark:border-stone-900">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id as typeof tab)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-sans font-medium tracking-wide border-b-2 transition-colors ${tab === id ? "border-gold-500 text-gold-600 dark:text-gold-400" : "border-transparent text-charcoal/50 dark:text-ivory/50 hover:text-charcoal dark:hover:text-ivory"}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-3xl font-light text-charcoal dark:text-ivory mb-1">
                {agent ? `Welcome back, ${agent.name.split(" ")[0]}` : "Agent Dashboard"}
              </h1>
              {agent && <p className="text-sm font-sans text-charcoal/50">{agent.agency_name}</p>}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Total Leads", value: leads.length, sub: "from your link" },
                { icon: TrendingUp, label: "This Month", value: thisMonthLeads, sub: "new leads" },
                { icon: Star, label: "Confirmed", value: confirmedLeads, sub: "bookings" },
                { icon: Wallet, label: "Commission", value: "10%", sub: "per booking" },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-5">
                  <Icon className="w-4 h-4 text-gold-500 mb-3" />
                  <p className="font-serif text-3xl font-light text-charcoal dark:text-ivory">{value}</p>
                  <p className="text-xs font-sans font-medium text-charcoal dark:text-ivory mt-0.5">{label}</p>
                  <p className="text-[10px] font-sans text-charcoal/40 dark:text-ivory/40">{sub}</p>
                </div>
              ))}
            </div>

            {/* Earnings summary */}
            <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
              <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4 flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5" /> Earnings Overview
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-serif font-light text-charcoal dark:text-ivory">{confirmedLeads}</p>
                  <p className="text-xs font-sans text-charcoal/50 mt-0.5">Confirmed Bookings</p>
                </div>
                <div>
                  <p className="text-2xl font-serif font-light text-gold-600">10%</p>
                  <p className="text-xs font-sans text-charcoal/50 mt-0.5">Your Commission Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-serif font-light text-emerald-600">
                    {confirmedLeads > 0 ? "Active" : "Pending"}
                  </p>
                  <p className="text-xs font-sans text-charcoal/50 mt-0.5">Account Status</p>
                </div>
              </div>
              <p className="text-xs font-sans text-charcoal/40 mt-5 pt-5 border-t border-stone-100 dark:border-stone-800">
                Commission is calculated on actual booking amount and paid within 7 days of guest check-in.
              </p>
            </div>

            {/* Referral link */}
            <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
              <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4 flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" /> Your Referral Link
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-3 font-mono text-xs text-charcoal/70 dark:text-ivory/70 overflow-hidden text-ellipsis whitespace-nowrap">
                  {referralLink}
                </div>
                <CopyBtn text={referralLink} />
              </div>
              <p className="text-xs font-sans text-charcoal/40 mt-3">
                Share with clients — every booking through this link earns you <strong className="text-gold-600">10% commission</strong>. Attribution lasts 30 days.
              </p>
            </div>

            {/* KYC link */}
            <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
              <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Get KYC of Your Client
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-3 font-mono text-xs text-charcoal/70 dark:text-ivory/70 overflow-hidden text-ellipsis whitespace-nowrap">
                  {kycBaseUrl}
                </div>
                <CopyBtn text={kycBaseUrl} />
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Please complete your KYC verification before check-in:\n${kycBaseUrl}\n\nThis is required for your stay.`)}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors whitespace-nowrap">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>
              <p className="text-xs font-sans text-charcoal/40 mt-3">
                Copy link ya WhatsApp se seedha guest ko bhejo — woh ID upload karenge aur <button onClick={() => setTab("kyc")} className="text-gold-600 hover:underline">KYC tab</button> mein dikh jayega.
              </p>
            </div>
          </div>
        )}

        {/* ── LEADS ── */}
        {tab === "leads" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">Referral Leads</h2>
              <span className="text-xs font-sans text-charcoal/40">Customers who visited via your link</span>
            </div>

            {leads.length === 0 ? (
              <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-16 text-center">
                <TrendingUp className="w-8 h-8 text-charcoal/20 mx-auto mb-4" />
                <p className="text-sm font-sans text-charcoal/40">No leads yet — share your referral link to start earning.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => {
                  const status = leadStatuses[lead.id] || "new";
                  return (
                    <div key={lead.id} className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{lead.name}</p>
                            <span className={`px-2 py-0.5 text-[9px] font-sans font-medium tracking-wide uppercase ${statusColors[status] || "bg-stone-100 text-stone-500"}`}>
                              {status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs font-sans text-charcoal/50">
                            {lead.phone && (
                              <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-gold-600 transition-colors">
                                <Phone className="w-3 h-3" />{lead.phone}
                              </a>
                            )}
                            {lead.email && (
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-gold-600 transition-colors">
                                <Mail className="w-3 h-3" />{lead.email}
                              </a>
                            )}
                            <span>{lead.property_id || lead.destination || "General Enquiry"}</span>
                            <span>{lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN") : "—"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* WhatsApp */}
                          {lead.phone && (
                            <a href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${lead.name}, following up on your luxury stay enquiry with StaySphere!`)}`}
                              target="_blank"
                              className="p-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors" title="WhatsApp">
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          {/* Status selector */}
                          <select value={status} onChange={e => saveLeadStatus(lead.id, e.target.value)}
                            className="text-xs font-sans border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-charcoal dark:text-ivory px-2 py-1.5 focus:outline-none">
                            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mt-3 pt-3 border-t border-stone-50 dark:border-stone-900">
                        <input
                          value={leadNotes[lead.id] || ""}
                          onChange={e => saveLeadNote(lead.id, e.target.value)}
                          placeholder="Add a note about this lead..."
                          className="w-full text-xs font-sans bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 px-3 py-2 text-charcoal dark:text-ivory placeholder:text-charcoal/30 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOMERS (CRM) ── */}
        {tab === "customers" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">My Customers</h2>
              <button onClick={() => setShowAddCustomer(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors">
                <UserPlus className="w-3.5 h-3.5" /> Add Customer
              </button>
            </div>

            {/* Add Customer Form */}
            {showAddCustomer && (
              <div className="bg-white dark:bg-[#121212] border border-gold-500/30 p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">New Customer</p>
                  <button onClick={() => setShowAddCustomer(false)} className="text-charcoal/40 hover:text-charcoal">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input value={newCustomer.name} onChange={e => setNewCustomer(p => ({ ...p, name: e.target.value }))}
                    placeholder="Full Name *" className="input-luxury text-sm" />
                  <input value={newCustomer.phone} onChange={e => setNewCustomer(p => ({ ...p, phone: e.target.value }))}
                    placeholder="Phone Number *" className="input-luxury text-sm" />
                  <input value={newCustomer.email} onChange={e => setNewCustomer(p => ({ ...p, email: e.target.value }))}
                    placeholder="Email (optional)" className="input-luxury text-sm" />
                  <select value={newCustomer.status} onChange={e => setNewCustomer(p => ({ ...p, status: e.target.value }))}
                    className="input-luxury text-sm">
                    {CUSTOMER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <input value={newCustomer.requirements} onChange={e => setNewCustomer(p => ({ ...p, requirements: e.target.value }))}
                  placeholder="Requirements (e.g. 5-bed villa in Goa, pool, Dec 15-20)" className="input-luxury text-sm w-full mb-3" />
                <textarea value={newCustomer.notes} onChange={e => setNewCustomer(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Notes" rows={2} className="input-luxury text-sm w-full resize-none mb-4" />
                <div className="flex gap-3">
                  <button onClick={addCustomer}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors">
                    <UserPlus className="w-3.5 h-3.5" /> Save Customer
                  </button>
                  <button onClick={() => setShowAddCustomer(false)} className="px-5 py-2.5 border border-stone-200 dark:border-stone-700 text-xs font-sans text-charcoal/60 hover:text-charcoal uppercase tracking-wide transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {loadingCustomers ? (
              <div className="p-12 text-center text-sm text-charcoal/40">Loading...</div>
            ) : customers.length === 0 ? (
              <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-16 text-center">
                <Users className="w-8 h-8 text-charcoal/20 mx-auto mb-4" />
                <p className="text-sm font-sans text-charcoal/40 mb-3">No customers yet — add your first client.</p>
                <button onClick={() => setShowAddCustomer(true)} className="text-xs font-sans text-gold-600 hover:underline">+ Add Customer</button>
              </div>
            ) : (
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-5">
                    {editingCustomer?.id === customer.id ? (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{customer.name}</p>
                          <button onClick={() => setEditingCustomer(null)}><X className="w-4 h-4 text-charcoal/40" /></button>
                        </div>
                        <select value={editingCustomer.status}
                          onChange={e => setEditingCustomer(p => p ? { ...p, status: e.target.value } : p)}
                          className="input-luxury text-sm mb-3">
                          {CUSTOMER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        <textarea value={editingCustomer.notes || ""}
                          onChange={e => setEditingCustomer(p => p ? { ...p, notes: e.target.value } : p)}
                          placeholder="Notes" rows={2} className="input-luxury text-sm w-full resize-none mb-3" />
                        <button onClick={() => updateCustomer(editingCustomer)}
                          className="px-4 py-2 bg-gold-500 text-white text-xs font-sans uppercase tracking-wide hover:bg-gold-600 transition-colors">
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{customer.name}</p>
                            <span className={`px-2 py-0.5 text-[9px] font-sans font-medium tracking-wide uppercase ${statusColors[customer.status] || "bg-stone-100 text-stone-500"}`}>
                              {customer.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs font-sans text-charcoal/50">
                            <a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-gold-600 transition-colors">
                              <Phone className="w-3 h-3" />{customer.phone}
                            </a>
                            {customer.email && (
                              <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-gold-600 transition-colors">
                                <Mail className="w-3 h-3" />{customer.email}
                              </a>
                            )}
                          </div>
                          {customer.requirements && (
                            <p className="text-xs font-sans text-charcoal/50 mt-2 italic">"{customer.requirements}"</p>
                          )}
                          {customer.notes && (
                            <p className="text-xs font-sans text-charcoal/40 mt-1">{customer.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* KYC status indicator */}
                          {(() => {
                            const kyc = kycRecords.find(r => r.phone === customer.phone);
                            if (kyc) return (
                              <span className={`flex items-center gap-1 px-2 py-1 text-[9px] font-sans font-medium uppercase tracking-wide ${kyc.status === "approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`} title="KYC status">
                                <Shield className="w-3 h-3" /> KYC {kyc.status}
                              </span>
                            );
                            return null;
                          })()}
                          {/* Send KYC link via WhatsApp */}
                          <a href={`https://wa.me/91${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${customer.name}, please complete your identity verification (KYC) before check-in by clicking this link: ${kycBaseUrl}&customer=${customer.id}\n\nThis is required for your StaySphere stay.`)}`}
                            target="_blank"
                            className="p-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors" title="Send KYC link">
                            <ShieldCheck className="w-4 h-4" />
                          </a>
                          <a href={`https://wa.me/91${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${customer.name}, `)}`}
                            target="_blank"
                            className="p-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors" title="WhatsApp">
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => { setTab("send"); setSendCustomerId(customer.id); setSendPhone(customer.phone); }}
                            className="p-2 bg-gold-500/10 text-gold-600 hover:bg-gold-500/20 transition-colors" title="Send property">
                            <Send className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingCustomer(customer)} className="p-2 text-charcoal/30 hover:text-charcoal transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── KYC RECORDS ── */}
        {tab === "kyc" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-1">Guest KYC Records</h2>
                <p className="text-sm font-sans text-charcoal/40">Identity verifications submitted by your customers</p>
              </div>
              <div className="flex items-center gap-3">
                <CopyBtn text={kycBaseUrl} />
              </div>
            </div>

            {/* KYC link card */}
            <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-5 mb-6">
              <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 mb-2">Your KYC Collection Link</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2.5 font-mono text-xs text-charcoal/70 dark:text-ivory/70 overflow-hidden text-ellipsis whitespace-nowrap">
                  {kycBaseUrl}
                </div>
                <CopyBtn text={kycBaseUrl} />
              </div>
              <p className="text-xs font-sans text-charcoal/40 mt-2">Share this link with your customers. Their KYC submissions will automatically appear here.</p>
            </div>

            {kycRecords.length === 0 ? (
              <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-16 text-center">
                <ShieldCheck className="w-8 h-8 text-charcoal/20 mx-auto mb-4" />
                <p className="text-sm font-sans text-charcoal/40 mb-2">No KYC submissions yet.</p>
                <p className="text-xs font-sans text-charcoal/30">Share your KYC link with customers to collect their identity verification.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {kycRecords.map((rec) => (
                  <div key={rec.id} className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{rec.name}</p>
                          <span className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-medium tracking-wide uppercase ${rec.status === "approved" ? "bg-emerald-500/10 text-emerald-600" : rec.status === "rejected" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-600"}`}>
                            {rec.status === "approved" ? <ShieldCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {rec.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs font-sans text-charcoal/50">
                          <span>{rec.phone}</span>
                          {rec.property_name && <span>📍 {rec.property_name}</span>}
                          {rec.checkin_date && <span>Check-in: {new Date(rec.checkin_date).toLocaleDateString("en-IN")}</span>}
                          <span>{rec.id_type}</span>
                          {rec.guest_count && <span>{rec.guest_count} guest{parseInt(rec.guest_count) > 1 ? "s" : ""}</span>}
                          <span>{rec.created_at ? new Date(rec.created_at).toLocaleDateString("en-IN") : "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SEND PROPERTY ── */}
        {tab === "send" && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-1">Send Property to Client</h2>
              <p className="text-sm font-sans text-charcoal/50">Share a property profile directly via WhatsApp — your referral link is included automatically.</p>
            </div>

            <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6 space-y-5">

              {/* Customer selection */}
              <div>
                <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-2">
                  Customer
                </label>
                {customers.length > 0 ? (
                  <select value={sendCustomerId}
                    onChange={e => { setSendCustomerId(e.target.value); setSendPhone(customers.find(c => c.id === e.target.value)?.phone || ""); }}
                    className="input-luxury text-sm w-full mb-2">
                    <option value="">— Select from my customers —</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>)}
                  </select>
                ) : null}
                <input value={sendPhone} onChange={e => { setSendPhone(e.target.value); setSendCustomerId(""); }}
                  placeholder="Or enter phone number directly (e.g. 9876543210)"
                  className="input-luxury text-sm w-full" />
              </div>

              {/* Property search */}
              <div>
                <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-2">
                  Property
                </label>
                <input value={searchProp} onChange={e => setSearchProp(e.target.value)}
                  placeholder="Search by name, city, or code..." className="input-luxury text-sm w-full mb-2" />
                <select value={sendProperty} onChange={e => setSendProperty(e.target.value)}
                  className="input-luxury text-sm w-full" size={6}>
                  <option value="">— Select a property —</option>
                  {filteredProperties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code ? `${p.code} · ` : ""}{p.title} · {p.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {sendProperty && (() => {
                const prop = properties.find(p => p.id === sendProperty);
                if (!prop) return null;
                const siteBase = typeof window !== "undefined" ? window.location.origin.replace(`/agent/${code}`, "") : "https://staycove.in";
                const propUrl = `${siteBase}/properties/${prop.slug}?ref=${code}`;
                return (
                  <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4">
                    <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 mb-2">Message Preview</p>
                    <p className="text-xs font-sans text-charcoal/70 dark:text-ivory/70 whitespace-pre-line leading-relaxed">
                      {`Hi! I'm sharing a luxury villa from StaySphere that matches your requirements:\n\n*${prop.title}*\n📍 ${prop.city}, ${prop.country}\n🛏 ${prop.bedrooms} bed · 🛁 ${prop.bathrooms} bath · 👥 up to ${prop.max_guests} guests${prop.has_pool ? " · Pool" : ""}\n\n🔗 View property: ${propUrl}\n\nLet me know if you'd like more details!`}
                    </p>
                  </div>
                );
              })()}

              <button
                onClick={sendViaWhatsApp}
                disabled={!sendPhone || !sendProperty}
                className="flex items-center gap-2 w-full justify-center px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-sans font-medium uppercase tracking-wide transition-colors">
                <MessageCircle className="w-4 h-4" />
                Send via WhatsApp
              </button>

              <p className="text-[10px] font-sans text-charcoal/30 text-center">
                Opens WhatsApp Web with a pre-filled message. Your referral link is embedded automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
