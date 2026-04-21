import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "lib", "site.config.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const config = JSON.parse(raw);
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Could not read config" }, { status: 500 });
  }
}
