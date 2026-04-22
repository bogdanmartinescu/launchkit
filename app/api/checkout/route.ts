import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getCheckoutProvider } from "@/lib/integrations/registry";
import { IntegrationError } from "@/lib/integrations/types";

/**
 * Checkout dispatcher.
 *
 * Reads the active provider id from `siteConfig.integrations.checkoutProvider`,
 * resolves it through the registry, and delegates to `provider.createSession`.
 *
 * FREE builds ship with Stripe only; PRO builds add LemonSqueezy / Paddle /
 * Gumroad via additional loaders in the registry.
 *
 * Graceful degradation: the Stripe provider itself short-circuits to a demo
 * success URL when the key or price id isn't set, so this route stays
 * navigable during setup.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    priceId?: unknown;
    couponCode?: unknown;
    email?: unknown;
  };

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    siteConfig.integrations.baseUrl?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const providerId = siteConfig.integrations.checkoutProvider || "stripe";
  const priceId =
    typeof body.priceId === "string" && body.priceId.trim().length > 0
      ? body.priceId
      : siteConfig.integrations.stripePriceId;

  try {
    const provider = await getCheckoutProvider(providerId);
    const session = await provider.createSession({
      priceId,
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/#pricing`,
      email: typeof body.email === "string" ? body.email : undefined,
      couponCode:
        typeof body.couponCode === "string" ? body.couponCode : undefined,
    });

    return NextResponse.json(session);
  } catch (err) {
    if (err instanceof IntegrationError) {
      return NextResponse.json(
        {
          error: err.message,
          code: err.code,
          provider: err.provider ?? providerId,
        },
        { status: err.status }
      );
    }
    console.error("[api/checkout] unexpected error:", err);
    return NextResponse.json(
      {
        error: "Unexpected error creating checkout session.",
        code: "unexpected",
      },
      { status: 500 }
    );
  }
}
