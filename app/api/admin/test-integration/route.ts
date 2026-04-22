import { NextRequest, NextResponse } from "next/server";
import { getCatalogEntry } from "@/lib/integrations/catalog";
import {
  getCheckoutProvider,
  getEmailProvider,
} from "@/lib/integrations/registry";
import {
  IntegrationError,
  type IntegrationKind,
} from "@/lib/integrations/types";

/**
 * Admin health-check endpoint for integration providers.
 *
 * POST body: `{ kind: "checkout" | "email", id: string }`
 *
 * Returns `{ ok: boolean, message?: string, missingEnv?: string[] }` plus the
 * catalog's `requiredEnv` list so the wizard can tell the user which env vars
 * to set.
 *
 * FREE-build responses:
 *   - If the provider is PRO, returns 402 with a helpful upgrade message.
 *   - If `testConnection` isn't implemented, returns `{ ok: true }` with a
 *     note — the provider is installable but can't be actively checked.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    kind?: unknown;
    id?: unknown;
  };

  const kind = body.kind;
  const id = body.id;
  if (
    (kind !== "checkout" && kind !== "email") ||
    typeof id !== "string" ||
    id.trim().length === 0
  ) {
    return NextResponse.json(
      {
        error:
          'Body must be { kind: "checkout" | "email", id: string }. FREE builds only support checkout + email health checks.',
        code: "invalid-request",
      },
      { status: 400 }
    );
  }

  const entry = getCatalogEntry(kind as IntegrationKind, id);
  if (!entry) {
    return NextResponse.json(
      {
        error: `Unknown ${kind} provider: "${id}".`,
        code: "unknown-provider",
      },
      { status: 400 }
    );
  }

  try {
    const provider =
      kind === "checkout"
        ? await getCheckoutProvider(id)
        : await getEmailProvider(id);

    if (!provider.testConnection) {
      return NextResponse.json({
        ok: true,
        message:
          "Provider does not implement testConnection; assumed reachable.",
        requiredEnv: entry.requiredEnv,
      });
    }

    const result = await provider.testConnection();
    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      missingEnv: result.missingEnv,
      requiredEnv: entry.requiredEnv,
    });
  } catch (err) {
    if (err instanceof IntegrationError) {
      return NextResponse.json(
        {
          ok: false,
          error: err.message,
          code: err.code,
          requiredEnv: entry.requiredEnv,
        },
        { status: err.status }
      );
    }
    console.error("[api/admin/test-integration] unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected error during health check.",
        code: "unexpected",
      },
      { status: 500 }
    );
  }
}
