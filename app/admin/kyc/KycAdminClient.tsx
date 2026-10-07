"use client";

import { useState } from "react";
import { Eye, Check, X, ShieldCheck, Clock, AlertCircle, ChevronDown, ChevronUp, FileText, ExternalLink } from "lucide-react";

type KycRecord = Record<string, string>;

const statusBadge = (status: string) => {
  if (status === "approved") return "bg-emerald-500/10 text-emerald-600";
  if (status === "rejected") return "bg-red-500/10 text-red-600";
  return "bg-amber-500/10 text-amber-600";
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "approved") return <ShieldCheck className="w-3.5 h-3.5" />;
  if (status === "rejected") return <X className="w-3.5 h-3.5" />;
  return <Clock className="w-3.5 h-3.5" />;
};

function isPdf(src: string) {
  return src?.startsWith("data:application/pdf");
}

function openInNewTab(dataUrl: string) {
  const blob = dataUrl.startsWith("data:application/pdf")
    ? new Blob([Uint8Array.from(atob(dataUrl.split(",")[1]), c => c.charCodeAt(0))], { type: "application/pdf" })
    : null;
  const url = blob ? URL.createObjectURL(blob) : dataUrl;
  window.open(url, "_blank");
}

function IDImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1.5 text-sm font-sans">
          <X className="w-4 h-4" /> Close
        </button>
        {isPdf(src) ? (
          <embed src={src} type="application/pdf" className="w-full h-[80vh] bg-stone-900" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="ID Document" className="w-full max-h-[80vh] object-contain bg-stone-900" />
        )}
      </div>
    </div>
  );
}

export function KycAdminClient({ initialRecords }: { initialRecords: KycRecord[] }) {
  const [records, setRecords] = useState<KycRecord[]>(initialRecords);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch("/api/kyc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setUpdatingId(null);
  };

  const filtered = filter === "all" ? records : records.filter(r => r.status === filter);

  return (
    <>
      {previewImg && <IDImageModal src={previewImg} onClose={() => setPreviewImg(null)} />}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-wide transition-colors ${filter === f ? "bg-charcoal text-ivory dark:bg-ivory dark:text-charcoal" : "bg-white dark:bg-[#121212] border border-stone-200 dark:border-stone-800 text-charcoal/50 dark:text-ivory/50 hover:text-charcoal dark:hover:text-ivory"}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-16 text-center">
          <ShieldCheck className="w-8 h-8 text-charcoal/20 mx-auto mb-4" />
          <p className="text-sm font-sans text-charcoal/40">No {filter !== "all" ? filter : ""} KYC submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rec) => {
            const isExpanded = expandedId === rec.id;
            return (
              <div key={rec.id} className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-4 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory">{rec.name}</p>
                      <span className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-sans font-medium tracking-wide uppercase ${statusBadge(rec.status)}`}>
                        <StatusIcon status={rec.status} />{rec.status}
                      </span>
                      {rec.ref_agent_code && (
                        <span className="px-2 py-0.5 text-[9px] font-mono font-medium bg-gold-500/10 text-gold-600">{rec.ref_agent_code}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-sans text-charcoal/50">
                      <span>{rec.phone}</span>
                      {rec.email && <span>{rec.email}</span>}
                      {rec.property_name && <span>📍 {rec.property_name}</span>}
                      {rec.checkin_date && <span>Check-in: {new Date(rec.checkin_date).toLocaleDateString("en-IN")}</span>}
                      <span>{rec.id_type} · {rec.id_number}</span>
                      <span>{rec.created_at ? new Date(rec.created_at).toLocaleDateString("en-IN") : "—"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {rec.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(rec.id, "approved")} disabled={updatingId === rec.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-sans font-medium uppercase tracking-wide transition-colors disabled:opacity-50">
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => updateStatus(rec.id, "rejected")} disabled={updatingId === rec.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-sans font-medium uppercase tracking-wide transition-colors disabled:opacity-50">
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {rec.status !== "pending" && (
                      <button onClick={() => updateStatus(rec.id, "pending")}
                        className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 text-xs font-sans text-charcoal/40 hover:text-charcoal uppercase tracking-wide transition-colors">
                        Reset
                      </button>
                    )}
                    <button onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      className="p-1.5 text-charcoal/30 hover:text-charcoal transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded: ID images */}
                {isExpanded && (
                  <div className="border-t border-stone-100 dark:border-stone-900 px-5 py-5 bg-stone-50/50 dark:bg-stone-900/20">
                    <div className="grid grid-cols-2 gap-4">
                      {rec.id_front ? (
                        <div>
                          <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 mb-2">ID Front</p>
                          {isPdf(rec.id_front) ? (
                            <div className="flex flex-col items-center justify-center h-32 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 gap-2 cursor-pointer group" onClick={() => openInNewTab(rec.id_front)}>
                              <FileText className="w-8 h-8 text-charcoal/30 group-hover:text-gold-500 transition-colors" />
                              <span className="text-xs font-sans text-charcoal/40 group-hover:text-charcoal transition-colors flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> PDF kholen
                              </span>
                            </div>
                          ) : (
                            <div className="relative group cursor-pointer" onClick={() => setPreviewImg(rec.id_front)}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={rec.id_front} alt="ID Front" className="w-full h-32 object-cover border border-stone-200 dark:border-stone-800" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 border border-dashed border-stone-200 dark:border-stone-800">
                          <div className="text-center">
                            <AlertCircle className="w-5 h-5 text-charcoal/20 mx-auto mb-1" />
                            <p className="text-xs font-sans text-charcoal/30">No front image</p>
                          </div>
                        </div>
                      )}
                      {rec.id_back ? (
                        <div>
                          <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 mb-2">ID Back</p>
                          {isPdf(rec.id_back) ? (
                            <div className="flex flex-col items-center justify-center h-32 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 gap-2 cursor-pointer group" onClick={() => openInNewTab(rec.id_back)}>
                              <FileText className="w-8 h-8 text-charcoal/30 group-hover:text-gold-500 transition-colors" />
                              <span className="text-xs font-sans text-charcoal/40 group-hover:text-charcoal transition-colors flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> PDF kholen
                              </span>
                            </div>
                          ) : (
                            <div className="relative group cursor-pointer" onClick={() => setPreviewImg(rec.id_back)}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={rec.id_back} alt="ID Back" className="w-full h-32 object-cover border border-stone-200 dark:border-stone-800" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 border border-dashed border-stone-200 dark:border-stone-800">
                          <p className="text-xs font-sans text-charcoal/30">No back image uploaded</p>
                        </div>
                      )}
                    </div>
                    {rec.guest_count && (
                      <p className="text-xs font-sans text-charcoal/50 mt-3">
                        Guests: <span className="font-medium text-charcoal dark:text-ivory">{rec.guest_count}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
