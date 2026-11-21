"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ReadMore({ text, lines = 5 }: { text: string; lines?: number }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 380;
  return (
    <div>
      <p
        className="font-sans text-[15px] text-charcoal/75 dark:text-ivory/75 leading-relaxed whitespace-pre-line"
        style={
          !open && long
            ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }
            : undefined
        }
      >
        {text}
      </p>
      {long && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-sans font-medium text-gold-600 dark:text-gold-400 hover:underline"
        >
          {open ? "Read less" : "Read more"}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
