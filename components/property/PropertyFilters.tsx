"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, ChevronDown, X } from "lucide-react";
import { BEDROOM_OPTIONS, AMENITY_OPTIONS, TYPE_OPTIONS } from "@/lib/property-filters";

interface Props {
  destinations: { city: string; state: string; count: number }[];
  counts: {
    beds: Record<string, number>;
    amenities: Record<string, number>;
    types: Record<string, number>;
  };
}

const KEYS = ["city", "beds", "amenities", "types"] as const;

export function PropertyFilters({ destinations, counts }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destQuery, setDestQuery] = useState("");
  const [showAllDest, setShowAllDest] = useState(false);

  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : []);

  function toggle(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    const cur = list(key);
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    if (next.length) params.set(key, next.join(","));
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  }

  function clearAll() {
    const params = new URLSearchParams(sp.toString());
    KEYS.forEach((k) => params.delete(k));
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  }

  const activeCount = KEYS.reduce((n, k) => n + list(k).length, 0);

  const visibleDest = destinations
    .filter((d) => d.city.toLowerCase().includes(destQuery.toLowerCase()))
    .sort((a, b) => b.count - a.count);
  const shownDest = showAllDest || destQuery ? visibleDest : visibleDest.slice(0, 6);

  const Option = ({
    group,
    value,
    label,
    count,
  }: {
    group: string;
    value: string;
    label: string;
    count: number;
  }) => (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={list(group).includes(value)}
        onChange={() => toggle(group, value)}
        className="w-4 h-4 rounded border-stone-300 text-gold-500 focus:ring-gold-500 accent-[#C8911A]"
      />
      <span className="flex-1 text-sm font-sans text-charcoal/80 dark:text-ivory/80 group-hover:text-gold-600">
        {label}
      </span>
      <span className="text-xs font-sans text-charcoal/40 dark:text-ivory/40">({count})</span>
    </label>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <details open className="group border-t border-stone-200/70 dark:border-stone-800 first:border-t-0 py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none font-serif text-[15px] text-charcoal dark:text-ivory">
        {title}
        <ChevronDown className="w-4 h-4 text-charcoal/50 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );

  const panel = (
    <div className="bg-white dark:bg-[#121212] rounded-2xl border border-stone-200/70 dark:border-stone-800 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4">
        <span className="flex items-center gap-2 font-serif text-lg text-charcoal dark:text-ivory">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </span>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs font-sans text-gold-600 hover:underline">
            Clear All
          </button>
        )}
      </div>

      <Section title="Destination">
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            value={destQuery}
            onChange={(e) => setDestQuery(e.target.value)}
            placeholder="Search destination..."
            className="w-full pl-8 pr-3 py-2 text-sm font-sans rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent text-charcoal dark:text-ivory focus:outline-none focus:border-gold-500"
          />
        </div>
        {shownDest.map((d) => (
          <Option key={d.city} group="city" value={d.city} label={d.city} count={d.count} />
        ))}
        {!destQuery && visibleDest.length > 6 && (
          <button
            onClick={() => setShowAllDest((s) => !s)}
            className="mt-1 text-xs font-sans text-gold-600 hover:underline"
          >
            {showAllDest ? "Show less" : `+ Show more (${visibleDest.length - 6})`}
          </button>
        )}
      </Section>

      <Section title="Bedrooms">
        {BEDROOM_OPTIONS.map((o) => (
          <Option key={o.key} group="beds" value={o.key} label={o.label} count={counts.beds[o.key]} />
        ))}
      </Section>

      <Section title="Amenities">
        {AMENITY_OPTIONS.map((o) => (
          <Option key={o.key} group="amenities" value={o.key} label={o.label} count={counts.amenities[o.key]} />
        ))}
      </Section>

      <Section title="Property Type">
        {TYPE_OPTIONS.filter((o) => counts.types[o.key] > 0).map((o) => (
          <Option key={o.key} group="types" value={o.key} label={o.label} count={counts.types[o.key]} />
        ))}
      </Section>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#121212] text-sm font-sans text-charcoal dark:text-ivory"
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters{activeCount > 0 && ` (${activeCount})`}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{panel}</div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-[88%] max-w-sm h-full overflow-y-auto bg-[#faf9f7] dark:bg-[#0a0a0a] p-4">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="pt-10">{panel}</div>
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-4 w-full py-3 rounded-lg bg-gold-500 text-white text-sm font-sans font-medium"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
