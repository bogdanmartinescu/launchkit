"use client";

import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { useWizardTheme } from "./WizardTheme";

/**
 * Label + field wrapper with consistent spacing and muted-label styling.
 * Required fields get a brand-primary asterisk.
 */
export function FieldGroup({
  label,
  hint,
  children,
  required,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  const theme = useWizardTheme();
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-sm font-medium" style={{ color: theme.muted }}>
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "var(--brand-primary)" }}>
            *
          </span>
        )}
      </Label>
      {children}
      {hint && (
        <p className="text-[11px] leading-relaxed" style={{ color: theme.subtle }}>
          {hint}
        </p>
      )}
    </div>
  );
}
