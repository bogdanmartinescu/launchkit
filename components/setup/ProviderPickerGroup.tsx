"use client";

import { Label } from "@/components/ui/label";
import { listProviders } from "@/lib/integrations/catalog";
import type { IntegrationKind } from "@/lib/integrations/types";
import { ProviderCard } from "./ProviderCard";
import { TestConnectionButton } from "./TestConnectionButton";
import { useWizardTheme } from "./WizardTheme";

/**
 * Grid of ProviderCard tiles for a given integration kind, plus a live
 * Test-connection button once a FREE provider is selected. PRO tiles are
 * rendered locked; clicking them is a no-op.
 */
export function ProviderPickerGroup({
  label,
  kind,
  value,
  onChange,
}: {
  label: string;
  kind: IntegrationKind;
  value: string;
  onChange: (id: string) => void;
}) {
  const theme = useWizardTheme();
  const providers = listProviders(kind);
  const freeCount = providers.filter((p) => p.edition === "free").length;
  const proCount = providers.filter((p) => p.edition === "pro").length;
  const selected = providers.find((p) => p.id === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium" style={{ color: theme.muted }}>
          {label}
        </Label>
        <span
          className="text-[10px] uppercase tracking-wider"
          style={{ color: theme.subtle }}
        >
          {freeCount} free · {proCount} pro
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            selected={value === provider.id}
            onSelect={() => {
              if (provider.edition === "free") onChange(provider.id);
            }}
          />
        ))}
      </div>

      {value && selected?.edition === "free" && (
        <TestConnectionButton kind={kind} id={value} />
      )}
    </div>
  );
}
