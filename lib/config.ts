import siteConfigJson from "./site.config.json";
import { ebookContent } from "./templates/ebook";
import { saasContent } from "./templates/saas";
import { emailContent } from "./templates/email";

// Template type is driven by site.config.json — change it in the /setup wizard
const TEMPLATE_CONTENT = {
  ebook: ebookContent,
  saas: saasContent,
  "email-collection": emailContent,
} as const;

type TemplateType = keyof typeof TEMPLATE_CONTENT;

const templateType = (siteConfigJson.templateType as TemplateType) ?? "ebook";
const templateContent = TEMPLATE_CONTENT[templateType] ?? ebookContent;

// Merge: JSON config (wizard-configurable) + template-specific static content
export const siteConfig = {
  // --- From site.config.json (edit via /setup wizard) ---
  configured: siteConfigJson.configured,
  templateType,
  theme: (siteConfigJson.theme ?? "dark") as "dark" | "light",
  heroVariant: (siteConfigJson.heroVariant ?? "split") as string,
  brand: siteConfigJson.brand,
  product: siteConfigJson.product,
  leadMagnet: siteConfigJson.leadMagnet,
  pricingTiers: siteConfigJson.pricingTiers,
  integrations: siteConfigJson.integrations,

  // --- Template-specific static content (edit lib/templates/*.ts directly) ---
  features: templateContent.features,
  preview: templateContent.preview,
  pricing: templateContent.pricing,
  testimonials: templateContent.testimonials,
  clients: templateContent.clients,
  stats: templateContent.stats,
  faq: templateContent.faq,
  social: templateContent.social,
  nav: templateContent.nav,
} as const;

export type SiteConfig = typeof siteConfig;
export type { TemplateType };
