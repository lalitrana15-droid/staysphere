"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, Check, AlertCircle, ShieldCheck, X, FileText, Share2, Copy, MessageCircle, Users, ChevronDown, ChevronUp } from "lucide-react";

const ID_TYPES = ["Aadhaar Card", "PAN Card", "Passport", "Driver's License", "Voter ID"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function IDUploadBox({ label, value, onChange }: { label: string; value: string; onChange: (b64: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [sizeError, setSizeError] = useState<string>("");

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setSizeError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum 2 MB allowed.`);
      if (ref.current) ref.current.value = "";
      return;
    }
    setSizeError("");
    const b64 = await fileToBase64(file);
    setPreview(b64);
    setFileName(file.name);
    onChange(b64);
  };

  const clear = () => { setPreview(""); setFileName(""); setSizeError(""); onChange(""); if (ref.current) ref.current.value = ""; };
  const isPdf = preview.startsWith("data:application/pdf");

  return (
    <div>
      <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 mb-2">{label}</p>
      {sizeError && (
        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 px-3 py-2 mb-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] font-sans text-red-600 dark:text-red-400">{sizeError}</p>
        </div>
      )}
      {preview ? (
        <div className="relative border border-gold-500/30 overflow-hidden">
          {isPdf ? (
            <div className="w-full h-36 bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-gold-500" />
              <span className="text-xs font-sans text-charcoal/60 dark:text-ivory/60 text-center px-2 truncate max-w-full">{fileName}</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={label} className="w-full h-36 object-cover" />
          )}
          <button type="button" onClick={clear} className="absolute top-2 right-2 w-7 h-7 bg-black/60 flex items-center justify-center text-white hover:bg-black transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-emerald-500 px-2 py-1">
            <Check className="w-3 h-3 text-white" />
            <span className="text-[9px] text-white font-sans font-medium uppercase tracking-wide">Uploaded</span>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className="w-full h-28 border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center gap-2 hover:border-gold-400 hover:bg-gold-50/30 transition-all group">
          <Upload className="w-5 h-5 text-charcoal/30 group-hover:text-gold-500 transition-colors" />
          <span className="text-xs font-sans text-charcoal/40 group-hover:text-charcoal/60">Click to upload</span>
          <span className="text-[10px] font-sans text-charcoal/30">JPG · PNG · PDF · max 2 MB</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/jpg,application/pdf" onChange={handleFile} className="hidden" />
    </div>
  );
}

type AdditionalGuest = {
  name: string;
  idType: string;
  idFront: string;
  idBack: string;
};

function AdditionalGuestSection({
  index, guest, onChange,
}: {
  index: number;
  guest: AdditionalGuest;
  onChange: (g: AdditionalGuest) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-stone-200 dark:border-stone-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gold-500" />
          <span className="text-sm font-sans font-medium text-charcoal dark:text-ivory">Guest {index + 2}</span>
          {guest.name && <span className="text-xs font-sans text-charcoal/50">— {guest.name}</span>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
      </button>

      {open && (
        <div className="px-4 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={guest.name}
                onChange={e => onChange({ ...guest, name: e.target.value })}
                placeholder="As on their ID"
                className="input-luxury text-sm w-full"
              />
            </div>
            <div>
              <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
                ID Type
              </label>
              <select
                value={guest.idType}
                onChange={e => onChange({ ...guest, idType: e.target.value })}
                className="input-luxury text-sm w-full"
              >
                <option value="">— Select ID type —</option>
                {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <IDUploadBox
              label="ID Front *"
              value={guest.idFront}
              onChange={v => onChange({ ...guest, idFront: v })}
            />
            <IDUploadBox
              label="ID Back (optional)"
              value={guest.idBack}
              onChange={v => onChange({ ...guest, idBack: v })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function KycForm() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const customerId = searchParams.get("customer") || "";
  const prefilledProperty = searchParams.get("property") || "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [propertyName, setPropertyName] = useState(prefilledProperty);
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [idFront, setIdFront] = useState("");
  const [idBack, setIdBack] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");

  // Additional guests
  const [addAllGuests, setAddAllGuests] = useState<boolean | null>(null);
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>([]);

  // Share panel
  const [showShare, setShowShare] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Sync additional guests count when guestCount or addAllGuests changes
  useEffect(() => {
    if (addAllGuests) {
      const n = Math.max(0, parseInt(guestCount) - 1);
      setAdditionalGuests(prev => {
        if (prev.length < n) return [...prev, ...Array.from({ length: n - prev.length }, () => ({ name: "", idType: "", idFront: "", idBack: "" }))];
        return prev.slice(0, n);
      });
    }
  }, [guestCount, addAllGuests]);

  const handleGuestCountChange = (val: string) => {
    setGuestCount(val);
    if (parseInt(val) <= 1) { setAddAllGuests(null); setAdditionalGuests([]); }
  };

  const updateGuest = (i: number, g: AdditionalGuest) => {
    setAdditionalGuests(prev => prev.map((p, idx) => idx === i ? g : p));
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const waShareText = `Please complete your identity verification (KYC) before check-in${propertyName ? ` at *${propertyName}*` : ""}:\n\n${shareUrl}\n\nThis is required for your stay. Thank you!`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !idType || !idNumber || !idFront) {
      setError("Please fill all required fields and upload at least the front of your ID.");
      return;
    }
    setError("");
    setLoading(true);

    const base = {
      property_name: propertyName,
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      guest_count: guestCount,
      ref_agent_code: refCode || null,
      customer_id: customerId || null,
    };

    // Primary guest
    const res = await fetch("/api/kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...base, name, phone, email, id_type: idType, id_number: idNumber, id_front: idFront, id_back: idBack }),
    });
    const data = await res.json();

    // Additional guests
    if (addAllGuests && additionalGuests.length > 0) {
      for (const g of additionalGuests) {
        if (g.name && g.idFront) {
          await fetch("/api/kyc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...base, name: g.name, phone: "", email: "", id_type: g.idType || "Other", id_number: "-", id_front: g.idFront, id_back: g.idBack }),
          });
        }
      }
    }

    setLoading(false);
    if (data.success) {
      setSuccess(true);
      setRef(data.ref);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-[#121212] border border-stone-200 dark:border-stone-800 p-10 text-center max-w-md mx-auto">
        <div className="w-14 h-14 bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-3">KYC Submitted</h2>
        <p className="text-sm font-sans text-charcoal/60 dark:text-ivory/60 mb-5">
          Your identity verification has been submitted and is under review. You will hear back before your check-in.
        </p>
        {ref && (
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-3 mb-5">
            <p className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/40 mb-1">Your Reference</p>
            <p className="font-mono text-sm text-charcoal dark:text-ivory">{ref}</p>
          </div>
        )}
        <p className="text-xs font-sans text-charcoal/40">Keep this reference number for any queries.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121212] border border-stone-200 dark:border-stone-800 p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-5 h-5 text-gold-500" />
          <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory">Guest KYC Verification</h2>
        </div>
        <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50">
          Complete your identity verification before check-in. All data is stored securely.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 mb-6">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-sans text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Personal Details */}
      <div className="mb-6">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4">Personal Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="As on your ID"
              className="input-luxury text-sm w-full" />
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input value={phone} onChange={e => setPhone(e.target.value)} required placeholder="10-digit mobile number"
              className="input-luxury text-sm w-full" />
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Optional"
              className="input-luxury text-sm w-full" />
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
              Number of Guests
            </label>
            <select value={guestCount} onChange={e => handleGuestCountChange(e.target.value)} className="input-luxury text-sm w-full">
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="mb-6">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4">Stay Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
              Property / Villa Name
              {prefilledProperty && <span className="ml-2 text-emerald-600 normal-case tracking-normal">✓ Pre-filled by your agent</span>}
            </label>
            <input
              value={propertyName}
              onChange={e => !prefilledProperty && setPropertyName(e.target.value)}
              readOnly={!!prefilledProperty}
              placeholder="e.g. Mandovar Mountain Valley Retreat"
              className={`input-luxury text-sm w-full ${prefilledProperty ? "bg-stone-100 dark:bg-stone-800 text-charcoal/70 dark:text-ivory/70 cursor-not-allowed" : ""}`}
            />
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">Check-in Date</label>
            <input value={checkinDate} onChange={e => setCheckinDate(e.target.value)} type="date" className="input-luxury text-sm w-full" />
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">Check-out Date</label>
            <input value={checkoutDate} onChange={e => setCheckoutDate(e.target.value)} type="date" className="input-luxury text-sm w-full" />
          </div>
        </div>
      </div>

      {/* Primary Guest ID Verification */}
      <div className="mb-6">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-4">
          Identity Verification {parseInt(guestCount) > 1 && <span className="normal-case text-charcoal/40 dark:text-ivory/40 tracking-normal text-[11px]">— Primary Guest</span>}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
              ID Type <span className="text-red-500">*</span>
            </label>
            <select value={idType} onChange={e => setIdType(e.target.value)} required className="input-luxury text-sm w-full">
              <option value="">— Select ID type —</option>
              {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 block mb-1.5">
              ID Number <span className="text-red-500">*</span>
            </label>
            <input value={idNumber} onChange={e => setIdNumber(e.target.value)} required placeholder="e.g. XXXX XXXX XXXX"
              className="input-luxury text-sm w-full" />
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 px-4 py-3 mb-4 flex items-start gap-2.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] font-sans text-amber-600/80 dark:text-amber-500/80 leading-relaxed">
            Accepted: <span className="font-medium">JPG, PNG, PDF</span> · Max <span className="font-medium">2 MB</span> per file · Please upload a clear, readable photo of your government-issued ID.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <IDUploadBox label="ID Front *" value={idFront} onChange={setIdFront} />
          <IDUploadBox label="ID Back (optional)" value={idBack} onChange={setIdBack} />
        </div>
      </div>

      {/* Add all guests ID section */}
      {parseInt(guestCount) > 1 && (
        <div className="mb-6">
          <div className="border border-stone-200 dark:border-stone-800 p-5">
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-sans font-medium text-charcoal dark:text-ivory mb-1">
                  Add ID verification for all {guestCount} guests?
                </p>
                <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50">
                  You can submit IDs for all guests now, or each guest can fill this form separately using the Share button above.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setAddAllGuests(true); setShowShare(false); }}
                className={`flex-1 py-2.5 text-xs font-sans font-medium uppercase tracking-wide transition-colors border ${addAllGuests === true ? "bg-gold-500 border-gold-500 text-white" : "border-stone-200 dark:border-stone-700 text-charcoal/70 dark:text-ivory/70 hover:border-gold-400"}`}
              >
                Yes, add all {guestCount} guests
              </button>
              <button
                type="button"
                onClick={() => { setAddAllGuests(false); setAdditionalGuests([]); setShowShare(p => !p); }}
                className={`flex-1 py-2.5 text-xs font-sans font-medium uppercase tracking-wide transition-colors border flex items-center justify-center gap-1.5 ${showShare && addAllGuests === false ? "bg-emerald-500 border-emerald-500 text-white" : "border-stone-200 dark:border-stone-700 text-charcoal/70 dark:text-ivory/70 hover:border-emerald-400 hover:text-emerald-600"}`}
              >
                <Share2 className="w-3.5 h-3.5" /> Send form to other guest
              </button>
            </div>

            {/* Share panel — shown when "Send form to other guest" is clicked */}
            {showShare && addAllGuests === false && (
              <div className="mt-4 bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 p-4">
                <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-2 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Share KYC form with other guests
                </p>
                <p className="text-xs font-sans text-charcoal/50 dark:text-ivory/50 mb-3">
                  Send this link to other guests — they can fill their own KYC separately.
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-3 py-2 font-mono text-[11px] text-charcoal/60 dark:text-ivory/60 overflow-hidden text-ellipsis whitespace-nowrap">
                    {shareUrl}
                  </div>
                  <button type="button" onClick={copyShareLink}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors whitespace-nowrap">
                    {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {shareCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(waShareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-sans font-medium uppercase tracking-wide transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Send via WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Additional guest sections */}
          {addAllGuests && additionalGuests.length > 0 && (
            <div className="mt-4 space-y-3">
              {additionalGuests.map((guest, i) => (
                <AdditionalGuestSection
                  key={i}
                  index={i}
                  guest={guest}
                  onChange={g => updateGuest(i, g)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Privacy notice */}
      <div className="bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 p-4 mb-6">
        <p className="text-[10px] font-sans text-charcoal/50 dark:text-ivory/50 leading-relaxed">
          <span className="font-medium text-charcoal/70 dark:text-ivory/70">Privacy:</span> Your information is encrypted and used solely for check-in verification. We do not share your data with third parties. Images are stored securely and deleted 30 days after check-out.
        </p>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-4 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-sans text-sm font-medium uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2">
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
        ) : (
          <><ShieldCheck className="w-4 h-4" />Submit KYC{addAllGuests && additionalGuests.length > 0 ? ` for ${parseInt(guestCount)} Guests` : ""}</>
        )}
      </button>
    </form>
  );
}
