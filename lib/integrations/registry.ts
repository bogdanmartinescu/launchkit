import { EDITION } from "@/lib/edition";
import { getCatalogEntry, listProviders } from "./catalog";
import {
  IntegrationError,
  type AnalyticsProvider,
  type AnyProvider,
  type CheckoutProvider,
  type EmailProvider,
  type IntegrationKind,
  type WebhookProvider,
} from "./types";

/**
 * Edition-aware provider registry.
 *
 * Lookup flow:
 *   1. Validate id against the catalog (`catalog.ts`).
 *   2. Reject PRO providers on FREE builds with a helpful `IntegrationError`.
 *   3. Dynamic-import the provider module. The mapping lives in the two
 *      `CHECKOUT_LOADERS` / `EMAIL_LOADERS` / etc. records below.
 *
 * Why a hand-maintained loader map instead of a path template? Because Next.js
 * needs static imports it can see at build time to include them in the bundle
 * — a computed path like `./checkout/${id}.ts` wouldn't get bundled. The
 * trade-off: adding a provider is two lines here (catalog + loader), both of
 * which are caught by TypeScript.
 *
 * PRO providers live in files that only exist in the private `launchkit/pro`
 * repo; the loaders below reference them via a `try/catch`-guarded dynamic
 * import that returns `null` in FREE so the bundler doesn't choke on missing
 * files. The PRO repo adds the real files and everything "just works".
 */

type Loader<T extends AnyProvider> = () => Promise<T>;

type LoaderMap<T extends AnyProvider> = Record<string, Loader<T>>;

// ── FREE loaders (always present in this public repo) ──────────────────────

const FREE_CHECKOUT: LoaderMap<CheckoutProvider> = {
  stripe: () => import("./checkout/stripe").then((m) => m.stripeCheckout),
};

const FREE_EMAIL: LoaderMap<EmailProvider> = {
  none: () => import("./email/none").then((m) => m.noneEmail),
};

// ── PRO loaders ─────────────────────────────────────────────────────────────
// These reference files that only exist in the private `launchkit/pro` repo.
// In FREE builds, they fail to resolve at call time — we catch that and throw
// an IntegrationError that clearly points the user to the upgrade path.
//
// We DO NOT import them statically. Instead we attempt the dynamic import at
// call time via `loadProModule()` so the FREE bundler never tries to follow
// the path.

async function loadProModule<T extends AnyProvider>(
  relPath: string,
  exportName: string
): Promise<T> {
  try {
    // Prefixing the path with a variable prevents the bundler from attempting
    // to statically resolve this import at FREE build time. In PRO builds
    // (where the files exist) Node/Next.js resolves it at first request.
    const prefix = "./";
    const mod = (await import(
      /* webpackIgnore: true */ `${prefix}${relPath}`
    )) as Record<string, T>;
    const provider = mod[exportName];
    if (!provider) {
      throw new IntegrationError({
        code: "provider-missing-export",
        message: `Provider module "${relPath}" loaded but did not export "${exportName}".`,
        status: 500,
      });
    }
    return provider;
  } catch (err) {
    if (err instanceof IntegrationError) throw err;
    throw new IntegrationError({
      code: "pro-provider-unavailable",
      message:
        "This provider is only available in LaunchKit PRO. Upgrade and set LAUNCHKIT_EDITION=pro to enable it.",
      status: 402,
    });
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function getCheckoutProvider(id: string): Promise<CheckoutProvider> {
  return resolveProvider<CheckoutProvider>("checkout", id, FREE_CHECKOUT);
}

export async function getEmailProvider(id: string): Promise<EmailProvider> {
  return resolveProvider<EmailProvider>("email", id, FREE_EMAIL);
}

export async function getAnalyticsProvider(id: string): Promise<AnalyticsProvider> {
  return resolveProvider<AnalyticsProvider>("analytics", id, {});
}

export async function getWebhookProvider(id: string): Promise<WebhookProvider> {
  return resolveProvider<WebhookProvider>("webhook", id, {});
}

async function resolveProvider<T extends AnyProvider>(
  kind: IntegrationKind,
  id: string,
  freeLoaders: LoaderMap<T>
): Promise<T> {
  const entry = getCatalogEntry(kind, id);
  if (!entry) {
    throw new IntegrationError({
      code: "unknown-provider",
      message: `No ${kind} provider with id "${id}".`,
      status: 400,
      provider: id,
    });
  }

  if (entry.edition === "free") {
    const loader = freeLoaders[id];
    if (!loader) {
      throw new IntegrationError({
        code: "provider-not-installed",
        message: `FREE ${kind} provider "${id}" is in the catalog but has no loader wired up. This is a developer bug.`,
        status: 500,
        provider: id,
      });
    }
    return loader();
  }

  // PRO provider — reject on FREE, attempt dynamic import on PRO.
  if (EDITION === "free") {
    throw new IntegrationError({
      code: "pro-only",
      message: `"${entry.displayName}" is a LaunchKit PRO integration. Upgrade and rebuild with LAUNCHKIT_EDITION=pro to enable it.`,
      status: 402,
      provider: id,
    });
  }

  const exportName = toCamel(`${id}-${kind}`); // e.g. "convertkit-email" → convertkitEmail
  return loadProModule<T>(`pro/${kind}/${id}`, exportName);
}

function toCamel(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Convenience: verifies every FREE provider the catalog declares has a loader
 * wired up. Called by tests + the dev-mode boot warning; guards against the
 * "added to catalog but forgot to register" class of bug.
 */
export function verifyFreeLoaders(): { ok: boolean; missing: string[] } {
  const declared = {
    checkout: Object.keys(FREE_CHECKOUT),
    email: Object.keys(FREE_EMAIL),
    analytics: [] as string[],
    webhook: [] as string[],
  } as const;
  const missing: string[] = [];
  for (const kind of ["checkout", "email", "analytics", "webhook"] as const) {
    for (const entry of listProviders(kind)) {
      if (entry.edition !== "free") continue;
      if (!declared[kind].includes(entry.id)) {
        missing.push(`${kind}:${entry.id}`);
      }
    }
  }
  return { ok: missing.length === 0, missing };
}
