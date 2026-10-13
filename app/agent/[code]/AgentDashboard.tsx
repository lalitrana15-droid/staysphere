"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, IndianRupee, Link as LinkIcon,
  Copy, Check, Send, UserPlus, Phone, Mail,
  MessageCircle, X, Building2,
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

function KycLinkGenerator({ kycBaseUrl, onKycTab }: { kycBaseUrl: string; onKycTab: () => void }) {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [copied, setCopied] = useState(false);

  const propertyOptions = properties.map(p => ({ value: p.code ?? p.title, label: `${p.code ?? p.title} — ${p.city}` }));

  const kycLink = selectedProperty
    ? `${kycBaseUrl}&property=${encodeURIComponent(selectedProperty)}`
    : kycBaseUrl;

  const waText = selectedProperty
    ? `Please complete your KYC verification before check-in at *${selectedProperty}*:\n${kycLink}\n\nThis is required for your stay.`
    : `Please complete your KYC verification before check-in:\n${kycLink}\n\nThis is required for your stay.`;

  const copyLink = () => {
    navigator.clipboard.writeText(kycLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-6">
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" /> Get KYC of Your Client
      </p>

      {/* Step 1: Select property */}
      <div className="mb-3">
        <label className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/40 dark:text-ivory/40 block mb-1.5">
          Step 1 — Property chunein (optional)
        </label>
        <select
          value={selectedProperty}
          onChange={e => { setSelectedProperty(e.target.value); setCopied(false); }}
          className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2.5 text-xs font-sans text-charcoal dark:text-ivory focus:outline-none focus:border-gold-400">
          <option value="">— Property select karo (ya generic link bhejo) —</option>
          {propertyOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Step 2: Generated link + actions */}
      <div className="mb-3">
        <label className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/40 dark:text-ivory/40 block mb-1.5">
          Step 2 — Yeh link customer ko bhejo
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2.5 font-mono text-[11px] text-charcoal/60 dark:text-ivory/60 overflow-hidden text-ellipsis whitespace-nowrap">
            {kycLink}
          </div>
          <button onClick={copyLink}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors whitespace-nowrap">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(waText)}`} target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors whitespace-nowrap">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>
      </div>

      <p className="text-xs font-sans text-charcoal/40">
        {selectedProperty
          ? `Customer ke form mein "${selectedProperty}" already filled hoga — unhe choose nahi karna padega.`
          : "Property select karne par link pre-filled hoga. Ya seedha generic link share kar sakte ho."}{" "}
        Submissions <button onClick={onKycTab} className="text-gold-600 hover:underline">KYC tab</button> mein dikhenge.
      </p>
    </div>
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
  const [tab, setTab] = useState<"overview" | "properties" | "leads" | "customers" | "send" | "kyc">("overview");
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
  const [selectedProps, setSelectedProps] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [propSearch, setPropSearch] = useState("");
  const [propDestFilter, setPropDestFilter] = useState("");
  const [shareIncludeBrochure, setShareIncludeBrochure] = useState<Record<string, boolean>>({});
  const [viewingProp, setViewingProp] = useState<string | null>(null);
  const [propFilters, setPropFilters] = useState<{
    petFriendly: boolean; lakeView: boolean; beachView: boolean; mountainView: boolean; bhk: number | null;
  }>({ petFriendly: false, lakeView: false, beachView: false, mountainView: false, bhk: null });

  const toggleFilter = (key: keyof Omit<typeof propFilters, "bhk">) =>
    setPropFilters(p => ({ ...p, [key]: !p[key] }));
  const toggleBhk = (n: number) =>
    setPropFilters(p => ({ ...p, bhk: p.bhk === n ? null : n }));

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

  const toggleProp = (id: string) => {
    setSelectedProps(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const generateBulkMessage = () => {
    const siteBase = "https://staysvacation.com";
    const selected = properties.filter(p => selectedProps.includes(p.id));
    const lines = selected.map((prop, i) => {
      const propUrl = `${siteBase}/properties/${prop.slug}?ref=${code}`;
      const includeBrochure = shareIncludeBrochure[prop.id] !== false;
      const brochureUrl = `${siteBase}/properties/${prop.slug}/brochure?ref=${code}`;
      return `${i + 1}. *${prop.code ?? prop.title}*\n📍 ${prop.city}, ${prop.country}\n🛏 ${prop.bedrooms} bed · 🛁 ${prop.bathrooms} bath · 👥 up to ${prop.max_guests} guests${prop.has_pool ? " · Pool" : ""}\n🔗 ${propUrl}${includeBrochure ? `\n📋 Brochure: ${brochureUrl}` : ""}`;
    });
    return `Hi! Here are some luxury villas I've curated for you:\n\n${lines.join("\n\n")}\n\n🏷️ Use my agent code *${code}* and get *5% discount* on the final price!\n\nLet me know which one interests you most!`;
  };

  const sendViaWhatsApp = () => {
    const phone = sendCustomerId
      ? customers.find(c => c.id === sendCustomerId)?.phone
      : sendPhone;
    const prop = properties.find(p => p.id === sendProperty || p.slug === sendProperty);
    if (!phone || !prop) return;
    const siteBase = typeof window !== "undefined" ? window.location.origin.replace("/agent/" + code, "") : "https://staysvacation.com";
    const propUrl = `${siteBase}/properties/${prop.slug}?ref=${code}`;
    const msg = `Hi! I'm sharing a luxury villa from StaysVacation that matches your requirements:\n\n*${prop.code ?? prop.title}*\n📍 ${prop.city}, ${prop.country}\n🛏 ${prop.bedrooms} bed · 🛁 ${prop.bathrooms} bath · 👥 up to ${prop.max_guests} guests${prop.has_pool ? " · Pool" : ""}\n\n🔗 View property: ${propUrl}\n\n🏷️ Use my agent code *${code}* and get *5% discount* on the final price!\n\nLet me know if you'd like more details!`;
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

  const propTabFiltered = properties.filter(p => {
    const q = propSearch.toLowerCase();
    const title = p.title.toLowerCase();
    const tags = p.tags ?? [];
    const matchSearch = !q || title.includes(q) || p.city.toLowerCase().includes(q) || (p.code ?? "").toLowerCase().includes(q);
    const matchDest = !propDestFilter || p.destination_slug === propDestFilter;
    const matchPet = !propFilters.petFriendly || title.includes("pet") || tags.some(t => t.includes("pet"));
    const matchLake = !propFilters.lakeView || title.includes("lake") || tags.some(t => t.includes("lake"));
    const matchBeach = !propFilters.beachView || title.includes("beach") || tags.some(t => ["beach", "beachfront", "sea view", "ocean view"].includes(t));
    const matchMountain = !propFilters.mountainView || tags.some(t => ["mountain", "mountains", "hills", "hill", "valley view", "hillside"].includes(t)) || title.includes("mountain") || title.includes("hill");
    const matchBhk = !propFilters.bhk || (propFilters.bhk === 5 ? p.bedrooms >= 5 : p.bedrooms === propFilters.bhk);
    return matchSearch && matchDest && matchPet && matchLake && matchBeach && matchMountain && matchBhk;
  }).slice(0, 80);

  const uniqueDestinations = Array.from(new Set(properties.map(p => p.destination_slug))).filter(Boolean).sort();

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "properties", label: "Properties", icon: Building2 },
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
            <Link href="/" className="font-serif text-lg font-light text-charcoal dark:text-ivory">StaysVacation</Link>
            <span className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 bg-gold-500/10 px-2 py-1">Agent Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-charcoal/40 dark:text-ivory/40">{code}</span>
            {agent && <span className="text-sm font-sans text-charcoal/60 dark:text-ivory/60">{agent.name}</span>}
            <Link
              href="/agent-program"
              className="text-[10px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal/40 dark:text-ivory/40 hover:text-red-500 dark:hover:text-red-400 transition-colors border border-stone-200 dark:border-stone-800 px-3 py-1.5"
            >
              Sign Out
            </Link>
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

            {/* KYC link with property selector */}
            <KycLinkGenerator kycBaseUrl={kycBaseUrl} onKycTab={() => setTab("kyc")} />
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
                            <a href={`https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${lead.name}, following up on your luxury stay enquiry with StaysVacation!`)}`}
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
                          <a href={`https://wa.me/91${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${customer.name}, please complete your identity verification (KYC) before check-in by clicking this link: ${kycBaseUrl}&customer=${customer.id}\n\nThis is required for your StaysVacation stay.`)}`}
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

        {/* ── PROPERTIES ── */}
        {tab === "properties" && (
          <div>
            {/* Search + filter + bulk send bar */}
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                value={propSearch}
                onChange={e => setPropSearch(e.target.value)}
                placeholder="Search by name, city, or code..."
                className="input-luxury text-sm flex-1 min-w-[200px]"
              />
              <select
                value={propDestFilter}
                onChange={e => setPropDestFilter(e.target.value)}
                className="input-luxury text-sm"
              >
                <option value="">All Destinations</option>
                {uniqueDestinations.map(d => (
                  <option key={d} value={d}>{d.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
              {selectedProps.length > 0 && (
                <>
                  <button onClick={() => setSelectedProps([])}
                    className="px-4 py-2.5 border border-stone-200 dark:border-stone-700 text-xs font-sans text-charcoal/60 hover:text-charcoal uppercase tracking-wide transition-colors">
                    Clear ({selectedProps.length})
                  </button>
                  <button onClick={() => { setShareIncludeBrochure({}); setShowShareModal(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors">
                    <Send className="w-3.5 h-3.5" /> Bulk Send ({selectedProps.length})
                  </button>
                </>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {([
                { key: "petFriendly", label: "🐾 Pet Friendly" },
                { key: "lakeView",    label: "🏞 Lake View" },
                { key: "beachView",   label: "🏖 Beach View" },
                { key: "mountainView",label: "⛰ Mountain View" },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  className={`px-3 py-1.5 text-xs font-sans font-medium transition-colors border ${propFilters[key] ? "bg-gold-500 border-gold-500 text-white" : "border-stone-200 dark:border-stone-700 text-charcoal/60 dark:text-ivory/60 hover:border-gold-400 hover:text-gold-600"}`}
                >
                  {label}
                </button>
              ))}
              <div className="flex items-center gap-1 ml-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => toggleBhk(n)}
                    className={`px-3 py-1.5 text-xs font-sans font-medium transition-colors border ${propFilters.bhk === n ? "bg-charcoal dark:bg-ivory text-white dark:text-charcoal border-charcoal dark:border-ivory" : "border-stone-200 dark:border-stone-700 text-charcoal/60 dark:text-ivory/60 hover:border-stone-400"}`}
                  >
                    {n === 5 ? "5+ BHK" : `${n} BHK`}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs font-sans text-charcoal/40 mb-4">
              Showing {propTabFiltered.length} of {properties.length} properties · Click to open · Check box to bulk send
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {propTabFiltered.map(prop => {
                const isSelected = selectedProps.includes(prop.id);
                return (
                  <div
                    key={prop.id}
                    onClick={() => setViewingProp(prop.id)}
                    className={`relative bg-white dark:bg-[#121212] border cursor-pointer transition-all duration-200 overflow-hidden group ${isSelected ? "border-gold-500" : "border-stone-200/60 dark:border-stone-800/60 hover:border-stone-300 dark:hover:border-stone-700"}`}
                  >
                    {/* Checkbox — click to select for bulk, does NOT open */}
                    <div
                      onClick={e => { e.stopPropagation(); toggleProp(prop.id); }}
                      className={`absolute top-3 right-3 z-10 w-5 h-5 flex items-center justify-center border-2 transition-colors shadow-sm ${isSelected ? "bg-gold-500 border-gold-500" : "bg-white/90 border-stone-300 hover:border-gold-400"}`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Image */}
                    {prop.images?.[0] && (
                      <div className="relative h-44 overflow-hidden">
                        <img src={prop.images[0]} alt={prop.code ?? prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {prop.featured && (
                          <span className="absolute top-3 left-3 text-[9px] font-sans font-medium tracking-[0.15em] uppercase bg-gold-500 text-white px-2 py-0.5">
                            Featured
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gold-500/10" />
                        )}
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory mb-0.5 pr-6 leading-tight">{prop.code ?? prop.title}</p>
                      <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mb-3">📍 {prop.city}, {prop.country}</p>
                      <div className="flex items-center gap-3 text-[10px] font-sans text-charcoal/50 dark:text-ivory/50">
                        <span>🛏 {prop.bedrooms} bed</span>
                        <span>🛁 {prop.bathrooms} bath</span>
                        <span>👥 {prop.max_guests}</span>
                        {prop.has_pool && <span className="text-blue-500">Pool</span>}
                      </div>
                      {prop.code && (
                        <p className="font-mono text-[10px] text-charcoal/30 dark:text-ivory/30 mt-2">{prop.code}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PROPERTY DETAIL MODAL ── */}
        {viewingProp && (() => {
          const prop = properties.find(p => p.id === viewingProp);
          if (!prop) return null;
          const propUrl = `https://staysvacation.com/properties/${prop.slug}?ref=${code}`;
          const brochureUrl = `/properties/${prop.slug}/brochure`;
          const waMsg = `Hi! Here's a luxury villa I'd like to share with you:\n\n*${prop.code ?? prop.title}*\n📍 ${prop.city}, ${prop.country}\n🛏 ${prop.bedrooms} bed · 🛁 ${prop.bathrooms} bath · 👥 up to ${prop.max_guests} guests${prop.has_pool ? " · Pool" : ""}\n\n🔗 View property: ${propUrl}\n📋 Brochure: https://staysvacation.com${brochureUrl}\n\n🏷️ Use my agent code *${code}* and get *5% discount* on the final price!\n\nLet me know if you'd like more details!`;
          return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center" onClick={() => setViewingProp(null)}>
              <div className="bg-white dark:bg-[#121212] w-full sm:max-w-2xl sm:mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Hero image carousel (show first 3) */}
                {prop.images?.[0] && (
                  <div className="relative h-56 sm:h-72 overflow-hidden">
                    <img src={prop.images[0]} alt={prop.code ?? prop.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button onClick={() => setViewingProp(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors">
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-serif text-xl font-light">{prop.code ?? prop.title}</p>
                      <p className="text-white/70 text-xs mt-1">📍 {prop.city}, {prop.country}</p>
                    </div>
                  </div>
                )}

                {/* Thumbnail strip */}
                {prop.images && prop.images.length > 1 && (
                  <div className="flex gap-1.5 px-4 pt-3">
                    {prop.images.slice(1, 5).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-16 h-12 object-cover flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity" />
                    ))}
                    {prop.images.length > 5 && (
                      <div className="w-16 h-12 bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-sans text-charcoal/50">+{prop.images.length - 5}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Details */}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      {prop.code && <p className="font-mono text-[10px] text-charcoal/40 dark:text-ivory/40 mb-1">{prop.code}</p>}
                      <div className="flex flex-wrap gap-4 text-xs font-sans text-charcoal/60 dark:text-ivory/60">
                        <span>🛏 {prop.bedrooms} Bedrooms</span>
                        <span>🛁 {prop.bathrooms} Bathrooms</span>
                        <span>👥 Up to {prop.max_guests} guests</span>
                        {prop.has_pool && <span className="text-blue-500">🏊 Private Pool</span>}
                      </div>
                    </div>
                  </div>

                  {prop.short_description && (
                    <p className="text-sm font-sans text-charcoal/70 dark:text-ivory/70 leading-relaxed mb-4">{prop.short_description}</p>
                  )}

                  {prop.highlights && prop.highlights.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[9px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 mb-2">Highlights</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {prop.highlights.slice(0, 4).map(h => (
                          <p key={h} className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 flex items-start gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                            {h}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 px-5 pb-5 border-t border-stone-100 dark:border-stone-900 pt-4">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(waMsg)}`}
                    target="_blank"
                    className="flex items-center gap-2 flex-1 justify-center px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-sans font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Send to Client
                  </a>
                  <a
                    href={brochureUrl}
                    target="_blank"
                    className="flex items-center gap-2 justify-center px-4 py-3 border border-stone-200 dark:border-stone-700 text-sm font-sans text-charcoal dark:text-ivory hover:border-gold-400 hover:text-gold-600 transition-colors"
                  >
                    <Send className="w-4 h-4" /> Brochure PDF
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

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
                      {p.code ?? p.title} · {p.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {sendProperty && (() => {
                const prop = properties.find(p => p.id === sendProperty);
                if (!prop) return null;
                const siteBase = typeof window !== "undefined" ? window.location.origin.replace(`/agent/${code}`, "") : "https://staysvacation.com";
                const propUrl = `${siteBase}/properties/${prop.slug}?ref=${code}`;
                return (
                  <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4">
                    <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 mb-2">Message Preview</p>
                    <p className="text-xs font-sans text-charcoal/70 dark:text-ivory/70 whitespace-pre-line leading-relaxed">
                      {`Hi! I'm sharing a luxury villa from StaysVacation that matches your requirements:\n\n*${prop.code ?? prop.title}*\n📍 ${prop.city}, ${prop.country}\n🛏 ${prop.bedrooms} bed · 🛁 ${prop.bathrooms} bath · 👥 up to ${prop.max_guests} guests${prop.has_pool ? " · Pool" : ""}\n\n🔗 View property: ${propUrl}\n\n🏷️ Use my agent code *${code}* and get *5% discount* on the final price!\n\nLet me know if you'd like more details!`}
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

      {/* ── SHARE MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white dark:bg-[#121212] w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-stone-900">
              <div>
                <h3 className="font-serif text-lg font-light text-charcoal dark:text-ivory">Share with your client</h3>
                <p className="text-xs font-sans text-charcoal/50 mt-0.5">{selectedProps.length} {selectedProps.length === 1 ? "property" : "properties"} selected</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-charcoal/40 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Property rows */}
            <div className="divide-y divide-stone-100 dark:divide-stone-900">
              {properties.filter(p => selectedProps.includes(p.id)).map(prop => {
                const includeBrochure = shareIncludeBrochure[prop.id] !== false;
                return (
                  <div key={prop.id} className="flex items-center gap-4 px-6 py-4">
                    {prop.images?.[0] && (
                      <img src={prop.images[0]} alt={prop.code ?? prop.title} className="w-16 h-12 object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory truncate">{prop.code ?? prop.title}</p>
                      <p className="text-xs font-sans text-charcoal/50">📍 {prop.city} · 🛏 {prop.bedrooms} bed · 👥 {prop.max_guests}</p>
                    </div>
                    {/* Brochure toggle */}
                    <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                      <div
                        onClick={() => setShareIncludeBrochure(prev => ({ ...prev, [prop.id]: !includeBrochure }))}
                        className={`w-4 h-4 flex items-center justify-center border-2 transition-colors ${includeBrochure ? "bg-gold-500 border-gold-500" : "bg-white border-stone-300"}`}
                      >
                        {includeBrochure && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-xs font-sans text-charcoal/60">Brochure</span>
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 py-5 border-t border-stone-100 dark:border-stone-900">
              <button
                onClick={() => { navigator.clipboard.writeText(generateBulkMessage()); }}
                className="flex items-center gap-2 flex-1 justify-center px-5 py-3 border border-stone-200 dark:border-stone-700 text-sm font-sans text-charcoal dark:text-ivory hover:border-stone-400 transition-colors">
                <Copy className="w-4 h-4" /> Copy Message
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(generateBulkMessage())}`}
                target="_blank"
                className="flex items-center gap-2 flex-1 justify-center px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-sans font-medium transition-colors">
                <MessageCircle className="w-4 h-4" /> Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
