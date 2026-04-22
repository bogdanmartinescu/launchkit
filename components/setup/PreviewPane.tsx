"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, RefreshCw, X } from "lucide-react";
import { useWizardTheme } from "./WizardTheme";
import { isPro } from "@/lib/edition";

/**
 * Desktop-only iframe preview of the landing page.
 *
 * Behaviour:
 *   - Hidden below lg: breakpoint (preview only renders ≥1024px).
 *   - On open, loads `/` in an iframe.
 *   - Re-renders on `refreshKey` bumps (called after save) via a cache-busting
 *     query string so config changes show up immediately.
 *   - Sends wizard state to the iframe via postMessage. In FREE the iframe is
 *     just `/` and ignores those messages (content updates require a save +
 *     dev-server restart). In PRO the /preview route consumes the messages
 *     for true live preview. We wire both sides now so flipping the PRO flag
 *     is a one-line change.
 *
 * This component MUST be a client component and consume {@link useWizardTheme}
 * so colours stay in sync with the wizard's theme toggle.
 */
export function PreviewPane({
  state,
  refreshKey,
  open,
  onClose,
}: {
  state: unknown;
  refreshKey: number;
  open: boolean;
  onClose: () => void;
}) {
  const theme = useWizardTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const pro = isPro();

  const previewSrc = pro ? `/preview?v=${refreshKey}` : `/?v=${refreshKey}`;

  useEffect(() => {
    if (!open || !iframeReady) return;
    const target = iframeRef.current?.contentWindow;
    if (!target) return;
    try {
      target.postMessage(
        { type: "launchkit:wizard-state", state },
        window.location.origin
      );
    } catch {
      // Cross-origin iframe — silently ignore. Relevant in PRO with a separate
      // /preview deployment; in FREE this is same-origin and always succeeds.
    }
  }, [state, open, iframeReady, refreshKey]);

  if (!open) return null;

  return (
    <aside
      className="hidden lg:flex fixed top-0 right-0 z-40 h-svh w-[min(40vw,560px)] flex-col shadow-2xl"
      style={{
        background: theme.page,
        borderLeft: `1px solid ${theme.cardBorder}`,
      }}
      aria-label="Live preview"
    >
      <header
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: "var(--brand-primary)" }}
          >
            {pro ? "Live preview" : "Preview"}
          </span>
          <span
            className="text-xs truncate"
            style={{ color: theme.muted }}
          >
            {pro
              ? "Updates as you type"
              : "Refreshes on save — live edits are a PRO feature"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const el = iframeRef.current;
              if (el) el.src = previewSrc;
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: theme.muted }}
            aria-label="Refresh preview"
            title="Refresh preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: theme.muted }}
            aria-label="Open in new tab"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: theme.muted }}
            aria-label="Close preview"
            title="Close preview"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>
      <iframe
        ref={iframeRef}
        key={refreshKey}
        src={previewSrc}
        title="Landing page preview"
        className="flex-1 w-full border-0"
        onLoad={() => setIframeReady(true)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </aside>
  );
}
