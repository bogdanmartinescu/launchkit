import { z } from "zod";

/**
 * Single source of truth for the site config shape.
 *
 * Every field is `.optional()` and either has a sensible `.default()` or is
 * filled in by a template default at merge time (see `lib/config.ts`). This
 * lets users leave `lib/site.config.json` as sparse as they want — the pipeline
 * resolves everything to a fully-populated, validated object before hand-off
 * to UI components.
 *
 * Structure:
 *   - Business data (brand / product / leadMagnet / pricingTiers / integrations)
 *     lives at the top level.
 *   - Everything a section renders (headings, eyebrows, CTA labels, lists)
 *     lives under `sections.<sectionId>` so components never hold copy.
 */

export const TemplateTypeSchema = z.enum([
  "ebook",
  "saas",
  "email-collection",
  "mobile-app",
]);
export type TemplateType = z.infer<typeof TemplateTypeSchema>;

export const ThemeSchema = z.enum(["dark", "light"]);
export type Theme = z.infer<typeof ThemeSchema>;

// ── Business data ────────────────────────────────────────────────────────────

const BrandSchema = z.object({
  name: z.string().default("LaunchKit"),
  primaryColor: z.string().default("#6366f1"),
  accentColor: z.string().default("#8b5cf6"),
  logoUrl: z.string().default(""),
  productImageUrl: z.string().default(""),
  /** Open-Graph / Twitter card image. Shown when the URL is shared on social. */
  ogImageUrl: z.string().default(""),
});

const ProductSchema = z.object({
  name: z.string().default("LaunchKit"),
  tagline: z.string().default("Launch faster"),
  description: z.string().default(""),
  badge: z.string().default("New"),
  price: z.number().default(49),
  originalPrice: z.number().default(97),
  currency: z.string().default("USD"),
  format: z.string().default("PDF + EPUB"),
  pages: z.number().default(200),
  chapters: z.number().default(12),
});

const LeadMagnetSchema = z.object({
  title: z.string().default("Get Free Access"),
  description: z.string().default(""),
  filePath: z.string().default(""),
});

const PricingTierSchema = z.object({
  name: z.string(),
  price: z.number().nullable(),
  period: z.string().default("mo"),
  features: z.array(z.string()).default([]),
  isPopular: z.boolean().default(false),
  ctaLabel: z.string().default("Get Started"),
  stripePriceId: z.string().default(""),
});

/**
 * Mobile-app metadata — used by the `mobile-app` template. Safe to leave empty
 * on other template types; the mobile sections are the only ones that read it.
 */
const AppSchema = z.object({
  appStoreUrl: z.string().default(""),
  playStoreUrl: z.string().default(""),
  iosRating: z.number().min(0).max(5).default(0),
  androidRating: z.number().min(0).max(5).default(0),
  iosReviewCount: z.number().default(0),
  androidReviewCount: z.number().default(0),
  downloads: z.string().default(""),
  category: z.string().default(""),
  appIconUrl: z.string().default(""),
});

/**
 * Provider ids recognised by the integrations registry. Kept as plain strings
 * so PRO builds can extend the catalog without the schema being the limiting
 * factor — validation happens at dispatch time via `registry.ts`.
 */
const CheckoutProviderIdSchema = z.string().default("stripe");
const EmailProviderIdSchema = z.string().default("none");

const IntegrationsSchema = z.object({
  // Provider pickers drive the dispatcher in /api/checkout + /api/email-signup.
  checkoutProvider: CheckoutProviderIdSchema,
  emailProvider: EmailProviderIdSchema,
  stripePublishableKey: z.string().default(""),
  stripePriceId: z.string().default(""),
  baseUrl: z.string().default("http://localhost:3000"),
  // Optional / PRO: these can be empty strings in FREE
  resendApiKey: z.string().optional(),
  convertKitApiKey: z.string().optional(),
  mailchimpApiKey: z.string().optional(),
  plausibleDomain: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  posthogKey: z.string().optional(),
});

// ── Generic section building blocks ──────────────────────────────────────────

const CtaSchema = z.object({
  label: z.string().default(""),
  href: z.string().default("#"),
  action: z.enum(["link", "checkout", "dialog", "scroll"]).default("link"),
});

const ImageRefSchema = z.object({
  url: z.string().default(""),
  alt: z.string().default(""),
});

const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const LogoSchema = z.object({
  name: z.string(),
  logo: z.string().default(""),
});

const FeatureItemSchema = z.object({
  icon: z.string().default("Zap"),
  title: z.string(),
  body: z.string().default(""),
  highlight: z.string().default(""),
});

const TocItemSchema = z.object({
  chapter: z.number(),
  title: z.string(),
});

const TestimonialSchema = z.object({
  name: z.string(),
  role: z.string().default(""),
  avatar: z.string().default(""),
  quote: z.string(),
  stars: z.number().min(1).max(5).default(5),
  metric: z.string().default(""),
});

const FaqItemSchema = z.object({
  q: z.string(),
  a: z.string(),
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const AppScreenshotSchema = z.object({
  url: z.string().default(""),
  alt: z.string().default(""),
  caption: z.string().default(""),
});

/**
 * A single "feature showcase" row — a narrative block with a big product
 * screenshot on one side and a title / description / sub-benefits on the
 * other. Rows alternate sides automatically in the rendered component.
 */
const FeatureShowcaseItemSchema = z.object({
  eyebrow: z.string().default(""),
  title: z.string(),
  description: z.string().default(""),
  image: ImageRefSchema.default({ url: "", alt: "" }),
  /**
   * Renders the image inside a phone frame when `true`, or as a plain
   * rounded screenshot card when `false`. Defaults to `true` for mobile-app
   * templates; set to `false` for SaaS dashboard crops or browser screenshots.
   */
  inPhoneFrame: z.boolean().default(true),
  items: z.array(FeatureItemSchema).default([]),
});

const HowItWorksStepSchema = z.object({
  icon: z.string().default("Download"),
  title: z.string(),
  body: z.string().default(""),
});

// ── Per-section schemas ──────────────────────────────────────────────────────

const NavbarSectionSchema = z.object({
  enabled: z.boolean().default(true),
  ctaLabel: z.string().default(""),
  signInLabel: z.string().default("Sign In"),
  showSignIn: z.boolean().default(true),
  links: z.array(NavLinkSchema).default([]),
});

const HeroSectionSchema = z.object({
  enabled: z.boolean().default(true),
  variant: z.string().default("split"),
  eyebrow: z.string().default(""),
  headline: z.string().default(""),
  headlineAccent: z.string().default(""),
  subheadline: z.string().default(""),
  description: z.string().default(""),
  ctaPrimary: CtaSchema.default({ label: "", href: "#", action: "link" }),
  ctaSecondary: CtaSchema.default({ label: "", href: "#", action: "link" }),
  trustLine: z.string().default(""),
  socialProofLabel: z.string().default(""),
  image: ImageRefSchema.default({ url: "", alt: "" }),
  bullets: z.array(z.string()).default([]),
});

const TrustedBySectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  logos: z.array(LogoSchema).default([]),
});

const FeaturesSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  items: z.array(FeatureItemSchema).default([]),
});

const PreviewSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  tocHeading: z.string().default("Table of Contents"),
  bonusHeading: z.string().default("Included bonuses"),
  author: z
    .object({
      name: z.string().default(""),
      role: z.string().default(""),
      bio: z.string().default(""),
      avatar: z.string().default(""),
    })
    .default({ name: "", role: "", bio: "", avatar: "" }),
  tocItems: z.array(TocItemSchema).default([]),
  bonusItems: z.array(z.string()).default([]),
});

const PricingSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  badge: z.string().default(""),
  includedLabel: z.string().default("Everything included"),
  ctaLabel: z.string().default(""),
  guarantee: z.string().default(""),
  features: z.array(z.string()).default([]),
  stats: z.array(StatSchema).default([]),
});

const TestimonialsSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default("Testimonials"),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  items: z.array(TestimonialSchema).default([]),
});

const NewsletterSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  placeholder: z.string().default("Enter your email"),
  ctaLabel: z.string().default("Subscribe"),
  disclaimer: z.string().default(""),
  successMessage: z.string().default("You're on the list!"),
});

const FaqSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default("FAQ"),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  contactPrompt: z.string().default(""),
  contactEmail: z.string().default(""),
  items: z.array(FaqItemSchema).default([]),
});

const AppDownloadSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  trustLine: z.string().default(""),
  showQr: z.boolean().default(false),
  showRatings: z.boolean().default(true),
  showDownloads: z.boolean().default(true),
});

const FeatureShowcaseSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  items: z.array(FeatureShowcaseItemSchema).default([]),
});

const AppScreenshotsSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  items: z.array(AppScreenshotSchema).default([]),
});

const HowItWorksSectionSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  headingAccent: z.string().default(""),
  subheading: z.string().default(""),
  items: z.array(HowItWorksStepSchema).default([]),
});

const FooterSectionSchema = z.object({
  enabled: z.boolean().default(true),
  description: z.string().default(""),
  quickLinksHeading: z.string().default("Quick Links"),
  contactHeading: z.string().default("Contact"),
  contactEmail: z.string().default(""),
  legalLinks: z
    .array(NavLinkSchema)
    .default([
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ]),
  tagline: z.string().default("Built with Next.js & Tailwind CSS"),
  copyrightSuffix: z.string().default("All rights reserved."),
  social: z
    .object({
      twitter: z.string().default(""),
      github: z.string().default(""),
      linkedin: z.string().default(""),
    })
    .default({ twitter: "", github: "", linkedin: "" }),
});

// ── Sections grouped ─────────────────────────────────────────────────────────

const SectionsSchema = z.object({
  navbar: NavbarSectionSchema.default({} as never),
  hero: HeroSectionSchema.default({} as never),
  trustedBy: TrustedBySectionSchema.default({} as never),
  features: FeaturesSectionSchema.default({} as never),
  preview: PreviewSectionSchema.default({} as never),
  pricing: PricingSectionSchema.default({} as never),
  testimonials: TestimonialsSectionSchema.default({} as never),
  newsletter: NewsletterSectionSchema.default({} as never),
  faq: FaqSectionSchema.default({} as never),
  footer: FooterSectionSchema.default({} as never),
  // Mobile-app specific sections (ignored by other template types).
  appDownload: AppDownloadSectionSchema.default({} as never),
  appScreenshots: AppScreenshotsSectionSchema.default({} as never),
  howItWorks: HowItWorksSectionSchema.default({} as never),
  featureShowcase: FeatureShowcaseSectionSchema.default({} as never),
});

// ── Root ─────────────────────────────────────────────────────────────────────

export const SiteConfigSchema = z.object({
  // Schema version so migrations can branch on it.
  version: z.literal(2).default(2),
  configured: z.boolean().default(false),
  templateType: TemplateTypeSchema.default("ebook"),
  theme: ThemeSchema.default("dark"),
  brand: BrandSchema.default({} as never),
  product: ProductSchema.default({} as never),
  leadMagnet: LeadMagnetSchema.default({} as never),
  app: AppSchema.default({} as never),
  pricingTiers: z.array(PricingTierSchema).default([]),
  integrations: IntegrationsSchema.default({} as never),
  sections: SectionsSchema.default({} as never),
});

export type SiteConfigInput = z.input<typeof SiteConfigSchema>;
export type SiteConfigResolved = z.output<typeof SiteConfigSchema>;

// Convenience exported types — one per section, useful from components.
export type SectionsConfig = SiteConfigResolved["sections"];
export type NavbarConfig = SectionsConfig["navbar"];
export type HeroConfig = SectionsConfig["hero"];
export type TrustedByConfig = SectionsConfig["trustedBy"];
export type FeaturesConfig = SectionsConfig["features"];
export type PreviewConfig = SectionsConfig["preview"];
export type PricingConfig = SectionsConfig["pricing"];
export type TestimonialsConfig = SectionsConfig["testimonials"];
export type NewsletterConfig = SectionsConfig["newsletter"];
export type FaqConfig = SectionsConfig["faq"];
export type FooterConfig = SectionsConfig["footer"];
export type AppDownloadConfig = SectionsConfig["appDownload"];
export type AppScreenshotsConfig = SectionsConfig["appScreenshots"];
export type HowItWorksConfig = SectionsConfig["howItWorks"];
export type FeatureShowcaseConfig = SectionsConfig["featureShowcase"];
export type AppMeta = SiteConfigResolved["app"];
