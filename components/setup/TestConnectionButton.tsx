"use client";

import { useState } from "react";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import type { IntegrationKind } from "@/lib/integrations/types";
import { useWizardTheme } from "./WizardTheme";

type TestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; message?: string }
  | { status: "error"; message: string; missingEnv?: string[] };

/**
 * Runs POST /api/admin/test-integration against the selected provider and
 * displays the result inline. Wired into {@link ProviderPickerGroup}.
 */
export function TestConnectionButton({
  kind,
  id,
}: {
  kind: IntegrationKind;
  id: string;
}) {
  const theme = useWizardTheme();
  const [state, setState] = useState<TestState>({ status: "idle" });

  const run = async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/admin/test-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState({ status: "ok", message: data.message });
      } else {
        setState({
          status: "error",
          message: data.error ?? data.message ?? "Connection failed.",
          missingEnv: data.missingEnv,
        });
      }
    } catch {
      setState({ status: "error", message: "Network error." });
    }
  };

  return (
    <div className="flex items-start gap-2 pt-1">
      <button
        type="button"
        onClick={run}
        disabled={state.status === "loading"}
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors hover:opacity-80 disabled:opacity-60 min-h-8"
        style={{
          background: "transparent",
          border: `1px solid ${theme.cardBorder}`,
          color: theme.muted,
        }}
      >
        {state.status === "loading" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : state.status === "ok" ? (
          <Wifi className="w-3 h-3" style={{ color: "#22c55e" }} />
        ) : state.status === "error" ? (
          <WifiOff className="w-3 h-3" style={{ color: "#ef4444" }} />
        ) : (
          <Wifi className="w-3 h-3" />
        )}
        Test connection
      </button>
      {state.status === "ok" && state.message && (
        <span className="text-xs pt-1.5" style={{ color: theme.subtle }}>
          {state.message}
        </span>
      )}
      {state.status === "error" && (
        <span className="text-xs pt-1.5" style={{ color: "#ef4444" }}>
          {state.message}
          {state.missingEnv && state.missingEnv.length > 0 && (
            <>
              {" "}
              <span style={{ color: theme.subtle }}>
                (missing: {state.missingEnv.join(", ")})
              </span>
            </>
          )}
        </span>
      )}
    </div>
  );
}
