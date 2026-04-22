import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SiteConfigSchema } from "@/lib/schema";

const CONFIG_PATH = path.join(process.cwd(), "lib", "site.config.json");

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    let existing: Record<string, unknown> = {};
    try {
      existing = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as Record<
        string,
        unknown
      >;
    } catch {
      // File might not exist yet — start fresh.
    }

    const merged = deepMerge(existing, body);
    merged.configured = true;
    if (merged.version === undefined) merged.version = 2;

    const parsed = SiteConfigSchema.safeParse(merged);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Config failed validation",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            code: i.code,
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    // Persist the merged raw shape (not the fully-resolved/defaulted one) so
    // that site.config.json stays minimal and user-authored, not bloated with
    // every default value from the schema.
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), "utf8");
      return NextResponse.json({
        success: true,
        message:
          "Config saved. Restart your dev server (or redeploy) to apply content changes. Colors update on next page load.",
      });
    } catch {
      return NextResponse.json({
        success: false,
        readOnly: true,
        config: merged,
        message:
          "Filesystem is read-only. Download the config below and commit it as lib/site.config.json.",
      });
    }
  } catch (err) {
    console.error("[save-config] Error:", err);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (
      sv !== null &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv !== null &&
      typeof tv === "object" &&
      !Array.isArray(tv)
    ) {
      output[key] = deepMerge(
        tv as Record<string, unknown>,
        sv as Record<string, unknown>
      );
    } else {
      output[key] = sv;
    }
  }
  return output;
}
