/**
 * Rewrite lib/site.config.json from the legacy v1 shape to v2.
 *
 * v1 kept content in top-level arrays (features, testimonials, faq, clients,
 * stats, nav) and top-level objects (preview, pricing, social). v2 groups
 * everything under `sections.<name>`.
 *
 * Usage:
 *   npm run migrate
 *
 * Safe to run repeatedly: if the file is already `version: 2`, it exits
 * without rewriting.
 */

import fs from "node:fs";
import path from "node:path";
import { migrateLegacy } from "../lib/config";
import { SiteConfigSchema } from "../lib/schema";

const CONFIG_PATH = path.join(process.cwd(), "lib", "site.config.json");

function main() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (parsed.version === 2) {
    console.log("[migrate-config] Already v2 — nothing to do.");
    return;
  }

  const migrated = migrateLegacy(parsed);

  // Validate the migrated raw JSON against the schema. We don't merge template
  // defaults here — the file should stay minimal (user overrides only).
  const check = SiteConfigSchema.safeParse(migrated);
  if (!check.success) {
    console.error("[migrate-config] Migrated config failed validation:");
    for (const issue of check.error.issues) {
      console.error(`  • ${issue.path.join(".") || "<root>"}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const backup = `${CONFIG_PATH}.v1.bak`;
  fs.writeFileSync(backup, raw, "utf8");
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(migrated, null, 2) + "\n", "utf8");
  console.log(`[migrate-config] Wrote v2 shape. Backup saved at ${path.relative(process.cwd(), backup)}.`);
}

main();
