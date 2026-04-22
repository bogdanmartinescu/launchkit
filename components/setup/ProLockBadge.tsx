"use client";

import { Lock } from "lucide-react";

/**
 * Small lock-icon pill used to mark PRO-only options on FREE builds.
 * Per CLAUDE.md §9 we prefer showing the option (locked) to hiding it so users
 * know what they'd unlock.
 */
export function ProLockBadge({
  className = "",
  label = "PRO",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 px-1.5 py-0.5 rounded ${className}`}
      style={{
        color: "var(--brand-primary)",
        background: "color-mix(in srgb, var(--brand-primary) 15%, transparent)",
      }}
    >
      <Lock className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}
