import siteConfigJson from "./site.config.json";
import { ebookDefaults } from "./templates/ebook";
import { saasDefaults } from "./templates/saas";
import { emailDefaults } from "./templates/email";
import { mobileAppDefaults } from "./templates/mobile-app";
import {
  SiteConfigSchema,
  type SiteConfigInput,
  type SiteConfigResolved,
  type TemplateType,
} from "./schema";

/**
 * Config resolver — the single code path that turns `site.config.json` into
 * the validated `siteConfig` object every component imports.
 *
 * Pipeline:
 *   1. Load raw JSON from `site.config.json`.
 *   2. Migrate legacy (v1) shapes in-memory so builds never fail on stale files.
 *   3. Pick template defaults keyed by `templateType`.
 *   4. Deep-merge template defaults <- JSON overrides.
 *   5. Resolve `"<env:KEY>"` tokens against `process.env`.
 *   6. Validate + populate defaults via zod.
 */

const TEMPLATE_DEFAULTS: Record<TemplateType, SiteConfigInput> = {
  ebook: ebookDefaults,
  saas: saasDefaults,
  "email-collection": emailDefaults,
  "mobile-app": mobileAppDefaults,
};

type AnyRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is AnyRecord {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function deepMerge<T>(target: T, source: unknown): T {
  if (!isPlainObject(source)) return target;
  if (!isPlainObject(target)) return source as T;

  const out: AnyRecord = { ...(target as AnyRecord) };
  for (const key of Object.keys(source)) {
    const s = (source as AnyRecord)[key];
    const t = (target as AnyRecord)[key];
    if (isPlainObject(s) && isPlainObject(t)) {
      out[key] = deepMerge(t, s);
    } else if (s === undefined) {
      // Skip — undefined means "inherit default"
    } else {
      out[key] = s;
    }
  }
  return out as T;
}

const ENV_TOKEN_RE = /^<env:([A-Z0-9_]+)>$/;

function resolveEnvTokens<T>(value: T): T {
  if (typeof value === "string") {
    const match = ENV_TOKEN_RE.exec(value);
    if (match) {
      const envKey = match[1];
      const envValue = process.env[envKey];
      return (envValue ?? "") as unknown as T;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(resolveEnvTokens) as unknown as T;
  }
  if (isPlainObject(value)) {
    const out: AnyRecord = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolveEnvTokens(v);
    }
    return out as T;
  }
  return value;
}

/**
 * Best-effort upgrade of legacy (pre-`version: 2`) configs.
 *
 * The legacy shape kept content in top-level arrays (`features`, `testimonials`,
 * etc.) and held `heroVariant` as a top-level string. This function maps those
 * fields into the new `sections.*` tree so deep-merge produces a valid shape.
 */
export function migrateLegacy(raw: AnyRecord): AnyRecord {
  if (raw.version === 2) return raw;

  const migrated: AnyRecord = { ...raw, version: 2 };
  const sections: AnyRecord = isPlainObject(raw.sections)
    ? { ...(raw.sections as AnyRecord) }
    : {};

  if (typeof raw.heroVariant === "string") {
    const hero = isPlainObject(sections.hero) ? { ...sections.hero } : {};
    if (typeof hero.variant !== "string") hero.variant = raw.heroVariant;
    sections.hero = hero;
    delete migrated.heroVariant;
  }

  // Legacy top-level content lists → sections.<name>.items
  const legacyListMap: Record<string, string> = {
    features: "features",
    testimonials: "testimonials",
    faq: "faq",
    clients: "trustedBy",
    stats: "pricing",
    nav: "navbar",
  };

  for (const [legacyKey, sectionKey] of Object.entries(legacyListMap)) {
    const legacyValue = raw[legacyKey];
    if (!Array.isArray(legacyValue)) continue;
    const section = isPlainObject(sections[sectionKey])
      ? { ...(sections[sectionKey] as AnyRecord) }
      : {};
    if (legacyKey === "clients") {
      if (!("logos" in section)) section.logos = legacyValue;
    } else if (legacyKey === "stats") {
      if (!("stats" in section)) section.stats = legacyValue;
    } else if (legacyKey === "nav") {
      if (!("links" in section)) section.links = legacyValue;
    } else {
      if (!("items" in section)) section.items = legacyValue;
    }
    sections[sectionKey] = section;
    delete migrated[legacyKey];
  }

  // Legacy nested objects at the root (preview, pricing, social)
  if (isPlainObject(raw.preview)) {
    const preview = isPlainObject(sections.preview)
      ? { ...(sections.preview as AnyRecord) }
      : {};
    const legacyPreview = raw.preview;
    const author = {
      name: legacyPreview.authorName,
      role: legacyPreview.authorRole,
      bio: legacyPreview.bio,
      avatar: legacyPreview.authorAvatar,
    };
    if (!preview.author) preview.author = author;
    if (!preview.tocItems && Array.isArray(legacyPreview.tocItems))
      preview.tocItems = legacyPreview.tocItems;
    if (!preview.bonusItems && Array.isArray(legacyPreview.bonusItems))
      preview.bonusItems = legacyPreview.bonusItems;
    sections.preview = preview;
    delete migrated.preview;
  }

  if (isPlainObject(raw.pricing)) {
    const pricing = isPlainObject(sections.pricing)
      ? { ...(sections.pricing as AnyRecord) }
      : {};
    const legacyPricing = raw.pricing;
    if (!pricing.features && Array.isArray(legacyPricing.features))
      pricing.features = legacyPricing.features;
    if (!pricing.guarantee && typeof legacyPricing.guarantee === "string")
      pricing.guarantee = legacyPricing.guarantee;
    if (!pricing.ctaLabel && typeof legacyPricing.ctaLabel === "string")
      pricing.ctaLabel = legacyPricing.ctaLabel;
    sections.pricing = pricing;
    delete migrated.pricing;
  }

  if (isPlainObject(raw.social)) {
    const footer = isPlainObject(sections.footer)
      ? { ...(sections.footer as AnyRecord) }
      : {};
    if (!footer.social) footer.social = raw.social;
    sections.footer = footer;
    delete migrated.social;
  }

  migrated.sections = sections;
  return migrated;
}

function resolveSiteConfig(): SiteConfigResolved {
  const raw = migrateLegacy({ ...(siteConfigJson as AnyRecord) });
  const templateType = (raw.templateType as TemplateType) ?? "ebook";
  const templateDefaults = TEMPLATE_DEFAULTS[templateType] ?? ebookDefaults;

  const merged = deepMerge(templateDefaults as AnyRecord, raw);
  const envResolved = resolveEnvTokens(merged);

  const result = SiteConfigSchema.safeParse(envResolved);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  • ${issue.path.join(".") || "<root>"}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `[launchkit] Invalid site.config.json — resolved shape failed validation:\n${formatted}`
    );
  }
  return result.data;
}

export const siteConfig: SiteConfigResolved = resolveSiteConfig();

// Convenience type exports used across components.
export type { SiteConfigResolved as SiteConfig, TemplateType } from "./schema";
