import {
  IntegrationError,
  type CheckoutProvider,
  type CheckoutSessionInput,
  type CheckoutSessionOutput,
  type ConnectionTestResult,
} from "../types";

/**
 * Stripe one-time checkout provider (FREE edition).
 *
 * Graceful degradation: if `STRIPE_SECRET_KEY` is not set or the supplied
 * `priceId` is empty / a placeholder, the provider returns a demo session
 * pointing at `/success?demo=true` so the Buy-Now flow stays navigable
 * during setup.
 */

const DEMO_URL = "/success?demo=true";

function isPlaceholderPrice(id: unknown): boolean {
  if (typeof id !== "string") return true;
  const v = id.trim();
  return (
    v.length === 0 ||
    v === "price_placeholder" ||
    v.startsWith("price_placeholder")
  );
}

async function createSession(
  input: CheckoutSessionInput
): Promise<CheckoutSessionOutput> {
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

  if (!stripeConfigured) {
    return { url: DEMO_URL, demo: true, reason: "stripe-not-configured" };
  }
  if (isPlaceholderPrice(input.priceId)) {
    return { url: DEMO_URL, demo: true, reason: "price-not-configured" };
  }

  const priceId = input.priceId as string;

  try {
    const { stripe } = await import("@/lib/stripe");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      ...(input.email ? { customer_email: input.email } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
      ...(input.couponCode
        ? { discounts: [{ promotion_code: input.couponCode }] }
        : {}),
    });

    if (!session.url) {
      throw new IntegrationError({
        code: "stripe-no-url",
        message: "Stripe returned a session without a redirect URL.",
        status: 502,
        provider: "stripe",
      });
    }
    return { url: session.url };
  } catch (err) {
    if (err instanceof IntegrationError) throw err;
    console.error("[checkout/stripe] error:", err);
    return {
      url: DEMO_URL,
      demo: true,
      reason: "stripe-error",
    };
  }
}

async function testConnection(): Promise<ConnectionTestResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      ok: false,
      message: "STRIPE_SECRET_KEY is not set.",
      missingEnv: ["STRIPE_SECRET_KEY"],
    };
  }
  try {
    const { stripe } = await import("@/lib/stripe");
    const balance = await stripe.balance.retrieve();
    return {
      ok: true,
      message: `Connected to Stripe (livemode=${balance.livemode}).`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown Stripe error.",
    };
  }
}

export const stripeCheckout: CheckoutProvider = {
  id: "stripe",
  kind: "checkout",
  createSession,
  testConnection,
};
