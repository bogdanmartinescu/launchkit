import type { IntegrationEdition, IntegrationKind } from "./types";

/**
 * Static metadata describing every integration provider LaunchKit knows about.
 *
 * This is deliberately a plain list (not an auto-discovered registry) because
 * it drives the wizard's "pick a provider" UI — we want PRO providers to show
 * as locked cards on FREE builds, not disappear entirely.
 *
 * The registry (see `registry.ts`) is what actually imports provider code; it
 * looks up entries here by id to decide (a) whether the build edition is
 * allowed to load this provider, and (b) which dynamic import to use.
 */

export interface CatalogEntry {
  id: string;
  kind: IntegrationKind;
  edition: IntegrationEdition;
  displayName: string;
  description: string;
  /** env vars the provider reads at runtime. Used for health checks + UX hints. */
  requiredEnv: readonly string[];
  /** Friendly link shown beside the card in the wizard. */
  docsUrl?: string;
}

export const INTEGRATIONS_CATALOG: readonly CatalogEntry[] = [
  // ── Checkout ──────────────────────────────────────────────────────────────
  {
    id: "stripe",
    kind: "checkout",
    edition: "free",
    displayName: "Stripe (one-time)",
    description: "One-time payment checkout powered by Stripe.",
    requiredEnv: ["STRIPE_SECRET_KEY"],
    docsUrl: "https://stripe.com/docs/payments/checkout",
  },
  {
    id: "stripe-subscription",
    kind: "checkout",
    edition: "pro",
    displayName: "Stripe (subscriptions)",
    description:
      "Recurring billing with Stripe Checkout + customer portal. PRO only.",
    requiredEnv: ["STRIPE_SECRET_KEY"],
    docsUrl: "https://stripe.com/docs/billing/subscriptions/checkout",
  },
  {
    id: "lemonsqueezy",
    kind: "checkout",
    edition: "pro",
    displayName: "LemonSqueezy",
    description: "Merchant-of-record checkout via LemonSqueezy. PRO only.",
    requiredEnv: ["LEMONSQUEEZY_API_KEY", "LEMONSQUEEZY_STORE_ID"],
    docsUrl: "https://docs.lemonsqueezy.com/",
  },
  {
    id: "paddle",
    kind: "checkout",
    edition: "pro",
    displayName: "Paddle",
    description: "Paddle Billing checkout + tax handling. PRO only.",
    requiredEnv: ["PADDLE_API_KEY", "PADDLE_VENDOR_ID"],
    docsUrl: "https://developer.paddle.com/",
  },
  {
    id: "gumroad",
    kind: "checkout",
    edition: "pro",
    displayName: "Gumroad",
    description: "Redirect to a Gumroad product page. PRO only.",
    requiredEnv: ["GUMROAD_ACCESS_TOKEN"],
    docsUrl: "https://help.gumroad.com/",
  },

  // ── Email ─────────────────────────────────────────────────────────────────
  {
    id: "none",
    kind: "email",
    edition: "free",
    displayName: "Console log (no-op)",
    description:
      "Logs subscribers to the server console. Useful during development.",
    requiredEnv: [],
  },
  {
    id: "resend",
    kind: "email",
    edition: "pro",
    displayName: "Resend",
    description: "Transactional + contact list via Resend. PRO only.",
    requiredEnv: ["RESEND_API_KEY", "RESEND_AUDIENCE_ID"],
    docsUrl: "https://resend.com/docs",
  },
  {
    id: "mailchimp",
    kind: "email",
    edition: "pro",
    displayName: "Mailchimp",
    description: "Audience sync via Mailchimp Marketing API. PRO only.",
    requiredEnv: ["MAILCHIMP_API_KEY", "MAILCHIMP_AUDIENCE_ID"],
    docsUrl: "https://mailchimp.com/developer/",
  },
  {
    id: "convertkit",
    kind: "email",
    edition: "pro",
    displayName: "ConvertKit / Kit",
    description: "Subscribe to Kit forms + sequences. PRO only.",
    requiredEnv: ["CONVERTKIT_API_KEY", "CONVERTKIT_FORM_ID"],
    docsUrl: "https://developers.kit.com/",
  },
  {
    id: "loops",
    kind: "email",
    edition: "pro",
    displayName: "Loops",
    description: "Creator-focused email + audience tags via Loops. PRO only.",
    requiredEnv: ["LOOPS_API_KEY"],
    docsUrl: "https://loops.so/docs",
  },

  // ── Analytics ────────────────────────────────────────────────────────────
  {
    id: "ga4",
    kind: "analytics",
    edition: "pro",
    displayName: "Google Analytics 4",
    description: "GA4 measurement via gtag.js. PRO only.",
    requiredEnv: ["NEXT_PUBLIC_GA4_ID"],
  },
  {
    id: "plausible",
    kind: "analytics",
    edition: "pro",
    displayName: "Plausible",
    description: "Privacy-friendly analytics via Plausible. PRO only.",
    requiredEnv: ["NEXT_PUBLIC_PLAUSIBLE_DOMAIN"],
  },
  {
    id: "posthog",
    kind: "analytics",
    edition: "pro",
    displayName: "PostHog",
    description: "Product analytics via PostHog. PRO only.",
    requiredEnv: ["NEXT_PUBLIC_POSTHOG_KEY"],
  },

  // ── Webhooks ─────────────────────────────────────────────────────────────
  {
    id: "discord",
    kind: "webhook",
    edition: "pro",
    displayName: "Discord",
    description: "Post events to a Discord channel webhook. PRO only.",
    requiredEnv: ["DISCORD_WEBHOOK_URL"],
  },
  {
    id: "slack",
    kind: "webhook",
    edition: "pro",
    displayName: "Slack",
    description: "Post events to a Slack incoming webhook. PRO only.",
    requiredEnv: ["SLACK_WEBHOOK_URL"],
  },
  {
    id: "zapier",
    kind: "webhook",
    edition: "pro",
    displayName: "Zapier / Generic webhook",
    description: "POST JSON to any URL (Zapier, Make, your own). PRO only.",
    requiredEnv: ["GENERIC_WEBHOOK_URL"],
  },
] as const;

export function listProviders(kind: IntegrationKind): readonly CatalogEntry[] {
  return INTEGRATIONS_CATALOG.filter((p) => p.kind === kind);
}

export function getCatalogEntry(
  kind: IntegrationKind,
  id: string
): CatalogEntry | undefined {
  return INTEGRATIONS_CATALOG.find((p) => p.kind === kind && p.id === id);
}
