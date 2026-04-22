"use client";

import type { ReactNode } from "react";
import { useWizardTheme } from "./WizardTheme";

/**
 * Wizard card wrapper with a brand-primary label strip. Used to group related
 * fields inside a step (e.g. "Brand Colors", "Logo", "Integrations").
 */
export function Section({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  const theme = useWizardTheme();
  return (
    <div className="rounded-2xl p-5 sm:p-6 space-y-4" style={theme.glassCard}>
      <div className="space-y-1">
        <p
          className="font-heading font-semibold text-sm uppercase tracking-wide"
          style={{ color: "var(--brand-primary)" }}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
