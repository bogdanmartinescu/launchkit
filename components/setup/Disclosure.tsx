"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useWizardTheme } from "./WizardTheme";

/**
 * Collapsible disclosure used to implement the Essentials / Common / Advanced
 * tiers from CLAUDE.md §9.1. Defaults to collapsed; clicking the summary toggles
 * the inner panel. Keyboard-accessible: uses a native <details> element semantic
 * via a button + aria-expanded.
 */
export function Disclosure({
  label,
  children,
  tone = "common",
  defaultOpen = false,
}: {
  label: string;
  children: ReactNode;
  tone?: "common" | "advanced";
  defaultOpen?: boolean;
}) {
  const theme = useWizardTheme();
  const [open, setOpen] = useState(defaultOpen);
  const toneLabel = tone === "advanced" ? "Advanced" : "More options";

  return (
    <div
      className="rounded-xl"
      style={{
        border: `1px solid ${theme.cardBorder}`,
        background: tone === "advanced" ? "transparent" : theme.cardBg,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left min-h-11"
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: tone === "advanced" ? theme.subtle : "var(--brand-primary)" }}
          >
            {toneLabel}
          </span>
          <span className="text-sm font-medium" style={{ color: theme.text }}>
            {label}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform flex-shrink-0"
          style={{
            color: theme.muted,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <div
          className="px-4 pb-4 pt-1 space-y-4"
          style={{ borderTop: `1px solid ${theme.cardBorder}` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
