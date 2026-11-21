"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/property-filters";

export function ListingToolbar({ sort, view }: { sort: string; view: "grid" | "list" }) {
  const router = useRouter();
  const sp = useSearchParams();

  function set(key: string, value: string, defaultValue: string) {
    const params = new URLSearchParams(sp.toString());
    if (value === defaultValue) params.delete(key);
    else params.set(key, value);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  }

  const btn = (active: boolean) =>
    `w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
      active
        ? "bg-gold-100 border-gold-400 text-gold-700"
        : "bg-white dark:bg-[#121212] border-stone-200 dark:border-stone-700 text-charcoal/60 dark:text-ivory/60 hover:border-gold-400"
    }`;

  return (
    <div className="flex items-center gap-3">
      <label className="hidden sm:flex items-center gap-2 text-sm font-sans text-charcoal/60 dark:text-ivory/60">
        Sort by:
        <select
          value={sort}
          onChange={(e) => set("sort", e.target.value, "recommended")}
          className="px-3 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#121212] text-sm text-charcoal dark:text-ivory focus:outline-none focus:border-gold-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <button onClick={() => set("view", "grid", "grid")} aria-label="Grid view" className={btn(view === "grid")}>
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button onClick={() => set("view", "list", "grid")} aria-label="List view" className={btn(view === "list")}>
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
