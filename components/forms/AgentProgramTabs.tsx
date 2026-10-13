"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";
import { AgentRegistrationForm } from "./AgentRegistrationForm";

function AgentLoginInline() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "invalid_code") {
      setError("This code does not exist in our system. Enter the right code.");
      // Clean URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setError(null);
    router.push(`/agent/${trimmed}`);
  };

  return (
    <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-stone-800/60 p-8 md:p-10">
      <div className="mb-8">
        <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-gold-600 dark:text-gold-400 mb-2">
          Agent Portal
        </p>
        <h2 className="font-serif text-2xl font-light text-charcoal dark:text-ivory mb-2">
          Agent Login
        </h2>
        <p className="text-sm font-sans text-charcoal/50 dark:text-ivory/50">
          Enter your agent code to access your dashboard.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 px-4 py-3 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-charcoal/50 dark:text-ivory/50 mb-2">
            Your Agent Code
          </label>
          <input
            value={code}
            onChange={e => { setCode(e.target.value); setError(null); }}
            placeholder="Enter your agent code"
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

export function AgentProgramTabs() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex border-b border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setTab("login")}
          className={`flex-1 py-3.5 text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
            tab === "login"
              ? "text-charcoal dark:text-ivory border-b-2 border-gold-500 -mb-px"
              : "text-charcoal/40 dark:text-ivory/40 hover:text-charcoal/70 dark:hover:text-ivory/70"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setTab("register")}
          className={`flex-1 py-3.5 text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-200 ${
            tab === "register"
              ? "text-charcoal dark:text-ivory border-b-2 border-gold-500 -mb-px"
              : "text-charcoal/40 dark:text-ivory/40 hover:text-charcoal/70 dark:hover:text-ivory/70"
          }`}
        >
          Register Now
        </button>
      </div>

      {/* Tab content — only rendered client-side to avoid SSR mismatch */}
      {mounted && (tab === "login" ? <AgentLoginInline /> : <AgentRegistrationForm />)}
    </div>
  );
}
