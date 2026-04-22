"use client";

import { Check } from "lucide-react";
import type { CatalogEntry } from "@/lib/integrations/catalog";
import { ProLockBadge } from "./ProLockBadge";
import { useWizardTheme } from "./WizardTheme";

/**
 * Single provider pick tile. PRO providers render disabled + lock-badged so
 * users see what they'd gain by upgrading without the card being hidden.
 */
export function ProviderCard({
  provider,
  selected,
  onSelect,
}: {
  provider: CatalogEntry;
  selected: boolean;
  onSelect: () => void;
}) {
  const theme = useWizardTheme();
  const locked = provider.edition === "pro";
  const borderColor = selected ? "var(--brand-primary)" : theme.cardBorder;
  const background = selected
    ? "color-mix(in srgb, var(--brand-primary) 10%, transparent)"
    : "transparent";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked}
      aria-pressed={selected}
      aria-label={`${provider.displayName}${locked ? " — PRO only" : ""}`}
      className="relative text-left rounded-xl px-3 py-2.5 transition-all disabled:cursor-not-allowed"
      style={{
        border: `1px solid ${borderColor}`,
        background,
        opacity: locked ? 0.55 : 1,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold" style={{ color: theme.text }}>
          {provider.displayName}
        </span>
        {locked && <ProLockBadge className="ml-auto" />}
        {selected && !locked && (
          <Check
            className="w-3.5 h-3.5 ml-auto"
            style={{ color: "var(--brand-primary)" }}
          />
        )}
      </div>
      <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.subtle }}>
        {provider.description}
      </p>
      {provider.requiredEnv.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {provider.requiredEnv.map((env) => (
            <code
              key={env}
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{
                background: "rgba(120,120,140,0.12)",
                color: theme.muted,
              }}
            >
              {env}
            </code>
          ))}
        </div>
      )}
    </button>
  );
}
