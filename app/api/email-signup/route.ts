import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getEmailProvider } from "@/lib/integrations/registry";
import { IntegrationError } from "@/lib/integrations/types";

/**
 * Email signup dispatcher.
 *
 * Resolves the configured email provider from
 * `siteConfig.integrations.emailProvider` and delegates to
 * `provider.subscribe`. FREE builds ship with the "none" provider (console
 * log); PRO adds Resend / Mailchimp / ConvertKit / Loops.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    email?: unknown;
    source?: unknown;
    tags?: unknown;
  };

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email", code: "invalid-email" },
      { status: 400 }
    );
  }

  const providerId = siteConfig.integrations.emailProvider || "none";
  const source = typeof body.source === "string" ? body.source : undefined;
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === "string")
    : undefined;

  try {
    const provider = await getEmailProvider(providerId);
    const result = await provider.subscribe({ email, source, tags });
    return NextResponse.json({ success: result.ok });
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
    console.error("[api/email-signup] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error", code: "unexpected" },
      { status: 500 }
    );
  }
}
