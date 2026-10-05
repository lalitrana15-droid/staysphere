"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-white border border-stone-300 text-[#1a1a1a] text-xs font-sans font-medium tracking-widest uppercase px-4 py-2.5 hover:bg-stone-50 transition-colors"
    >
      Print / Save PDF
    </button>
  );
}
