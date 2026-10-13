"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export function AgentLoginForm() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    router.push(`/agent/${trimmed}`);
  };

  return (
    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-8 md:p-10">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-2">
          Agent Login
        </h2>
        <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50">
          Enter your agent code to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 mb-2">
            Your Agent Code
          </label>
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="e.g. AGT-RAHUL-001"
            required
            className="input-luxury text-sm w-full"
          />
        </div>

        <button
          type="submit"
          disabled={!code.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-charcoal dark:bg-ivory text-ivory dark:text-charcoal text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:bg-gold-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogIn className="w-4 h-4" />
          Access Dashboard
        </button>
      </form>
    </div>
  );
}
