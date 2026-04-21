import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "lib", "site.config.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Read existing config so we never lose fields not managed by the wizard
    let existing: Record<string, unknown> = {};
    try {
      existing = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    } catch {
      // File might not exist yet — start fresh
    }

    // Deep-merge wizard payload on top of existing config
    const merged = deepMerge(existing, body);
    merged.configured = true;

    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), "utf8");
      return NextResponse.json({ success: true, message: "Config saved. Restart your dev server (or redeploy) to apply content changes. Colors update on next page load." });
    } catch {
      // Filesystem is read-only (e.g. Vercel production)
      return NextResponse.json({
        success: false,
        readOnly: true,
        config: merged,
        message: "Filesystem is read-only. Download the config below and commit it as lib/site.config.json.",
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
