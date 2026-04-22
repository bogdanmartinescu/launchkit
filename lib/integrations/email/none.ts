import type {
  ConnectionTestResult,
  EmailProvider,
  EmailSubscribeInput,
  EmailSubscribeOutput,
} from "../types";

/**
 * No-op email provider (FREE edition default).
 *
 * Accepts subscriptions and logs them to the server console. Useful during
 * development and for templates where email capture is a soft nice-to-have.
 *
 * For real delivery, switch to a PRO provider (Resend, Mailchimp, ConvertKit,
 * Loops) from the Integrations step in the setup wizard.
 */

async function subscribe(input: EmailSubscribeInput): Promise<EmailSubscribeOutput> {
  const source = input.source ?? "unknown";
  console.log(
    `[email/none] new subscriber: ${input.email} (source=${source}, tags=${(
      input.tags ?? []
    ).join(",")})`
  );
  return { ok: true };
}

async function testConnection(): Promise<ConnectionTestResult> {
  return {
    ok: true,
    message: "Console-log provider is always reachable.",
  };
}

export const noneEmail: EmailProvider = {
  id: "none",
  kind: "email",
  subscribe,
  testConnection,
};
