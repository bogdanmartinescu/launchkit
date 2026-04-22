"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  Download,
  ExternalLink,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  WizardThemeProvider,
  useWizardTheme,
} from "@/components/setup/WizardTheme";
import { Section } from "@/components/setup/Section";
import { FieldGroup } from "@/components/setup/FieldGroup";
import { ImageUploadField } from "@/components/setup/ImageUploadField";
import { ProviderPickerGroup } from "@/components/setup/ProviderPickerGroup";
import { Disclosure } from "@/components/setup/Disclosure";
import { PreviewPane } from "@/components/setup/PreviewPane";

// ─── Types ───────────────────────────────────────────────────────────────────

type TemplateType = "ebook" | "saas" | "email-collection" | "mobile-app";
type ThemeType = "dark" | "light";

interface FaqItemState {
  q: string;
  a: string;
}

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
    ogImageUrl: string;
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
  sections: {
    hero: {
      eyebrow: string;
      headline: string;
      subheadline: string;
      ctaPrimary: { label: string };
      ctaSecondary: { label: string };
    };
    newsletter: {
      heading: string;
      subheading: string;
      ctaLabel: string;
    };
    faq: {
      items: FaqItemState[];
    };
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
    description:
      "Sell an ebook, PDF guide, course, or any downloadable. Includes single-price checkout, free preview email capture, and a book/file mockup.",
    emoji: "📖",
    bestFor: "Ebooks · PDFs · Templates · Courses",
  },
  {
    id: "saas",
    label: "SaaS / Software",
    description:
      "Launch a software product with a 3-tier pricing table, app screenshot mockup, and free trial CTA.",
    emoji: "🚀",
    bestFor: "SaaS · Apps · APIs · Developer tools",
  },
  {
    id: "email-collection",
    label: "Lead Magnet / Free",
    description:
      "Grow your email list with a free resource. The hero is a prominent email signup form — no price, no checkout.",
    emoji: "✉️",
    bestFor: "Newsletters · Free tools · Communities",
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    description:
      "Promote an iOS or Android app with store badges, phone-mockup screenshots, a 3-step onboarding flow, and an optional Premium upgrade.",
    emoji: "📱",
    bestFor: "iOS · Android · Consumer apps",
  },
];

const HERO_VARIANTS: Record<
  TemplateType,
  Array<{ id: string; label: string; description: string; preview: string }>
> = {
  ebook: [
    { id: "split", label: "Classic Split", description: "Copy left, product mockup right. The proven conversion layout.", preview: "║ TEXT │ BOOK ║" },
    { id: "centered", label: "Centered", description: "Big centered headline, buttons, book mockup below. Great for bold products.", preview: "║ ─ TEXT ─ ║\n║ ─ BOOK ─ ║" },
    { id: "minimal", label: "Minimal", description: "Text-only left-aligned layout with a clean price block. No mockup.", preview: "║ TEXT    ║\n║ PRICE  ║" },
  ],
  saas: [
    { id: "centered", label: "Centered", description: "Headline centered, app screenshot below. Classic SaaS hero.", preview: "║ ─ TEXT ─ ║\n║ ─ APP ── ║" },
    { id: "split", label: "Split Layout", description: "Copy & CTAs left, app screenshot right. Emphasizes the product visually.", preview: "║ TEXT │ APP ║" },
  ],
  "email-collection": [
    { id: "centered", label: "Standard", description: "Centered headline and email form. Clean and focused on conversion.", preview: "║ ─ TEXT ─ ║\n║ ─ FORM ─ ║" },
    { id: "bold", label: "Bold Statement", description: "Huge full-width headline with gradient background. Maximum visual impact.", preview: "║ BIG TEXT ║\n║ ─ FORM ─ ║" },
  ],
  "mobile-app": [
    { id: "split", label: "Split + Phone", description: "Copy and store badges left, phone mockup right. Proven mobile-marketing layout.", preview: "║ TEXT │ 📱 ║" },
    { id: "centered", label: "Centered", description: "Big centered headline with store badges, phone mockup below. Maximum focus.", preview: "║ ─ TEXT ─ ║\n║ ── 📱 ── ║" },
  ],
};

// Step order: Template → Hero Style → Product → Branding → Copy → Finish.
// Phase 2 added the "Copy" step; see PLAN.md §8.
const STEPS = ["Template", "Hero Style", "Product", "Branding", "Copy", "Finish"];
const FINISH_STEP = STEPS.length - 1;

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
    ogImageUrl: "",
  },
  product: {
    name: "The SaaS Launch Playbook",
    tagline: "From Zero to First 100 Customers",
    description:
      "A step-by-step blueprint to validate ideas, build an audience, and land paying customers — before writing a single line of code.",
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
  // Copy-step overrides default to empty strings — when empty they fall through
  // to the template defaults in lib/templates/<type>.ts, so clones still render
  // with realistic content.
  sections: {
    hero: {
      eyebrow: "",
      headline: "",
      subheadline: "",
      ctaPrimary: { label: "" },
      ctaSecondary: { label: "" },
    },
    newsletter: {
      heading: "",
      subheading: "",
      ctaLabel: "",
    },
    faq: { items: [] },
  },
  integrations: {
    checkoutProvider: "stripe",
    emailProvider: "none",
    stripePublishableKey: "",
    stripePriceId: "",
    baseUrl: "http://localhost:3000",
  },
};

// ─── Outer component (provides theme context) ───────────────────────────────

export default function SetupPage() {
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);

  return (
    <WizardThemeProvider theme={state.theme}>
      <SetupWizard state={state} setState={setState} />
    </WizardThemeProvider>
  );
}

// ─── Inner wizard (consumes theme) ──────────────────────────────────────────

function SetupWizard({
  state,
  setState,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
}) {
  const theme = useWizardTheme();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
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
            sections: mergeSections(prev.sections, data.sections),
          }));
        }
      })
      .catch(() => {});
  }, [setState]);

  // ── Update helpers ─────────────────────────────────────────────────────────

  const update = useCallback(
    <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
      setState((prev) => ({ ...prev, [key]: value })),
    [setState]
  );

  const updateNested = useCallback(
    <K extends keyof WizardState>(key: K, field: string, value: unknown) =>
      setState((prev) => ({
        ...prev,
        [key]: { ...(prev[key] as Record<string, unknown>), [field]: value },
      })),
    [setState]
  );

  const updateHeroCopy = useCallback(
    (field: keyof WizardState["sections"]["hero"], value: unknown) =>
      setState((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          hero: { ...prev.sections.hero, [field]: value },
        },
      })),
    [setState]
  );

  const updateNewsletterCopy = useCallback(
    (field: keyof WizardState["sections"]["newsletter"], value: string) =>
      setState((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          newsletter: { ...prev.sections.newsletter, [field]: value },
        },
      })),
    [setState]
  );

  const setFaqItems = useCallback(
    (items: FaqItemState[]) =>
      setState((prev) => ({
        ...prev,
        sections: { ...prev.sections, faq: { items } },
      })),
    [setState]
  );

  // Selecting a new template resets the heroVariant to the first available
  // option. This used to live in a useEffect but that tripped React 19's
  // "no setState in an effect body" rule — switching to a handler is both
  // lint-clean and more explicit about intent.
  const handleTemplateChange = useCallback(
    (templateType: TemplateType) =>
      setState((prev) => ({
        ...prev,
        templateType,
        heroVariant: HERO_VARIANTS[templateType][0].id,
      })),
    [setState]
  );

  // ── Save + download ────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSavePayload(state)),
      });
      const data = await res.json();
      setSaveResult(data);
      setRefreshKey((k) => k + 1);
      setStep(FINISH_STEP);
    } catch {
      setSaveResult({ success: false, message: "Network error. Try again." });
    } finally {
      setSaving(false);
    }
  };

  const downloadConfig = () => {
    if (!saveResult?.config) return;
    const blob = new Blob([JSON.stringify(saveResult.config, null, 2)], {
      type: "application/json",
    });
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
  const selectedTemplate =
    TEMPLATE_OPTIONS.find((t) => t.id === state.templateType) ??
    TEMPLATE_OPTIONS[0];
  const selectedHeroVariant =
    HERO_VARIANTS[state.templateType].find((v) => v.id === state.heroVariant) ??
    HERO_VARIANTS[state.templateType][0];

  return (
    <div
      className="min-h-svh flex flex-col transition-colors duration-300"
      style={{ ...previewStyle, background: theme.page, color: theme.text }}
    >
      {/* Header */}
      <header
        className="border-b sticky top-0 z-30 backdrop-blur-xl"
        style={{
          background: `${theme.page}cc`,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
              }}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-heading font-bold truncate"
              style={{ color: theme.text }}
            >
              {state.brand.name || "Setup Wizard"}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewOpen((v) => !v)}
              className="hidden lg:flex min-h-9 items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: previewOpen
                  ? "color-mix(in srgb, var(--brand-primary) 15%, transparent)"
                  : theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                color: previewOpen ? "var(--brand-primary)" : theme.muted,
              }}
              aria-pressed={previewOpen}
            >
              {previewOpen ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              Preview
            </button>
            <button
              onClick={() => update("theme", isLight ? "dark" : "light")}
              className="flex items-center gap-2 min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                color: theme.muted,
              }}
              title="Toggle theme preview"
            >
              {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              {isLight ? "Dark" : "Light"}
            </button>
            <span
              className="text-xs hidden sm:block"
              style={{ color: theme.subtle }}
            >
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5" style={{ background: theme.cardBg }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: `linear-gradient(90deg, var(--brand-primary), var(--brand-accent))`,
          }}
        />
      </div>

      {/* Step indicator */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all"
                style={
                  i <= step
                    ? {
                        background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                        color: "#fff",
                      }
                    : {
                        background: theme.cardBg,
                        border: `1px solid ${theme.cardBorder}`,
                        color: theme.subtle,
                      }
                }
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className="text-xs hidden sm:block"
                style={{
                  color: i === step ? theme.text : theme.subtle,
                  fontWeight: i === step ? 600 : 400,
                }}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className="w-6 h-px mx-1 hidden sm:block"
                  style={{ background: theme.cardBorder }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main
        className={`flex-1 max-w-4xl mx-auto px-4 py-8 w-full ${
          previewOpen ? "lg:pr-[min(40vw,560px)]" : ""
        }`}
      >
        {step === 0 && (
          <TemplateStep
            selectedId={state.templateType}
            onSelect={handleTemplateChange}
          />
        )}

        {step === 1 && (
          <HeroStyleStep
            templateLabel={selectedTemplate.label}
            variants={HERO_VARIANTS[state.templateType]}
            selectedId={state.heroVariant}
            selectedTheme={state.theme}
            onSelectVariant={(id) => update("heroVariant", id)}
            onSelectTheme={(t) => update("theme", t)}
          />
        )}

        {step === 2 && (
          <ProductStep
            state={state}
            updateNested={updateNested}
          />
        )}

        {step === 3 && (
          <BrandingStep
            state={state}
            updateNested={updateNested}
          />
        )}

        {step === 4 && (
          <CopyStep
            state={state}
            onHeroCopyChange={updateHeroCopy}
            onHeroCtaChange={(key, label) =>
              setState((prev) => ({
                ...prev,
                sections: {
                  ...prev.sections,
                  hero: {
                    ...prev.sections.hero,
                    [key]: { label },
                  },
                },
              }))
            }
            onNewsletterChange={updateNewsletterCopy}
            onFaqChange={setFaqItems}
          />
        )}

        {step === FINISH_STEP && (
          <FinishStep
            state={state}
            saveResult={saveResult}
            selectedHeroVariant={selectedHeroVariant.label}
            selectedTemplate={selectedTemplate.label}
            onDownload={downloadConfig}
            onRestart={() => setStep(0)}
          />
        )}

        {/* Nav buttons */}
        {step < FINISH_STEP && (
          <div
            className="flex items-center justify-between pt-10 border-t mt-10"
            style={{ borderColor: theme.cardBorder }}
          >
            <Button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              variant="outline"
              className="rounded-xl min-h-11 disabled:opacity-40"
              style={{ ...theme.glassCard, color: theme.text }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < FINISH_STEP - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                className="font-bold text-white rounded-xl border-0 shadow-lg px-6 min-h-11"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="font-bold text-white rounded-xl border-0 shadow-lg px-6 min-h-11"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                }}
              >
                {saving ? "Saving…" : "Save & Finish"}
                {!saving && <Check className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        )}
      </main>

      <PreviewPane
        state={state}
        refreshKey={refreshKey}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Deep-merge the config's `sections` field onto the wizard state shape. */
function mergeSections(
  prev: WizardState["sections"],
  incoming: unknown
): WizardState["sections"] {
  if (!incoming || typeof incoming !== "object") return prev;
  const data = incoming as Record<string, Record<string, unknown>>;
  return {
    hero: {
      ...prev.hero,
      ...(data.hero ?? {}),
      ctaPrimary: {
        label:
          (data.hero?.ctaPrimary as { label?: string } | undefined)?.label ??
          prev.hero.ctaPrimary.label,
      },
      ctaSecondary: {
        label:
          (data.hero?.ctaSecondary as { label?: string } | undefined)?.label ??
          prev.hero.ctaSecondary.label,
      },
    },
    newsletter: { ...prev.newsletter, ...(data.newsletter ?? {}) },
    faq: {
      items: Array.isArray(data.faq?.items)
        ? (data.faq!.items as FaqItemState[])
        : prev.faq.items,
    },
  };
}

/**
 * Strip empty override fields before saving — the schema accepts them but
 * persisting empty strings clutters site.config.json and hides the fact that
 * the template default is in effect.
 */
function buildSavePayload(state: WizardState): Record<string, unknown> {
  const { sections } = state;
  const hero: Record<string, unknown> = {};
  if (sections.hero.eyebrow) hero.eyebrow = sections.hero.eyebrow;
  if (sections.hero.headline) hero.headline = sections.hero.headline;
  if (sections.hero.subheadline) hero.subheadline = sections.hero.subheadline;
  if (sections.hero.ctaPrimary.label)
    hero.ctaPrimary = { label: sections.hero.ctaPrimary.label };
  if (sections.hero.ctaSecondary.label)
    hero.ctaSecondary = { label: sections.hero.ctaSecondary.label };

  const newsletter: Record<string, unknown> = {};
  if (sections.newsletter.heading) newsletter.heading = sections.newsletter.heading;
  if (sections.newsletter.subheading)
    newsletter.subheading = sections.newsletter.subheading;
  if (sections.newsletter.ctaLabel)
    newsletter.ctaLabel = sections.newsletter.ctaLabel;

  const faq = sections.faq.items.filter((i) => i.q.trim() && i.a.trim());

  const payloadSections: Record<string, unknown> = {};
  if (Object.keys(hero).length > 0) payloadSections.hero = hero;
  if (Object.keys(newsletter).length > 0)
    payloadSections.newsletter = newsletter;
  if (faq.length > 0) payloadSections.faq = { items: faq };

  const { sections: _sections, ...rest } = state;
  void _sections;
  const payload: Record<string, unknown> = { ...rest };
  if (Object.keys(payloadSections).length > 0)
    payload.sections = payloadSections;
  return payload;
}

// ─── Step components ────────────────────────────────────────────────────────

function TemplateStep({
  selectedId,
  onSelect,
}: {
  selectedId: TemplateType;
  onSelect: (id: TemplateType) => void;
}) {
  const theme = useWizardTheme();
  return (
    <div className="space-y-8">
      <div>
        <h1
          className="font-heading text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Choose your template type
        </h1>
        <p style={{ color: theme.muted }}>
          Select the type that best fits your product.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEMPLATE_OPTIONS.map((opt) => {
          const selected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="text-left p-5 rounded-2xl border-2 transition-all duration-200 space-y-3 min-h-11"
              style={
                selected
                  ? {
                      background: `color-mix(in srgb, var(--brand-primary) 10%, ${theme.page})`,
                      borderColor: `var(--brand-primary)`,
                      boxShadow: `0 0 0 1px color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
                    }
                  : { ...theme.glassCard, borderColor: theme.cardBorder }
              }
            >
              <div className="text-3xl">{opt.emoji}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className="font-heading font-bold text-sm"
                    style={{ color: theme.text }}
                  >
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
                <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                  {opt.description}
                </p>
              </div>
              <p
                className="text-xs font-semibold"
                style={{ color: `var(--brand-primary)` }}
              >
                {opt.bestFor}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeroStyleStep({
  templateLabel,
  variants,
  selectedId,
  selectedTheme,
  onSelectVariant,
  onSelectTheme,
}: {
  templateLabel: string;
  variants: Array<{ id: string; label: string; description: string; preview: string }>;
  selectedId: string;
  selectedTheme: ThemeType;
  onSelectVariant: (id: string) => void;
  onSelectTheme: (t: ThemeType) => void;
}) {
  const theme = useWizardTheme();
  return (
    <div className="space-y-8">
      <div>
        <h1
          className="font-heading text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Choose your hero layout
        </h1>
        <p style={{ color: theme.muted }}>
          Pick the hero section style for your{" "}
          <span style={{ color: `var(--brand-primary)` }}>{templateLabel}</span>{" "}
          template.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {variants.map((variant) => {
          const selected = selectedId === variant.id;
          return (
            <button
              key={variant.id}
              onClick={() => onSelectVariant(variant.id)}
              className="text-left p-5 rounded-2xl border-2 transition-all duration-200 space-y-4 min-h-11"
              style={
                selected
                  ? {
                      background: `color-mix(in srgb, var(--brand-primary) 10%, ${theme.page})`,
                      borderColor: `var(--brand-primary)`,
                    }
                  : { ...theme.glassCard, borderColor: theme.cardBorder }
              }
            >
              <div
                className="rounded-xl p-3 font-mono text-xs leading-relaxed whitespace-pre"
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  color: selected ? `var(--brand-primary)` : theme.subtle,
                }}
              >
                {variant.preview}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className="font-heading font-bold text-sm"
                    style={{ color: theme.text }}
                  >
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
                <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
                  {variant.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <p className="font-semibold text-sm mb-3" style={{ color: theme.text }}>
          Color theme
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          {(["dark", "light"] as ThemeType[]).map((t) => {
            const selected = selectedTheme === t;
            return (
              <button
                key={t}
                onClick={() => onSelectTheme(t)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all min-h-11"
                style={
                  selected
                    ? {
                        borderColor: `var(--brand-primary)`,
                        background: `color-mix(in srgb, var(--brand-primary) 10%, ${theme.page})`,
                      }
                    : { ...theme.glassCard, borderColor: theme.cardBorder }
                }
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: t === "dark" ? "#0a0f1e" : "#f8fafc",
                    border: `2px solid ${
                      t === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
                    }`,
                  }}
                >
                  {t === "dark" ? (
                    <Moon className="w-6 h-6 text-slate-200" />
                  ) : (
                    <Sun className="w-6 h-6 text-amber-500" />
                  )}
                </div>
                <div className="text-center">
                  <p
                    className="font-semibold text-sm capitalize"
                    style={{ color: theme.text }}
                  >
                    {t === "dark" ? "Dark" : "Light / White"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: theme.muted }}>
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
  );
}

function ProductStep({
  state,
  updateNested,
}: {
  state: WizardState;
  updateNested: <K extends keyof WizardState>(
    key: K,
    field: string,
    value: unknown
  ) => void;
}) {
  const theme = useWizardTheme();
  return (
    <div className="space-y-8">
      <div>
        <h1
          className="font-heading text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Product details
        </h1>
        <p style={{ color: theme.muted }}>
          This content powers your hero section, pricing card, and page metadata.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <FieldGroup label="Brand / Site name" required>
          <Input
            value={state.brand.name}
            onChange={(e) => updateNested("brand", "name", e.target.value)}
            placeholder="LaunchKit"
            className="h-10 rounded-xl"
            style={theme.inputStyle}
          />
        </FieldGroup>

        <FieldGroup label="Product name" required>
          <Input
            value={state.product.name}
            onChange={(e) => updateNested("product", "name", e.target.value)}
            placeholder="The SaaS Launch Playbook"
            className="h-10 rounded-xl"
            style={theme.inputStyle}
          />
        </FieldGroup>

        <FieldGroup label="Tagline / Subtitle" required>
          <Input
            value={state.product.tagline}
            onChange={(e) => updateNested("product", "tagline", e.target.value)}
            placeholder="From Zero to First 100 Customers"
            className="h-10 rounded-xl"
            style={theme.inputStyle}
          />
        </FieldGroup>

        <FieldGroup label="Hero badge text">
          <Input
            value={state.product.badge}
            onChange={(e) => updateNested("product", "badge", e.target.value)}
            placeholder="New Edition — 2025"
            className="h-10 rounded-xl"
            style={theme.inputStyle}
          />
        </FieldGroup>

        <FieldGroup label="Description" className="sm:col-span-2" required>
          <Textarea
            value={state.product.description}
            onChange={(e) =>
              updateNested("product", "description", e.target.value)
            }
            placeholder="One paragraph that describes your product and its core value."
            rows={3}
            className="rounded-xl resize-none"
            style={theme.inputStyle}
          />
        </FieldGroup>

        {state.templateType === "ebook" && (
          <>
            <FieldGroup label="Price ($)">
              <Input
                type="number"
                value={state.product.price}
                onChange={(e) =>
                  updateNested("product", "price", Number(e.target.value))
                }
                min={0}
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Original price ($) — shown crossed out">
              <Input
                type="number"
                value={state.product.originalPrice}
                onChange={(e) =>
                  updateNested(
                    "product",
                    "originalPrice",
                    Number(e.target.value)
                  )
                }
                min={0}
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Format (e.g. PDF + EPUB)">
              <Input
                value={state.product.format}
                onChange={(e) => updateNested("product", "format", e.target.value)}
                placeholder="PDF + EPUB"
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Page count">
              <Input
                type="number"
                value={state.product.pages}
                onChange={(e) =>
                  updateNested("product", "pages", Number(e.target.value))
                }
                min={1}
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
          </>
        )}

        {state.templateType === "mobile-app" && (
          <>
            <FieldGroup label="App Store URL (iOS)" className="sm:col-span-2">
              <Input
                value={state.app.appStoreUrl}
                onChange={(e) => updateNested("app", "appStoreUrl", e.target.value)}
                placeholder="https://apps.apple.com/app/id..."
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup
              label="Google Play URL (Android)"
              className="sm:col-span-2"
            >
              <Input
                value={state.app.playStoreUrl}
                onChange={(e) => updateNested("app", "playStoreUrl", e.target.value)}
                placeholder="https://play.google.com/store/apps/details?id=..."
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="iOS rating (0–5)">
              <Input
                type="number"
                step={0.1}
                min={0}
                max={5}
                value={state.app.iosRating}
                onChange={(e) =>
                  updateNested("app", "iosRating", Number(e.target.value))
                }
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Android rating (0–5)">
              <Input
                type="number"
                step={0.1}
                min={0}
                max={5}
                value={state.app.androidRating}
                onChange={(e) =>
                  updateNested("app", "androidRating", Number(e.target.value))
                }
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Total downloads (display text)">
              <Input
                value={state.app.downloads}
                onChange={(e) => updateNested("app", "downloads", e.target.value)}
                placeholder="e.g. 250k+"
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Category / subtitle">
              <Input
                value={state.app.category}
                onChange={(e) => updateNested("app", "category", e.target.value)}
                placeholder="Navigation · Outdoors"
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Premium price ($) — optional">
              <Input
                type="number"
                value={state.product.price}
                onChange={(e) =>
                  updateNested("product", "price", Number(e.target.value))
                }
                min={0}
                placeholder="0 to hide the Premium card"
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Premium original price ($)">
              <Input
                type="number"
                value={state.product.originalPrice}
                onChange={(e) =>
                  updateNested(
                    "product",
                    "originalPrice",
                    Number(e.target.value)
                  )
                }
                min={0}
                className="h-10 rounded-xl"
                style={theme.inputStyle}
              />
            </FieldGroup>
          </>
        )}

        {state.templateType !== "saas" &&
          state.templateType !== "mobile-app" && (
            <>
              <FieldGroup label="Free download CTA label">
                <Input
                  value={state.leadMagnet.title}
                  onChange={(e) =>
                    updateNested("leadMagnet", "title", e.target.value)
                  }
                  placeholder="Get Free Sample Chapter"
                  className="h-10 rounded-xl"
                  style={theme.inputStyle}
                />
              </FieldGroup>
              <FieldGroup label="Email form description">
                <Input
                  value={state.leadMagnet.description}
                  onChange={(e) =>
                    updateNested("leadMagnet", "description", e.target.value)
                  }
                  placeholder="We'll send you the free chapter instantly."
                  className="h-10 rounded-xl"
                  style={theme.inputStyle}
                />
              </FieldGroup>
            </>
          )}
      </div>
    </div>
  );
}

function BrandingStep({
  state,
  updateNested,
}: {
  state: WizardState;
  updateNested: <K extends keyof WizardState>(
    key: K,
    field: string,
    value: unknown
  ) => void;
}) {
  const theme = useWizardTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="font-heading text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Branding &amp; integrations
        </h1>
        <p style={{ color: theme.muted }}>
          Upload your logo, set brand colors, and connect Stripe.
        </p>
      </div>

      <Section label="Brand Colors">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                updateNested("brand", "primaryColor", preset.primary);
                updateNested("brand", "accentColor", preset.accent);
              }}
              className="flex items-center gap-3 p-3 rounded-xl border transition-all text-left min-h-11"
              style={
                state.brand.primaryColor === preset.primary
                  ? {
                      border: `1px solid var(--brand-primary)`,
                      background: `color-mix(in srgb, var(--brand-primary) 10%, ${theme.page})`,
                    }
                  : { ...theme.glassCard }
              }
            >
              <div className="flex gap-1.5 flex-shrink-0">
                <div
                  className="w-5 h-5 rounded-full shadow-md"
                  style={{ background: preset.primary }}
                />
                <div
                  className="w-5 h-5 rounded-full shadow-md"
                  style={{ background: preset.accent }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: theme.text }}
              >
                {preset.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FieldGroup label="Primary color">
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={state.brand.primaryColor}
                onChange={(e) =>
                  updateNested("brand", "primaryColor", e.target.value)
                }
                className="w-12 h-10 rounded-lg cursor-pointer p-0.5"
                style={{
                  background: "transparent",
                  border: `1px solid ${theme.cardBorder}`,
                }}
              />
              <Input
                value={state.brand.primaryColor}
                onChange={(e) =>
                  updateNested("brand", "primaryColor", e.target.value)
                }
                placeholder="#6366f1"
                className="h-10 rounded-xl font-mono"
                style={theme.inputStyle}
              />
            </div>
          </FieldGroup>
          <FieldGroup label="Accent color">
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={state.brand.accentColor}
                onChange={(e) =>
                  updateNested("brand", "accentColor", e.target.value)
                }
                className="w-12 h-10 rounded-lg cursor-pointer p-0.5"
                style={{
                  background: "transparent",
                  border: `1px solid ${theme.cardBorder}`,
                }}
              />
              <Input
                value={state.brand.accentColor}
                onChange={(e) =>
                  updateNested("brand", "accentColor", e.target.value)
                }
                placeholder="#8b5cf6"
                className="h-10 rounded-xl font-mono"
                style={theme.inputStyle}
              />
            </div>
          </FieldGroup>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 items-center">
          <button
            className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg min-h-11"
            style={{
              background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
            }}
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

      <Section
        label="Logo"
        description="Upload a logo image or paste a URL. Shown in the navbar instead of the text brand name."
      >
        <ImageUploadField
          label="Logo"
          value={state.brand.logoUrl}
          onChange={(url) => updateNested("brand", "logoUrl", url)}
          uploadType="logo"
          previewHeight={96}
        />
      </Section>

      <Section
        label="Product / Hero Image"
        description="Upload a product mockup, screenshot, or hero illustration. Shown in the hero section. Recommended: 800×600 px or wider."
      >
        <ImageUploadField
          label="Product image"
          value={state.brand.productImageUrl}
          onChange={(url) => updateNested("brand", "productImageUrl", url)}
          uploadType="product"
          previewHeight={200}
        />
      </Section>

      <Disclosure label="Open-Graph / social share image" tone="common">
        <p className="text-xs leading-relaxed" style={{ color: theme.muted }}>
          Shown when someone pastes your URL into Twitter, LinkedIn, Slack,
          etc. Recommended: 1200×630 px. Falls back to your product image if
          left empty.
        </p>
        <ImageUploadField
          label="OG image"
          value={state.brand.ogImageUrl}
          onChange={(url) => updateNested("brand", "ogImageUrl", url)}
          uploadType="og"
          previewHeight={160}
        />
      </Disclosure>

      <Section label="Integrations">
        <p className="text-xs mb-2" style={{ color: theme.subtle }}>
          Pick your checkout and email providers. FREE ships with Stripe one-time
          and a no-op email logger. Locked cards unlock in LaunchKit PRO.
        </p>

        <div className="space-y-5">
          <ProviderPickerGroup
            label="Checkout"
            kind="checkout"
            value={state.integrations.checkoutProvider}
            onChange={(id) =>
              updateNested("integrations", "checkoutProvider", id)
            }
          />

          <ProviderPickerGroup
            label="Email capture"
            kind="email"
            value={state.integrations.emailProvider}
            onChange={(id) => updateNested("integrations", "emailProvider", id)}
          />
        </div>
      </Section>

      <Section label="Stripe (optional)">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-[#635BFF]/20 flex items-center justify-center">
            <span className="text-[#635BFF] text-xs font-black">S</span>
          </div>
          <a
            href="https://dashboard.stripe.com/apikeys"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs flex items-center gap-1 transition-colors hover:underline"
            style={{ color: theme.muted }}
          >
            Get API keys <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-4">
          <FieldGroup label="Publishable key (pk_live_... or pk_test_...)">
            <Input
              value={state.integrations.stripePublishableKey}
              onChange={(e) =>
                updateNested(
                  "integrations",
                  "stripePublishableKey",
                  e.target.value
                )
              }
              placeholder="pk_test_..."
              className="h-10 rounded-xl font-mono"
              style={theme.inputStyle}
            />
          </FieldGroup>

          {state.templateType === "ebook" && (
            <FieldGroup
              label="Price ID for your product (price_...)"
              hint="Create a product in Stripe Dashboard → Products, then copy the price ID."
            >
              <Input
                value={state.integrations.stripePriceId}
                onChange={(e) =>
                  updateNested("integrations", "stripePriceId", e.target.value)
                }
                placeholder="price_..."
                className="h-10 rounded-xl font-mono"
                style={theme.inputStyle}
              />
            </FieldGroup>
          )}

          <FieldGroup label="Your site base URL">
            <Input
              value={state.integrations.baseUrl}
              onChange={(e) =>
                updateNested("integrations", "baseUrl", e.target.value)
              }
              placeholder="https://yoursite.com"
              className="h-10 rounded-xl font-mono"
              style={theme.inputStyle}
            />
          </FieldGroup>
        </div>

        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <p className="text-amber-400 text-sm font-semibold mb-1">
            Never commit secret keys
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: theme.muted }}
          >
            Set <code className="text-amber-300">STRIPE_SECRET_KEY</code> in{" "}
            <code className="text-amber-300">.env.local</code> only — not here.
          </p>
        </div>
      </Section>
    </div>
  );
}

function CopyStep({
  state,
  onHeroCopyChange,
  onHeroCtaChange,
  onNewsletterChange,
  onFaqChange,
}: {
  state: WizardState;
  onHeroCopyChange: (
    field: keyof WizardState["sections"]["hero"],
    value: unknown
  ) => void;
  onHeroCtaChange: (
    key: "ctaPrimary" | "ctaSecondary",
    label: string
  ) => void;
  onNewsletterChange: (
    field: keyof WizardState["sections"]["newsletter"],
    value: string
  ) => void;
  onFaqChange: (items: FaqItemState[]) => void;
}) {
  const theme = useWizardTheme();
  const hero = state.sections.hero;
  const newsletter = state.sections.newsletter;
  const faq = state.sections.faq.items;

  const addFaq = () => onFaqChange([...faq, { q: "", a: "" }]);
  const removeFaq = (idx: number) =>
    onFaqChange(faq.filter((_, i) => i !== idx));
  const updateFaq = (idx: number, field: "q" | "a", value: string) =>
    onFaqChange(faq.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="font-heading text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: theme.text }}
        >
          Write your copy
        </h1>
        <p style={{ color: theme.muted }}>
          Override the default headline, CTAs, and FAQ. Leave anything blank to
          keep the template defaults — those are already launch-ready.
        </p>
      </div>

      <Section
        label="Hero copy"
        description="Shown as the biggest text on the page. Keep the headline under ~70 characters for mobile."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldGroup
            label="Headline"
            hint="e.g. Launch your SaaS in a weekend."
            className="sm:col-span-2"
          >
            <Textarea
              value={hero.headline}
              onChange={(e) => onHeroCopyChange("headline", e.target.value)}
              placeholder="Leave empty to use the template default."
              rows={2}
              className="rounded-xl resize-none"
              style={theme.inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Primary CTA label" hint="The big gradient button.">
            <Input
              value={hero.ctaPrimary.label}
              onChange={(e) => onHeroCtaChange("ctaPrimary", e.target.value)}
              placeholder="Buy Now — $49"
              className="h-10 rounded-xl"
              style={theme.inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Secondary CTA label" hint="Optional ghost button.">
            <Input
              value={hero.ctaSecondary.label}
              onChange={(e) => onHeroCtaChange("ctaSecondary", e.target.value)}
              placeholder="Free Preview"
              className="h-10 rounded-xl"
              style={theme.inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Subheadline" className="sm:col-span-2">
            <Textarea
              value={hero.subheadline}
              onChange={(e) => onHeroCopyChange("subheadline", e.target.value)}
              placeholder="Leave empty to use the template default."
              rows={2}
              className="rounded-xl resize-none"
              style={theme.inputStyle}
            />
          </FieldGroup>
        </div>

        <Disclosure label="Hero eyebrow" tone="advanced">
          <FieldGroup
            label="Eyebrow text"
            hint="Small label above the headline (e.g. an announcement badge)."
          >
            <Input
              value={hero.eyebrow}
              onChange={(e) => onHeroCopyChange("eyebrow", e.target.value)}
              placeholder="New release · 2026"
              className="h-10 rounded-xl"
              style={theme.inputStyle}
            />
          </FieldGroup>
        </Disclosure>
      </Section>

      <Section
        label="Newsletter block"
        description="Copy for the inline newsletter signup section."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldGroup label="Heading">
            <Input
              value={newsletter.heading}
              onChange={(e) => onNewsletterChange("heading", e.target.value)}
              placeholder="Join 3,000+ builders"
              className="h-10 rounded-xl"
              style={theme.inputStyle}
            />
          </FieldGroup>
          <FieldGroup label="Subscribe button label">
            <Input
              value={newsletter.ctaLabel}
              onChange={(e) => onNewsletterChange("ctaLabel", e.target.value)}
              placeholder="Subscribe"
              className="h-10 rounded-xl"
              style={theme.inputStyle}
            />
          </FieldGroup>
          <FieldGroup label="Subheading" className="sm:col-span-2">
            <Textarea
              value={newsletter.subheading}
              onChange={(e) => onNewsletterChange("subheading", e.target.value)}
              placeholder="One short email every Friday. No spam."
              rows={2}
              className="rounded-xl resize-none"
              style={theme.inputStyle}
            />
          </FieldGroup>
        </div>
      </Section>

      <Section
        label="FAQ"
        description="Questions added here replace the template defaults. Leave the list empty to keep them."
      >
        <div className="space-y-3">
          {faq.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl p-4 space-y-3"
              style={{ border: `1px solid ${theme.cardBorder}` }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-[10px] uppercase tracking-wider font-semibold mt-2"
                  style={{ color: theme.subtle }}
                >
                  Q{idx + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <Input
                    value={item.q}
                    onChange={(e) => updateFaq(idx, "q", e.target.value)}
                    placeholder="Question"
                    className="h-10 rounded-xl"
                    style={theme.inputStyle}
                  />
                  <Textarea
                    value={item.a}
                    onChange={(e) => updateFaq(idx, "a", e.target.value)}
                    placeholder="Answer"
                    rows={2}
                    className="rounded-xl resize-none"
                    style={theme.inputStyle}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10"
                  style={{
                    color: theme.muted,
                    border: `1px solid ${theme.cardBorder}`,
                  }}
                  aria-label="Remove FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80 min-h-11"
            style={{
              background: theme.cardBg,
              border: `1px dashed ${theme.cardBorder}`,
              color: theme.muted,
            }}
          >
            <Plus className="w-4 h-4" />
            Add FAQ item
          </button>
        </div>
      </Section>
    </div>
  );
}

function FinishStep({
  state,
  saveResult,
  selectedHeroVariant,
  selectedTemplate,
  onDownload,
  onRestart,
}: {
  state: WizardState;
  saveResult: {
    success: boolean;
    readOnly?: boolean;
    config?: unknown;
    message?: string;
  } | null;
  selectedHeroVariant: string;
  selectedTemplate: string;
  onDownload: () => void;
  onRestart: () => void;
}) {
  const theme = useWizardTheme();
  return (
    <div className="space-y-8 max-w-lg">
      <div className="text-center space-y-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl"
          style={{
            background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
          }}
        >
          <Check className="w-10 h-10 text-white" />
        </div>
        <h1
          className="font-heading text-3xl font-bold"
          style={{ color: theme.text }}
        >
          {saveResult?.success ? "Config saved!" : "Almost there"}
        </h1>
        {saveResult?.message && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: theme.muted }}
          >
            {saveResult.message}
          </p>
        )}
      </div>

      {saveResult?.readOnly && (
        <div className="rounded-2xl p-5 space-y-3" style={theme.glassCard}>
          <p
            className="font-semibold text-sm"
            style={{ color: theme.text }}
          >
            Download your config file and commit it to your repo:
          </p>
          <Button
            onClick={onDownload}
            variant="outline"
            className="w-full rounded-xl min-h-11"
            style={{ ...theme.glassCard, color: theme.text }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download site.config.json
          </Button>
          <p className="text-xs" style={{ color: theme.subtle }}>
            Place it at <code>lib/site.config.json</code> and redeploy.
          </p>
        </div>
      )}

      {saveResult?.success && (
        <div className="rounded-2xl p-5 space-y-2" style={theme.glassCard}>
          <p className="text-sm" style={{ color: theme.muted }}>
            <strong style={{ color: theme.text }}>Content changes</strong> take
            effect after restarting your dev server.
          </p>
          <p className="text-sm" style={{ color: theme.muted }}>
            <strong style={{ color: theme.text }}>Colors &amp; theme</strong>{" "}
            update on the next page load.
          </p>
        </div>
      )}

      <div className="rounded-2xl p-5 space-y-3" style={theme.glassCard}>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: theme.subtle }}
        >
          Configuration summary
        </p>
        {[
          { label: "Template", value: selectedTemplate },
          { label: "Hero variant", value: selectedHeroVariant },
          {
            label: "Theme",
            value: state.theme === "light" ? "Light / White" : "Dark",
          },
          { label: "Brand", value: state.brand.name },
          { label: "Product", value: state.product.name },
          {
            label: "Logo",
            value: state.brand.logoUrl ? "Set" : "Not set",
          },
          {
            label: "Product image",
            value: state.brand.productImageUrl ? "Set" : "Not set",
          },
          {
            label: "OG image",
            value: state.brand.ogImageUrl ? "Set" : "Not set",
          },
          {
            label: "Stripe key",
            value: state.integrations.stripePublishableKey ? "Set" : "Not set",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm" style={{ color: theme.subtle }}>
              {label}
            </span>
            <span
              className="text-sm font-mono truncate max-w-[200px]"
              style={{ color: theme.text }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button
            className="w-full font-bold rounded-xl text-white border-0 shadow-lg min-h-11"
            style={{
              background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
            }}
          >
            View Landing Page
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Button
          onClick={onRestart}
          variant="outline"
          className="rounded-xl min-h-11"
          style={{ ...theme.glassCard, color: theme.text }}
        >
          Edit again
        </Button>
      </div>
    </div>
  );
}
