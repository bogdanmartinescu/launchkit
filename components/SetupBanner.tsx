"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, X, ArrowRight } from "lucide-react";

export function SetupBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-lg px-4">
      <div className="relative flex items-center gap-4 rounded-2xl border border-[var(--brand-primary)]/40 bg-[#0d1221]/95 backdrop-blur-xl px-4 py-3.5 shadow-2xl shadow-black/60">
        {/* Left glow accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: `linear-gradient(to bottom, var(--brand-primary), var(--brand-accent))` }}
        />

        <div
          className="w-8 h-8 rounded-xl border border-[var(--brand-primary)]/30 flex items-center justify-center flex-shrink-0 ml-1"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 20%, transparent), color-mix(in srgb, var(--brand-accent) 20%, transparent))`,
          }}
        >
          <Settings
            className="w-4 h-4 text-[var(--brand-primary)]"
            style={{ animation: "spin 4s linear infinite" }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-none mb-0.5">
            Template not configured
          </p>
          <p className="text-slate-400 text-xs leading-snug truncate">
            Set your product, colors &amp; integrations in the wizard.
          </p>
        </div>

        <Link
          href="/setup"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-lg whitespace-nowrap flex-shrink-0 hover:opacity-95"
          style={{
            background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
            boxShadow: `0 8px 20px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
          }}
        >
          Configure
          <ArrowRight className="w-3 h-3" />
        </Link>

        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
