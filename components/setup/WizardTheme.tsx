"use client";

import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Wizard-local theme palette.
 *
 * The /setup wizard lets the user preview their site in dark or light before
 * saving. Rather than prop-drilling eight colour values through every sub-
 * component, each primitive reads from this context. The provider lives once
 * at the top of {@link SetupPage} and re-computes the palette whenever the
 * previewed theme toggle changes.
 */
export interface WizardPalette {
  page: string;
  text: string;
  muted: string;
  subtle: string;
  cardBg: string;
  cardBorder: string;
  inputStyle: CSSProperties;
  glassCard: CSSProperties;
  isLight: boolean;
}

const WizardThemeCtx = createContext<WizardPalette | null>(null);

export function WizardThemeProvider({
  theme,
  children,
}: {
  theme: "dark" | "light";
  children: ReactNode;
}) {
  const value = useMemo<WizardPalette>(() => {
    const isLight = theme === "light";
    const page = isLight ? "#f8fafc" : "#0a0f1e";
    const text = isLight ? "#0f172a" : "#f8fafc";
    const muted = isLight ? "#64748b" : "#94a3b8";
    const subtle = isLight ? "#94a3b8" : "#475569";
    const cardBg = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
    const cardBorder = isLight
      ? "rgba(0,0,0,0.08)"
      : "rgba(255,255,255,0.08)";
    return {
      page,
      text,
      muted,
      subtle,
      cardBg,
      cardBorder,
      isLight,
      inputStyle: { background: cardBg, borderColor: cardBorder, color: text },
      glassCard: {
        background: cardBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${cardBorder}`,
      },
    };
  }, [theme]);

  return (
    <WizardThemeCtx.Provider value={value}>{children}</WizardThemeCtx.Provider>
  );
}

export function useWizardTheme(): WizardPalette {
  const ctx = useContext(WizardThemeCtx);
  if (!ctx) {
    throw new Error("useWizardTheme must be used inside <WizardThemeProvider>");
  }
  return ctx;
}
