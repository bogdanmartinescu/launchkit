/**
 * Shared interfaces for integration providers.
 *
 * Every provider (checkout, email, analytics, webhook) implements the matching
 * interface below and is discovered at runtime via `lib/integrations/registry`.
 *
 * Contract rules (enforced by code review, not TypeScript):
 *   - Providers are pure modules. No top-level side effects.
 *   - Read credentials from `process.env` only. `siteConfig.integrations.*`
 *     fields store `"<env:KEY>"` tokens that `lib/config.ts` resolves.
 *   - Throw `IntegrationError` on failure with a `code` and user-actionable
 *     `message`. Never leak raw SDK errors to the client.
 */

export type IntegrationKind = "checkout" | "email" | "analytics" | "webhook";

export type IntegrationEdition = "free" | "pro";

/**
 * Stable error envelope all providers use. The dispatcher catches it and maps
 * it to a JSON response with a sane status code.
 */
export class IntegrationError extends Error {
  readonly code: string;
  readonly status: number;
  readonly provider?: string;

  constructor(args: {
    code: string;
    message: string;
    status?: number;
    provider?: string;
  }) {
    super(args.message);
    this.name = "IntegrationError";
    this.code = args.code;
    this.status = args.status ?? 400;
    this.provider = args.provider;
  }
}

// ── Checkout ────────────────────────────────────────────────────────────────

export interface CheckoutSessionInput {
  /** Provider-specific product / price identifier (e.g. Stripe `price_...`). */
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
  /** Optional buyer email to prefill the checkout form. */
  email?: string;
  /** Optional coupon or promo code. */
  couponCode?: string;
  /** Optional pass-through metadata stored on the order for webhooks. */
  metadata?: Record<string, string>;
}

export interface CheckoutSessionOutput {
  /** Redirect the buyer here to complete payment. */
  url: string;
  /** When true, the session is a demo/test short-circuit (not a real charge). */
  demo?: boolean;
  /** Optional code describing why we fell back to demo mode. */
  reason?: string;
}

export interface CheckoutProvider {
  readonly id: string;
  readonly kind: "checkout";
  createSession(input: CheckoutSessionInput): Promise<CheckoutSessionOutput>;
  /** Optional health check invoked by `/api/admin/test-integration`. */
  testConnection?(): Promise<ConnectionTestResult>;
}

// ── Email ───────────────────────────────────────────────────────────────────

export interface EmailSubscribeInput {
  email: string;
  source?: string;
  listId?: string;
  tags?: string[];
  metadata?: Record<string, string>;
}

export interface EmailSubscribeOutput {
  ok: true;
}

export interface EmailProvider {
  readonly id: string;
  readonly kind: "email";
  subscribe(input: EmailSubscribeInput): Promise<EmailSubscribeOutput>;
  testConnection?(): Promise<ConnectionTestResult>;
}

// ── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsProvider {
  readonly id: string;
  readonly kind: "analytics";
  /**
   * Returns the `<script>` tag(s) to inject in `<head>`, or null if not
   * configured. Runs on the server.
   */
  scriptTag(): string | null;
  testConnection?(): Promise<ConnectionTestResult>;
}

// ── Webhooks ────────────────────────────────────────────────────────────────

export interface WebhookEvent {
  type: string;
  payload: Record<string, unknown>;
}

export interface WebhookProvider {
  readonly id: string;
  readonly kind: "webhook";
  send(event: WebhookEvent): Promise<{ ok: true }>;
  testConnection?(): Promise<ConnectionTestResult>;
}

// ── Shared ──────────────────────────────────────────────────────────────────

export interface ConnectionTestResult {
  ok: boolean;
  message?: string;
  /** Optional hints the UI can surface ("missing env var X", "bad API key"). */
  missingEnv?: string[];
}

export type AnyProvider =
  | CheckoutProvider
  | EmailProvider
  | AnalyticsProvider
  | WebhookProvider;
