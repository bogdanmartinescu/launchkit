/**
 * Edition gate — determines whether this install runs the FREE or PRO feature set.
 *
 * Read priority:
 *   1. process.env.LAUNCHKIT_EDITION  (build-time, authoritative)
 *   2. fallback to "free"
 *
 * Keep this module tiny and dependency-free so it can be imported from
 * server routes, client components, and build scripts alike.
 */

export type Edition = "free" | "pro";

const VALID: readonly Edition[] = ["free", "pro"] as const;

function readRaw(): string | undefined {
  // Next.js inlines NEXT_PUBLIC_* envs for the client; LAUNCHKIT_EDITION
  // is server-only but we also mirror it as NEXT_PUBLIC_LAUNCHKIT_EDITION
  // when available so client code sees the same value.
  if (typeof process !== "undefined" && process.env) {
    return (
      process.env.LAUNCHKIT_EDITION ??
      process.env.NEXT_PUBLIC_LAUNCHKIT_EDITION
    );
  }
  return undefined;
}

export const EDITION: Edition = (() => {
  const raw = readRaw()?.toLowerCase().trim();
  return (VALID as readonly string[]).includes(raw ?? "")
    ? (raw as Edition)
    : "free";
})();

export const isPro = () => EDITION === "pro";
export const isFree = () => EDITION === "free";

/**
 * Guard used in PRO-only code paths. In FREE builds, this throws at call time
 * so any accidental execution surfaces loudly rather than silently no-op'ing.
 */
export function assertPro(feature: string): void {
  if (!isPro()) {
    throw new Error(
      `[launchkit] "${feature}" is a PRO feature. Upgrade to the PRO edition or set LAUNCHKIT_EDITION=pro.`
    );
  }
}
