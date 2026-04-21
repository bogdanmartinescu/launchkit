import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Placeholder — log to console and return success.
    // Replace this block with your email provider SDK (Resend, Mailchimp, ConvertKit, etc.)
    console.log(`[email-signup] New subscriber: ${email} (source: ${source ?? "unknown"})`);

    /*
     * Example with Resend:
     *
     * const resend = new Resend(process.env.RESEND_API_KEY);
     * await resend.contacts.create({
     *   email,
     *   audienceId: process.env.RESEND_AUDIENCE_ID!,
     * });
     * await resend.emails.send({
     *   from: "hello@yourdomain.com",
     *   to: email,
     *   subject: "Your free chapter is here!",
     *   html: `<p>Click <a href="${process.env.NEXT_PUBLIC_BASE_URL}/downloads/sample.pdf">here</a> to download your free chapter.</p>`,
     * });
     */

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[email-signup] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
