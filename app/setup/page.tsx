"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, ArrowRight, ArrowLeft, Check, Download, ExternalLink,
  Sun, Moon, Upload, Image as ImageIcon, X, Lock, Loader2, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  listProviders,
  type CatalogEntry,
} from "@/lib/integrations/catalog";
import type { IntegrationKind } from "@/lib/integrations/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type TemplateType = "ebook" | "saas" | "email-collection" | "mobile-app";
type ThemeType = "dark" | "light";

interface WizardState {
  templateType: TemplateType;
  theme: ThemeType;
  heroVariant: string;
  brand: {
    name: string;
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    productImageUrl: string;
  };
  product: {
    name: string;
    tagline: string;
    description: string;
    badge: string;
    price: number;
    originalPrice: number;
    currency: string;
    format: string;
    pages: number;
    chapters: number;
  };
  leadMagnet: { title: string; description: string; filePath: string };
  app: {
    appStoreUrl: string;
    playStoreUrl: string;
    iosRating: number;
    androidRating: number;
    iosReviewCount: number;
    androidReviewCount: number;
    downloads: string;
    category: string;
    appIconUrl: string;
  };
  integrations: {
    checkoutProvider: string;
    emailProvider: string;
    stripePublishableKey: string;
    stripePriceId: string;
    baseUrl: string;
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: "Indigo / Violet", primary: "#6366f1", accent: "#8b5cf6" },
  { label: "Blue / Cyan", primary: "#3b82f6", accent: "#06b6d4" },
  { label: "Emerald / Teal", primary: "#10b981", accent: "#14b8a6" },
  { label: "Rose / Pink", primary: "#f43f5e", accent: "#ec4899" },
  { label: "Amber / Orange", primary: "#f59e0b", accent: "#f97316" },
  { label: "Slate / Blue", primary: "#64748b", accent: "#3b82f6" },
];

const TEMPLATE_OPTIONS: Array<{
  id: TemplateType;
  label: string;
  description: string;
  emoji: string;
  bestFor: string;
}> = [
  {
    id: "ebook",
    label: "Digital Product",
    description: "Sell an ebook, PDF guide, course, or any downloadable. Includes single-price checkout, free preview email capture, and a book/file mockup.",
    emoji: "📖",
    bestFor: "Ebooks · PDFs · Templates · Courses",
  },
  {
    id: "saas",
    label: "SaaS / Software",
    description: "Launch a software product with a 3-tier pricing table, app screenshot mockup, and free trial CTA.",
    emoji: "🚀",
    bestFor: "SaaS · Apps · APIs · Developer tools",
  },
  {
    id: "email-collection",
    label: "Lead Magnet / Free",
    description: "Grow your email list with a free resource. The hero is a prominent email signup form — no price, no checkout.",
    emoji: "✉️",
    bestFor: "Newsletters · Free tools · Communities",
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    description: "Promote an iOS or Android app with store badges, phone-mockup screenshots, a 3-step onboarding flow, and an optional Premium upgrade.",
    emoji: "📱",
    bestFor: "iOS · Android · Consumer apps",
  },
];

const HERO_VARIANTS: Record<TemplateType, Array<{ id: string; label: string; description: string; preview: string }>> = {
  ebook: [
    {
      id: "split",
      label: "Classic Split",
      description: "Copy left, product mockup right. The proven conversion layout.",
      preview: "║ TEXT │ BOOK ║",
    },
    {
      id: "centered",
      label: "Centered",
      description: "Big centered headline, buttons, book mockup below. Great for bold products.",
      preview: "║ ─ TEXT ─ ║\n║ ─ BOOK ─ ║",
    },
    {
      id: "minimal",
      label: "Minimal",
      description: "Text-only left-aligned layout with a clean price block. No mockup.",
      preview: "║ TEXT    ║\n║ PRICE  ║",
    },
  ],
  saas: [
    {
      id: "centered",
      label: "Centered",
      description: "Headline centered, app screenshot below. Classic SaaS hero.",
      preview: "║ ─ TEXT ─ ║\n║ ─ APP ── ║",
    },
    {
      id: "split",
      label: "Split Layout",
      description: "Copy & CTAs left, app screenshot right. Emphasizes the product visually.",
      preview: "║ TEXT │ APP ║",
    },
  ],
  "email-collection": [
    {
      id: "centered",
      label: "Standard",
      description: "Centered headline and email form. Clean and focused on conversion.",
      preview: "║ ─ TEXT ─ ║\n║ ─ FORM ─ ║",
    },
    {
      id: "bold",
      label: "Bold Statement",
      description: "Huge full-width headline with gradient background. Maximum visual impact.",
      preview: "║ BIG TEXT ║\n║ ─ FORM ─ ║",
    },
  ],
  "mobile-app": [
    {
      id: "split",
      label: "Split + Phone",
      description: "Copy and store badges left, phone mockup right. Proven mobile-marketing layout.",
      preview: "║ TEXT │ 📱 ║",
    },
    {
      id: "centered",
      label: "Centered",
      description: "Big centered headline with store badges, phone mockup below. Maximum focus.",
      preview: "║ ─ TEXT ─ ║\n║ ── 📱 ── ║",
    },
  ],
};

const STEPS = ["Template", "Hero Style", "Product", "Branding", "Finish"];

const DEFAULT_STATE: WizardState = {
  templateType: "ebook",
  theme: "dark",
  heroVariant: "split",
  brand: {
    name: "LaunchKit",
    primaryColor: "#6366f1",
    accentColor: "#8b5cf6",
    logoUrl: "",
    productImageUrl: "",
  },
  product: {
    name: "The SaaS Launch Playbook",
    tagline: "From Zero to First 100 Customers",
    description: "A step-by-step blueprint to validate ideas, build an audience, and land paying customers — before writing a single line of code.",
    badge: "New Edition — 2025",
    price: 49,
    originalPrice: 97,
    currency: "USD",
    format: "PDF + EPUB",
    pages: 312,
    chapters: 18,
  },
  leadMagnet: {
    title: "Get Free Sample Chapter",
    description: "Enter your email and we'll send you Chapter 1 instantly.",
    filePath: "/downloads/sample.pdf",
  },
  app: {
    appStoreUrl: "",
    playStoreUrl: "",
    iosRating: 4.8,
    androidRating: 4.7,
    iosReviewCount: 0,
    androidReviewCount: 0,
    downloads: "",
    category: "",
    appIconUrl: "",
  },
  integrations: {
    checkoutProvider: "stripe",
    emailProvider: "none",
    stripePublishableKey: "",
    stripePriceId: "",
    baseUrl: "http://localhost:3000",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    readOnly?: boolean;
    config?: unknown;
    message?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/get-config")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setState((prev) => ({
            ...prev,
            templateType: data.templateType ?? prev.templateType,
            theme: data.theme ?? prev.theme,
            heroVariant: data.heroVariant ?? prev.heroVariant,
            brand: { ...prev.brand, ...data.brand },
            product: { ...prev.product, ...data.product },
            leadMagnet: { ...prev.leadMagnet, ...data.leadMagnet },
            app: { ...prev.app, ...data.app },
            integrations: { ...prev.integrations, ...data.integrations },
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Auto-reset heroVariant to first option when templateType changes
  useEffect(() => {
    const variants = HERO_VARIANTS[state.templateType];
    const valid = variants.some((v) => v.id === state.heroVariant);
    if (!valid) {
      setState((prev) => ({ ...prev, heroVariant: variants[0].id }));
    }
  }, [state.templateType, state.heroVariant]);

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const updateNested = <K extends keyof WizardState>(key: K, field: string, value: unknown) =>
    setState((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as Record<string, unknown>), [field]: value },
    }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      setSaveResult(data);
      setStep(4);
    } catch {
      setSaveResult({ success: false, message: "Network error. Try again." });
    } finally {
      setSaving(false);
    }
  };

  const downloadConfig = () => {
    if (!saveResult?.config) return;
    const blob = new Blob([JSON.stringify(saveResult.config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site.config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewStyle = {
    "--brand-primary": state.brand.primaryColor,
    "--brand-accent": state.brand.accentColor,
  } as React.CSSProperties;

  const isLight = state.theme === "light";
  const pageColor = isLight ? "#f8fafc" : "#0a0f1e";
  const textColor = isLight ? "#0f172a" : "#f8fafc";
  const mutedColor = isLight ? "#64748b" : "#94a3b8";
  const subtleColor = isLight ? "#94a3b8" : "#475569";
  const cardBg = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
  const cardBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const inputStyle: React.CSSProperties = {
    background: cardBg,
    borderColor: cardBorder,
    color: textColor,
  };

  const glassCard: React.CSSProperties = {
    background: cardBg,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${cardBorder}`,
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ ...previewStyle, background: pageColor, color: textColor }}
    >
      {/* Header */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: `${pageColor}cc`, borderColor: cardBorder }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold" style={{ color: textColor }}>
              {state.brand.name || "Setup Wizard"}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Quick theme toggle */}
            <button
              onClick={() => update("theme", isLight ? "dark" : "light")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, color: mutedColor }}
              title="Toggle theme preview"
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {isLight ? "Dark" : "Light"}
            </button>
            <span className="text-xs" style={{ color: subtleColor }}>
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5" style={{ background: cardBg }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: `linear-gradient(90deg, var(--brand-primary), var(--brand-accent))`,
          }}
        />
      </div>

      {/* Step indicator */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all"
                style={
                  i <= step
                    ? { background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`, color: "#fff" }
                    : { background: cardBg, border: `1px solid ${cardBorder}`, color: subtleColor }
                }
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className="text-xs hidden sm:block"
                style={{ color: i === step ? textColor : subtleColor, fontWeight: i === step ? 600 : 400 }}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-px mx-1 hidden sm:block" style={{ background: cardBorder }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">

        {/* ── STEP 0: Template ── */}
        {step === 0 && (
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2" style={{ color: textColor }}>
                Choose your template type
              </h1>
              <p style={{ color: mutedColor }}>Select the type that best fits your product.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {TEMPLATE_OPTIONS.map((opt) => {
                const selected = state.templateType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => update("templateType", opt.id)}
                    className="text-left p-5 rounded-2xl border-2 transition-all duration-200 space-y-3"
                    style={
                      selected
                        ? {
                            background: `color-mix(in srgb, var(--brand-primary) 10%, ${pageColor})`,
                            borderColor: `var(--brand-primary)`,
                            boxShadow: `0 0 0 1px color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
                          }
                        : { ...glassCard, borderColor: cardBorder }
                    }
                  >
                    <div className="text-3xl">{opt.emoji}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-heading font-bold text-sm" style={{ color: textColor }}>
                          {opt.label}
                        </p>
                        {selected && (
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: `var(--brand-primary)` }}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: mutedColor }}>
                        {opt.description}
                      </p>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: `var(--brand-primary)` }}>
                      {opt.bestFor}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 1: Hero Variant ── */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2" style={{ color: textColor }}>
                Choose your hero layout
              </h1>
              <p style={{ color: mutedColor }}>
                Pick the hero section style for your{" "}
                <span style={{ color: `var(--brand-primary)` }}>
                  {TEMPLATE_OPTIONS.find((t) => t.id === state.templateType)?.label}
                </span>{" "}
                template.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {HERO_VARIANTS[state.templateType].map((variant) => {
                const selected = state.heroVariant === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => update("heroVariant", variant.id)}
                    className="text-left p-5 rounded-2xl border-2 transition-all duration-200 space-y-4"
                    style={
                      selected
                        ? {
                            background: `color-mix(in srgb, var(--brand-primary) 10%, ${pageColor})`,
                            borderColor: `var(--brand-primary)`,
                          }
                        : { ...glassCard, borderColor: cardBorder }
                    }
                  >
                    {/* ASCII wireframe preview */}
                    <div
                      className="rounded-xl p-3 font-mono text-xs leading-relaxed whitespace-pre"
                      style={{
                        background: cardBg,
                        border: `1px solid ${cardBorder}`,
                        color: selected ? `var(--brand-primary)` : subtleColor,
                      }}
                    >
                      {variant.preview}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-heading font-bold text-sm" style={{ color: textColor }}>
                          {variant.label}
                        </p>
                        {selected && (
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: `var(--brand-primary)` }}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: mutedColor }}>
                        {variant.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Theme selector */}
            <div>
              <p className="font-semibold text-sm mb-3" style={{ color: textColor }}>
                Color theme
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {(["dark", "light"] as ThemeType[]).map((t) => {
                  const selected = state.theme === t;
                  return (
                    <button
                      key={t}
                      onClick={() => update("theme", t)}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all"
                      style={
                        selected
                          ? { borderColor: `var(--brand-primary)`, background: `color-mix(in srgb, var(--brand-primary) 10%, ${pageColor})` }
                          : { ...glassCard, borderColor: cardBorder }
                      }
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          background: t === "dark" ? "#0a0f1e" : "#f8fafc",
                          border: `2px solid ${t === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                        }}
                      >
                        {t === "dark" ? (
                          <Moon className="w-6 h-6 text-slate-200" />
                        ) : (
                          <Sun className="w-6 h-6 text-amber-500" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm capitalize" style={{ color: textColor }}>
                          {t === "dark" ? "Dark" : "Light / White"}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: mutedColor }}>
                          {t === "dark" ? "Dark navy background" : "Clean white background"}
                        </p>
                      </div>
                      {selected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: `var(--brand-primary)` }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Product ── */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2" style={{ color: textColor }}>
                Product details
              </h1>
              <p style={{ color: mutedColor }}>
                This content powers your hero section, pricing card, and page metadata.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <FieldGroup label="Brand / Site name" required textColor={textColor} mutedColor={mutedColor}>
                <Input
                  value={state.brand.name}
                  onChange={(e) => updateNested("brand", "name", e.target.value)}
                  placeholder="LaunchKit"
                  className="h-10 rounded-xl"
                  style={inputStyle}
                />
              </FieldGroup>

              <FieldGroup label="Product name" required textColor={textColor} mutedColor={mutedColor}>
                <Input
                  value={state.product.name}
                  onChange={(e) => updateNested("product", "name", e.target.value)}
                  placeholder="The SaaS Launch Playbook"
                  className="h-10 rounded-xl"
                  style={inputStyle}
                />
              </FieldGroup>

              <FieldGroup label="Tagline / Subtitle" required textColor={textColor} mutedColor={mutedColor}>
                <Input
                  value={state.product.tagline}
                  onChange={(e) => updateNested("product", "tagline", e.target.value)}
                  placeholder="From Zero to First 100 Customers"
                  className="h-10 rounded-xl"
                  style={inputStyle}
                />
              </FieldGroup>

              <FieldGroup label="Hero badge text" textColor={textColor} mutedColor={mutedColor}>
                <Input
                  value={state.product.badge}
                  onChange={(e) => updateNested("product", "badge", e.target.value)}
                  placeholder="New Edition — 2025"
                  className="h-10 rounded-xl"
                  style={inputStyle}
                />
              </FieldGroup>

              <FieldGroup label="Description" className="sm:col-span-2" required textColor={textColor} mutedColor={mutedColor}>
                <Textarea
                  value={state.product.description}
                  onChange={(e) => updateNested("product", "description", e.target.value)}
                  placeholder="One paragraph that describes your product and its core value."
                  rows={3}
                  className="rounded-xl resize-none"
                  style={inputStyle}
                />
              </FieldGroup>

              {state.templateType === "ebook" && (
                <>
                  <FieldGroup label="Price ($)" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      type="number"
                      value={state.product.price}
                      onChange={(e) => updateNested("product", "price", Number(e.target.value))}
                      min={0}
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Original price ($) — shown crossed out" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      type="number"
                      value={state.product.originalPrice}
                      onChange={(e) => updateNested("product", "originalPrice", Number(e.target.value))}
                      min={0}
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Format (e.g. PDF + EPUB)" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.product.format}
                      onChange={(e) => updateNested("product", "format", e.target.value)}
                      placeholder="PDF + EPUB"
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Page count" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      type="number"
                      value={state.product.pages}
                      onChange={(e) => updateNested("product", "pages", Number(e.target.value))}
                      min={1}
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                </>
              )}

              {state.templateType === "mobile-app" && (
                <>
                  <FieldGroup label="App Store URL (iOS)" className="sm:col-span-2" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.app.appStoreUrl}
                      onChange={(e) => updateNested("app", "appStoreUrl", e.target.value)}
                      placeholder="https://apps.apple.com/app/id..."
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Google Play URL (Android)" className="sm:col-span-2" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.app.playStoreUrl}
                      onChange={(e) => updateNested("app", "playStoreUrl", e.target.value)}
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="iOS rating (0–5)" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      type="number"
                      step={0.1}
                      min={0}
                      max={5}
                      value={state.app.iosRating}
                      onChange={(e) => updateNested("app", "iosRating", Number(e.target.value))}
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Android rating (0–5)" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      type="number"
                      step={0.1}
                      min={0}
                      max={5}
                      value={state.app.androidRating}
                      onChange={(e) => updateNested("app", "androidRating", Number(e.target.value))}
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Total downloads (display text)" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.app.downloads}
                      onChange={(e) => updateNested("app", "downloads", e.target.value)}
                      placeholder="e.g. 250k+"
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Category / subtitle" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.app.category}
                      onChange={(e) => updateNested("app", "category", e.target.value)}
                      placeholder="Navigation · Outdoors"
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Premium price ($) — optional" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      type="number"
                      value={state.product.price}
                      onChange={(e) => updateNested("product", "price", Number(e.target.value))}
                      min={0}
                      placeholder="0 to hide the Premium card"
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Premium original price ($)" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      type="number"
                      value={state.product.originalPrice}
                      onChange={(e) => updateNested("product", "originalPrice", Number(e.target.value))}
                      min={0}
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                </>
              )}

              {state.templateType !== "saas" && state.templateType !== "mobile-app" && (
                <>
                  <FieldGroup label="Free download CTA label" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.leadMagnet.title}
                      onChange={(e) => updateNested("leadMagnet", "title", e.target.value)}
                      placeholder="Get Free Sample Chapter"
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                  <FieldGroup label="Email form description" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.leadMagnet.description}
                      onChange={(e) => updateNested("leadMagnet", "description", e.target.value)}
                      placeholder="We'll send you the free chapter instantly."
                      className="h-10 rounded-xl"
                      style={inputStyle}
                    />
                  </FieldGroup>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Branding ── */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2" style={{ color: textColor }}>
                Branding &amp; integrations
              </h1>
              <p style={{ color: mutedColor }}>
                Upload your logo, set brand colors, and connect Stripe.
              </p>
            </div>

            {/* ── Colors ── */}
            <Section label="Brand Colors" glassCard={glassCard}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, primaryColor: preset.primary, accentColor: preset.accent },
                      }))
                    }
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
                    style={
                      state.brand.primaryColor === preset.primary
                        ? { border: `1px solid var(--brand-primary)`, background: `color-mix(in srgb, var(--brand-primary) 10%, ${pageColor})` }
                        : { ...glassCard }
                    }
                  >
                    <div className="flex gap-1.5 flex-shrink-0">
                      <div className="w-5 h-5 rounded-full shadow-md" style={{ background: preset.primary }} />
                      <div className="w-5 h-5 rounded-full shadow-md" style={{ background: preset.accent }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: textColor }}>{preset.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FieldGroup label="Primary color" textColor={textColor} mutedColor={mutedColor}>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={state.brand.primaryColor}
                      onChange={(e) => updateNested("brand", "primaryColor", e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer p-0.5"
                      style={{ background: "transparent", border: `1px solid ${cardBorder}` }}
                    />
                    <Input
                      value={state.brand.primaryColor}
                      onChange={(e) => updateNested("brand", "primaryColor", e.target.value)}
                      placeholder="#6366f1"
                      className="h-10 rounded-xl font-mono"
                      style={inputStyle}
                    />
                  </div>
                </FieldGroup>
                <FieldGroup label="Accent color" textColor={textColor} mutedColor={mutedColor}>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={state.brand.accentColor}
                      onChange={(e) => updateNested("brand", "accentColor", e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer p-0.5"
                      style={{ background: "transparent", border: `1px solid ${cardBorder}` }}
                    />
                    <Input
                      value={state.brand.accentColor}
                      onChange={(e) => updateNested("brand", "accentColor", e.target.value)}
                      placeholder="#8b5cf6"
                      className="h-10 rounded-xl font-mono"
                      style={inputStyle}
                    />
                  </div>
                </FieldGroup>
              </div>

              {/* Preview */}
              <div className="mt-5 flex flex-wrap gap-3 items-center">
                <button
                  className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg"
                  style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
                >
                  Buy Now — ${state.product.price}
                </button>
                <span
                  className="font-heading text-xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Gradient text preview
                </span>
              </div>
            </Section>

            {/* ── Logo ── */}
            <Section label="Logo" glassCard={glassCard}>
              <p className="text-xs mb-4" style={{ color: mutedColor }}>
                Upload a logo image or paste a URL. Shown in the navbar instead of the text brand name.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <ImageUploadField
                  label="Logo"
                  value={state.brand.logoUrl}
                  onChange={(url) => updateNested("brand", "logoUrl", url)}
                  uploadType="logo"
                  textColor={textColor}
                  mutedColor={mutedColor}
                  inputStyle={inputStyle}
                  cardBorder={cardBorder}
                  cardBg={cardBg}
                  pageColor={pageColor}
                />
                {state.brand.logoUrl && (
                  <div
                    className="rounded-xl p-4 flex items-center justify-center min-h-[80px]"
                    style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                  >
                    <Image
                      src={state.brand.logoUrl}
                      alt="Logo preview"
                      width={160}
                      height={48}
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </Section>

            {/* ── Product image ── */}
            <Section label="Product / Hero Image" glassCard={glassCard}>
              <p className="text-xs mb-4" style={{ color: mutedColor }}>
                Upload a product mockup, screenshot, or hero illustration. Shown in the hero section.
                Recommended: 800×600px or wider.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <ImageUploadField
                  label="Product image"
                  value={state.brand.productImageUrl}
                  onChange={(url) => updateNested("brand", "productImageUrl", url)}
                  uploadType="product"
                  textColor={textColor}
                  mutedColor={mutedColor}
                  inputStyle={inputStyle}
                  cardBorder={cardBorder}
                  cardBg={cardBg}
                  pageColor={pageColor}
                />
                {state.brand.productImageUrl && (
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${cardBorder}` }}
                  >
                    <Image
                      src={state.brand.productImageUrl}
                      alt="Product preview"
                      width={400}
                      height={260}
                      className="w-full h-auto object-cover max-h-40"
                    />
                  </div>
                )}
              </div>
            </Section>

            {/* ── Integrations ── */}
            <Section label="Integrations" glassCard={glassCard}>
              <p className="text-xs mb-4" style={{ color: subtleColor }}>
                Pick your checkout and email providers. FREE ships with Stripe one-time
                and a no-op email logger. Locked cards unlock in LaunchKit PRO.
              </p>

              <div className="space-y-5">
                <ProviderPickerGroup
                  label="Checkout"
                  kind="checkout"
                  value={state.integrations.checkoutProvider}
                  onChange={(id) => updateNested("integrations", "checkoutProvider", id)}
                  textColor={textColor}
                  mutedColor={mutedColor}
                  subtleColor={subtleColor}
                  cardBorder={cardBorder}
                />

                <ProviderPickerGroup
                  label="Email capture"
                  kind="email"
                  value={state.integrations.emailProvider}
                  onChange={(id) => updateNested("integrations", "emailProvider", id)}
                  textColor={textColor}
                  mutedColor={mutedColor}
                  subtleColor={subtleColor}
                  cardBorder={cardBorder}
                />
              </div>
            </Section>

            {/* ── Stripe ── */}
            <Section label="Stripe (optional)" glassCard={glassCard}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-[#635BFF]/20 flex items-center justify-center">
                  <span className="text-[#635BFF] text-xs font-black">S</span>
                </div>
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs flex items-center gap-1 transition-colors hover:underline"
                  style={{ color: mutedColor }}
                >
                  Get API keys <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-4">
                <FieldGroup label="Publishable key (pk_live_... or pk_test_...)" textColor={textColor} mutedColor={mutedColor}>
                  <Input
                    value={state.integrations.stripePublishableKey}
                    onChange={(e) => updateNested("integrations", "stripePublishableKey", e.target.value)}
                    placeholder="pk_test_..."
                    className="h-10 rounded-xl font-mono"
                    style={inputStyle}
                  />
                </FieldGroup>

                {state.templateType === "ebook" && (
                  <FieldGroup label="Price ID for your product (price_...)" textColor={textColor} mutedColor={mutedColor}>
                    <Input
                      value={state.integrations.stripePriceId}
                      onChange={(e) => updateNested("integrations", "stripePriceId", e.target.value)}
                      placeholder="price_..."
                      className="h-10 rounded-xl font-mono"
                      style={inputStyle}
                    />
                    <p className="text-xs mt-1" style={{ color: subtleColor }}>
                      Create a product in Stripe Dashboard → Products, then copy the price ID.
                    </p>
                  </FieldGroup>
                )}

                <FieldGroup label="Your site base URL" textColor={textColor} mutedColor={mutedColor}>
                  <Input
                    value={state.integrations.baseUrl}
                    onChange={(e) => updateNested("integrations", "baseUrl", e.target.value)}
                    placeholder="https://yoursite.com"
                    className="h-10 rounded-xl font-mono"
                    style={inputStyle}
                  />
                </FieldGroup>
              </div>

              <div
                className="mt-4 rounded-xl p-4"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <p className="text-amber-400 text-sm font-semibold mb-1">🔐 Never commit secret keys</p>
                <p className="text-xs leading-relaxed" style={{ color: mutedColor }}>
                  Set <code className="text-amber-300">STRIPE_SECRET_KEY</code> in{" "}
                  <code className="text-amber-300">.env.local</code> only — not here.
                </p>
              </div>
            </Section>
          </div>
        )}

        {/* ── STEP 4: Done ── */}
        {step === 4 && (
          <div className="space-y-8 max-w-lg">
            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl"
                style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
              >
                <Check className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-heading text-3xl font-bold" style={{ color: textColor }}>
                {saveResult?.success ? "Config saved!" : "Almost there"}
              </h1>
              {saveResult?.message && (
                <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                  {saveResult.message}
                </p>
              )}
            </div>

            {saveResult?.readOnly && (
              <div className="rounded-2xl p-5 space-y-3" style={glassCard}>
                <p className="font-semibold text-sm" style={{ color: textColor }}>
                  Download your config file and commit it to your repo:
                </p>
                <Button
                  onClick={downloadConfig}
                  variant="outline"
                  className="w-full rounded-xl"
                  style={{ ...glassCard, color: textColor }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download site.config.json
                </Button>
                <p className="text-xs" style={{ color: subtleColor }}>
                  Place it at <code>lib/site.config.json</code> and redeploy.
                </p>
              </div>
            )}

            {saveResult?.success && (
              <div className="rounded-2xl p-5 space-y-2" style={glassCard}>
                <p className="text-sm" style={{ color: mutedColor }}>
                  <strong style={{ color: textColor }}>Content changes</strong> take effect after
                  restarting your dev server.
                </p>
                <p className="text-sm" style={{ color: mutedColor }}>
                  <strong style={{ color: textColor }}>Colors &amp; theme</strong> update on the next
                  page load.
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="rounded-2xl p-5 space-y-3" style={glassCard}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: subtleColor }}>
                Configuration summary
              </p>
              {[
                { label: "Template", value: TEMPLATE_OPTIONS.find((t) => t.id === state.templateType)?.label ?? state.templateType },
                { label: "Hero variant", value: HERO_VARIANTS[state.templateType].find((v) => v.id === state.heroVariant)?.label ?? state.heroVariant },
                { label: "Theme", value: state.theme === "light" ? "Light / White" : "Dark" },
                { label: "Brand", value: state.brand.name },
                { label: "Product", value: state.product.name },
                { label: "Logo", value: state.brand.logoUrl ? "✓ Set" : "Not set" },
                { label: "Product image", value: state.brand.productImageUrl ? "✓ Set" : "Not set" },
                { label: "Stripe key", value: state.integrations.stripePublishableKey ? "✓ Set" : "Not set" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-sm" style={{ color: subtleColor }}>{label}</span>
                  <span className="text-sm font-mono truncate max-w-[200px]" style={{ color: textColor }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button
                  className="w-full font-bold rounded-xl text-white border-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
                >
                  View Landing Page
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                onClick={() => setStep(0)}
                variant="outline"
                className="rounded-xl"
                style={{ ...glassCard, color: textColor }}
              >
                Edit again
              </Button>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        {step < 4 && (
          <div
            className="flex items-center justify-between pt-10 border-t mt-10"
            style={{ borderColor: cardBorder }}
          >
            <Button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              variant="outline"
              className="rounded-xl disabled:opacity-40"
              style={{ ...glassCard, color: textColor }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < STEPS.length - 2 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                className="font-bold text-white rounded-xl border-0 shadow-lg px-6"
                style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="font-bold text-white rounded-xl border-0 shadow-lg px-6"
                style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
              >
                {saving ? "Saving…" : "Save & Finish"}
                {!saving && <Check className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Sub-components & Helpers ─────────────────────────────────────────────────

function Section({
  label,
  children,
  glassCard,
}: {
  label: string;
  children: React.ReactNode;
  glassCard: React.CSSProperties;
}) {
  return (
    <div className="rounded-2xl p-6 space-y-4" style={glassCard}>
      <p className="font-heading font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--brand-primary)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function FieldGroup({
  label,
  children,
  required,
  className,
  textColor,
  mutedColor,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-sm font-medium" style={{ color: mutedColor }}>
        {label}
        {required && <span className="ml-0.5" style={{ color: "var(--brand-primary)" }}>*</span>}
      </Label>
      {children}
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  uploadType,
  textColor,
  mutedColor,
  inputStyle,
  cardBorder,
  cardBg,
  pageColor,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadType: string;
  textColor: string;
  mutedColor: string;
  inputStyle: React.CSSProperties;
  cardBorder: string;
  cardBg: string;
  pageColor: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", uploadType);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else if (data.readOnly) {
        setUploadError("File system is read-only. Paste an external URL instead.");
      } else {
        setUploadError(data.error ?? "Upload failed");
      }
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /uploads/logo.png"
          className="h-10 rounded-xl font-mono text-xs flex-1"
          style={inputStyle}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-500/10"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, color: mutedColor }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
        style={{ background: cardBg, border: `1px dashed ${cardBorder}`, color: mutedColor }}
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand-primary)" }} />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload {label}
          </>
        )}
      </button>

      {uploadError && (
        <p className="text-xs text-red-400">{uploadError}</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ─── Integrations picker ─────────────────────────────────────────────────────

function ProviderPickerGroup({
  label,
  kind,
  value,
  onChange,
  textColor,
  mutedColor,
  subtleColor,
  cardBorder,
}: {
  label: string;
  kind: IntegrationKind;
  value: string;
  onChange: (id: string) => void;
  textColor: string;
  mutedColor: string;
  subtleColor: string;
  cardBorder: string;
}) {
  const providers = listProviders(kind);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium" style={{ color: mutedColor }}>
          {label}
        </Label>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: subtleColor }}>
          {providers.filter((p) => p.edition === "free").length} free ·{" "}
          {providers.filter((p) => p.edition === "pro").length} pro
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
            textColor={textColor}
            mutedColor={mutedColor}
            subtleColor={subtleColor}
            cardBorder={cardBorder}
          />
        ))}
      </div>

      {value && providers.find((p) => p.id === value)?.edition === "free" && (
        <TestConnectionButton
          kind={kind}
          id={value}
          mutedColor={mutedColor}
          subtleColor={subtleColor}
          cardBorder={cardBorder}
        />
      )}
    </div>
  );
}

function ProviderCard({
  provider,
  selected,
  onSelect,
  textColor,
  mutedColor,
  subtleColor,
  cardBorder,
}: {
  provider: CatalogEntry;
  selected: boolean;
  onSelect: () => void;
  textColor: string;
  mutedColor: string;
  subtleColor: string;
  cardBorder: string;
}) {
  const locked = provider.edition === "pro";
  const borderColor = selected ? "var(--brand-primary)" : cardBorder;
  const background = selected
    ? "color-mix(in srgb, var(--brand-primary) 10%, transparent)"
    : "transparent";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked}
      aria-pressed={selected}
      className="relative text-left rounded-xl px-3 py-2.5 transition-all disabled:cursor-not-allowed"
      style={{
        border: `1px solid ${borderColor}`,
        background,
        opacity: locked ? 0.55 : 1,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold" style={{ color: textColor }}>
          {provider.displayName}
        </span>
        {locked && (
          <span
            className="ml-auto text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 px-1.5 py-0.5 rounded"
            style={{
              color: "var(--brand-primary)",
              background: "color-mix(in srgb, var(--brand-primary) 15%, transparent)",
            }}
          >
            <Lock className="w-2.5 h-2.5" />
            PRO
          </span>
        )}
        {selected && !locked && (
          <Check
            className="w-3.5 h-3.5 ml-auto"
            style={{ color: "var(--brand-primary)" }}
          />
        )}
      </div>
      <p className="text-xs mt-1 leading-relaxed" style={{ color: subtleColor }}>
        {provider.description}
      </p>
      {provider.requiredEnv.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {provider.requiredEnv.map((env) => (
            <code
              key={env}
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: "rgba(120,120,140,0.12)", color: mutedColor }}
            >
              {env}
            </code>
          ))}
        </div>
      )}
    </button>
  );
}

function TestConnectionButton({
  kind,
  id,
  mutedColor,
  subtleColor,
  cardBorder,
}: {
  kind: IntegrationKind;
  id: string;
  mutedColor: string;
  subtleColor: string;
  cardBorder: string;
}) {
  const [state, setLocalState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "ok"; message?: string }
    | { status: "error"; message: string; missingEnv?: string[] }
  >({ status: "idle" });

  const run = async () => {
    setLocalState({ status: "loading" });
    try {
      const res = await fetch("/api/admin/test-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setLocalState({ status: "ok", message: data.message });
      } else {
        setLocalState({
          status: "error",
          message: data.error ?? data.message ?? "Connection failed.",
          missingEnv: data.missingEnv,
        });
      }
    } catch {
      setLocalState({ status: "error", message: "Network error." });
    }
  };

  return (
    <div className="flex items-start gap-2 pt-1">
      <button
        type="button"
        onClick={run}
        disabled={state.status === "loading"}
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors hover:opacity-80 disabled:opacity-60"
        style={{ background: "transparent", border: `1px solid ${cardBorder}`, color: mutedColor }}
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
        <span className="text-xs pt-1.5" style={{ color: subtleColor }}>
          {state.message}
        </span>
      )}
      {state.status === "error" && (
        <span className="text-xs pt-1.5" style={{ color: "#ef4444" }}>
          {state.message}
          {state.missingEnv && state.missingEnv.length > 0 && (
            <>
              {" "}
              <span style={{ color: subtleColor }}>
                (missing: {state.missingEnv.join(", ")})
              </span>
            </>
          )}
        </span>
      )}
    </div>
  );
}
