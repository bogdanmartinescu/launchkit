@AGENTS.md

# LaunchKit — Project Rules & Architecture

This file is the source of truth for any AI agent (Claude, Cursor, Codex, etc.) working on the LaunchKit landing-page template. It complements [`PLAN.md`](PLAN.md) (the roadmap) and [`AGENTS.md`](AGENTS.md) (the Next.js-version warning).

If anything in this file conflicts with [`PLAN.md`](PLAN.md), this file wins for **how** to write code; `PLAN.md` wins for **what** to build.

---

## 1. Project overview

LaunchKit is a single-tenant Next.js 16 + Tailwind v4 + shadcn/ui landing-page template. A wizard at [`app/setup/page.tsx`](app/setup/page.tsx) writes [`lib/site.config.json`](lib/site.config.json), and the home page at [`app/page.tsx`](app/page.tsx) renders sections driven by that config.

The product ships in two editions:
- **FREE** — public MIT repo (`launchkit/free`).
- **PRO** — private repo (`launchkit/pro`), buyer access via GitHub collaborator invite.

PRO is a **superset** of FREE — same code, more templates, more sections, more integrations, more wizard steps. See `PLAN.md` §3 for the split strategy.

---

## 2. Core architecture

```mermaid
flowchart LR
    wizard[/setup wizard/] -->|POST| save[/api/admin/save-config/]
    wizard -->|POST file| upload[/api/admin/upload/]
    save --> json[lib/site.config.json]
    upload --> uploads[public/uploads/]
    json --> resolver[lib/config.ts]
    schema[lib/schema.ts] --> resolver
    defaults[lib/templates/TYPE.ts] --> resolver
    env[process.env] --> resolver
    resolver --> sections[components/sections/*]
    resolver --> apiRoutes[/api/checkout, /api/email-signup/]
    apiRoutes --> registry[lib/integrations/index.ts]
    registry --> providers[lib/integrations/checkout|email|analytics|webhooks/*]
```

**Six invariants — never violate these:**

Code invariants:
1. **Config is the only source of content.** Every string and image URL on the rendered page resolves from `siteConfig.sections.<name>`. No copy is hard-coded in section components.
2. **Secrets never enter `site.config.json`.** Secret fields store `"<env:KEY>"` placeholder tokens; [`lib/config.ts`](lib/config.ts) resolves them from `process.env` at runtime/build time.
3. **PRO code never runs on FREE builds.** PRO-only templates, sections, and integrations are dynamic-imported via `next/dynamic` keyed on `process.env.LAUNCHKIT_EDITION`, and edition-aware schema validation strips PRO-only fields on FREE.

Product invariants:
4. **Out-of-the-box deployable.** Every template's [`lib/templates/<type>.ts`](lib/templates/) ships with launch-ready demo content (realistic copy, real-looking numbers, royalty-free or pre-bundled images in [`public/images/`](public/images/)). Cloning the repo, running `npm run dev`, and visiting `/` must produce a credible page with zero edits. No "Lorem ipsum" anywhere.
5. **Progressive disclosure for customization.** Every wizard surface is tiered: **Essentials** always visible (≤5 fields per section, the high-leverage ones), **Common** revealed by a "Show more" toggle, **Advanced** collapsed under an "Advanced" disclosure. New options default to the highest tier that still makes sense; promote to a lower tier only if usage data justifies it.
6. **Mobile-first responsive.** Every section is designed and reviewed at 375px first. Tailwind classes are written smallest-first (`text-base md:text-lg`, never `md:text-lg text-base`). No horizontal scroll at any viewport from 320px to 1920px+. Tap targets ≥44×44 px. `next/image` always carries a correct `sizes` attribute.

---

## 3. Editions

Set by the build-time env var `LAUNCHKIT_EDITION` (`"free"` | `"pro"`, default `"free"`). Read via the helper:

```ts
// lib/edition.ts
export const EDITION = (process.env.LAUNCHKIT_EDITION ?? "free") as "free" | "pro";
export const isPro = EDITION === "pro";
```

The flag drives:

- Wizard template picker (PRO templates show with a lock icon in FREE).
- Schema validation (PRO fields rejected in FREE).
- Bundle composition (PRO modules tree-shaken from FREE builds).
- Footer credit (`"Made with LaunchKit"` removable only in PRO).

**Rule:** any new module that is PRO-only must export a default that errors helpfully if imported on FREE, and must be imported only via `import dynamic from "next/dynamic"` guarded by `isPro`.

---

## 4. Modularity rules

### 4.1 Section components (`components/sections/<template>/<Section>.tsx`)
- One file per section variant (e.g. `Hero.tsx`, `HeroSplit.tsx`, `HeroMinimal.tsx`).
- Read **only** from `siteConfig.sections.<name>`. No fetching, no global state, no `useState` for content.
- Take zero props. The variant switch happens in [`app/page.tsx`](app/page.tsx).
- Always wrap in a single `<section id="...">` matching the nav anchor.
- Animations: Framer Motion only; no CSS keyframes for transitional UI.

### 4.2 Templates (`lib/templates/<type>.ts`)
- Plain TypeScript object exports — no functions, no imports of React.
- Holds **defaults** for every section the template uses. Wizard merges user config on top.
- Must satisfy the per-template Zod variant of the schema.

### 4.3 Integrations (`lib/integrations/<kind>/<provider>.ts`)
- Each provider is a single file implementing a shared interface from [`lib/integrations/types.ts`](lib/integrations/types.ts).
- No top-level side effects. Lazy-instantiate SDK clients inside the exported functions.
- Read credentials from `process.env` only — never from `siteConfig.integrations.<provider>.apiKey` directly (those values are `<env:…>` tokens).
- Throw `IntegrationError` (defined in `types.ts`) with a `code` and a user-actionable `message` on failure.

### 4.4 Wizard components (`components/setup/*`)
- Client components (`"use client"` at top of file).
- Pure UI — receive state and `onChange` handlers. Wizard state lives in [`app/setup/page.tsx`](app/setup/page.tsx).
- Never call admin APIs directly except via the existing helper hooks (`useSaveConfig`, `useUpload`).

### 4.5 API routes (`app/api/**/route.ts`)
- One route per file. Default to `POST` for mutations, `GET` for reads.
- Validate request body with the relevant Zod schema before doing work.
- Return `NextResponse.json({ ... }, { status })`. Never throw raw errors to the client.
- Admin routes (`/api/admin/*`) must only run in dev or be feature-flagged off in production builds (filesystem writes are read-only on Vercel anyway, and the existing routes already detect this).

### 4.6 What never lives where

- No copy strings inside `components/sections/`.
- No SDK calls outside `lib/integrations/`.
- No direct file IO outside `app/api/admin/*` and `scripts/*`.
- No `process.env.*` reads outside `lib/config.ts`, `lib/edition.ts`, and `lib/integrations/*`.
- No Tailwind arbitrary colors that aren't either a theme token (`var(--brand-primary)`) or a CSS variable from [`app/globals.css`](app/globals.css).

---

## 5. File & naming conventions

- **Files**: `PascalCase.tsx` for React components, `camelCase.ts` for non-component modules, `kebab-case` for routes (Next.js convention) and scripts.
- **Components**: named exports, never `export default` for components (consistency with current codebase).
  - Exception: Next.js page/layout/route files **must** `export default`.
- **Types/interfaces**: PascalCase, suffix with `Props` for component props (`HeroProps`).
- **Boolean variables**: `is*`, `has*`, `should*`.
- **Imports**: ordered as (1) external, (2) `@/lib/*`, (3) `@/components/*`, (4) relative. Use `@/` alias (defined in [`tsconfig.json`](tsconfig.json) and [`components.json`](components.json)).
- **Path aliases** (from [`components.json`](components.json)):
  - `@/components`, `@/lib`, `@/components/ui`, `@/lib/utils`, `@/hooks`.
- **No `index.ts` barrels** in section directories (slows tree-shaking). One barrel allowed per integration kind: `lib/integrations/email/index.ts` re-exports the registry only.
- **Co-locate types** with the module that defines them, except when shared across modules — then put them in `lib/<domain>/types.ts`.
- **Comments**: only when the code can't speak for itself. Never narrate behavior. No "// import the foo".

---

## 6. Section component contract

Every section component must follow this skeleton:

```tsx
"use client"; // or omit if no client APIs used

import { siteConfig } from "@/lib/config";
import { motion } from "framer-motion";

export function Hero() {
  const cfg = siteConfig.sections.hero;
  if (!cfg.enabled) return null;

  return (
    <section id="hero" className="...">
      {/* render only from cfg.* */}
    </section>
  );
}
```

Rules:
- **Always** check `cfg.enabled` first and return `null` if false.
- **Always** wrap in `<section id="...">` matching the wizard's nav config.
- Image fields: prefer `next/image` with `width`/`height` from the config (fallback to defaults). Use `unoptimized` only for SVG logos. Always supply a `sizes` attribute matching the responsive layout (e.g. `sizes="(max-width: 768px) 100vw, 50vw"`).
- Headings: use the `font-heading` token (Sora) for h1–h3; body in default (Inter).
- Color usage: `var(--brand-primary)` and `var(--brand-accent)` — never hex literals.

### 6.1 Responsive baseline (mobile-first)
- Author every layout at 375px first; layer breakpoints upward.
- Tailwind classes ordered smallest-first: `class="px-4 md:px-8 lg:px-12"`, never the reverse.
- Sectioned content uses `container mx-auto px-4 sm:px-6 lg:px-8` (or the project's equivalent) — never fixed pixel widths.
- Grids: default to single column; add columns at `sm:` (≥640px) or `md:` (≥768px). Never start at `grid-cols-3`.
- Typography scale: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` for h1; pick a step lower for h2/h3 — keep this rhythm consistent across templates.
- Tap targets ≥44×44 px (`min-h-11 min-w-11` for icon buttons).
- No fixed `vh` units that break on mobile browser chrome — use `min-h-svh` / `min-h-dvh` where appropriate.
- Verify each section at iPhone SE (375), Pixel 7 (412), iPad (768), MacBook (1440) before merging.

### 6.2 Out-of-the-box defaults
- A section component must render correctly when given **only** the defaults from its [`lib/templates/<type>.ts`](lib/templates/). No required field may be undefined in the defaults.
- Demo copy must be realistic and on-brand for the template (e.g. SaaS template uses SaaS-flavored copy, not generic "Welcome to my site").
- Demo images live in [`public/images/`](public/images/), are committed to the repo, and are properly sized (≤200 KB each after compression, retina-friendly at 2× the displayed size).
- Wizard fields show defaults as `placeholder` text on inputs (so the user knows what they'd be replacing), with the actual value populated only once the user types.

---

## 7. Integration provider contract

Interfaces live in [`lib/integrations/types.ts`](lib/integrations/types.ts). Catalog in [`lib/integrations/catalog.ts`](lib/integrations/catalog.ts). Runtime dispatch in [`lib/integrations/registry.ts`](lib/integrations/registry.ts).

```ts
export interface CheckoutProvider {
  readonly id: string;
  readonly kind: "checkout";
  createSession(input: CheckoutSessionInput): Promise<CheckoutSessionOutput>;
  testConnection?(): Promise<ConnectionTestResult>;
}

export interface EmailProvider {
  readonly id: string;
  readonly kind: "email";
  subscribe(input: EmailSubscribeInput): Promise<{ ok: true }>;
  testConnection?(): Promise<ConnectionTestResult>;
}

export interface AnalyticsProvider {
  readonly id: string;
  readonly kind: "analytics";
  scriptTag(): string | null;
  testConnection?(): Promise<ConnectionTestResult>;
}

export interface WebhookProvider {
  readonly id: string;
  readonly kind: "webhook";
  send(event: WebhookEvent): Promise<{ ok: true }>;
  testConnection?(): Promise<ConnectionTestResult>;
}
```

### 7.1 Provider-file rules

- Each provider lives in a single file at `lib/integrations/<kind>/<id>.ts` (FREE) or `lib/integrations/pro/<kind>/<id>.ts` (PRO repo only).
- Exported const name is camelCase of `<id>-<kind>` (e.g. `stripe-checkout` → `stripeCheckout`; `convertkit-email` → `convertkitEmail`).
- Read credentials from `process.env` only. Never import `siteConfig.integrations.*.apiKey` — those are `<env:KEY>` tokens.
- On failure, throw `IntegrationError` from `types.ts` with a `code`, user-actionable `message`, and an HTTP `status`.
- No top-level side effects. Lazy-instantiate SDK clients inside the exported methods.

### 7.2 Registering a new provider

1. Add a `CatalogEntry` to `INTEGRATIONS_CATALOG` in `lib/integrations/catalog.ts` (id, kind, edition, displayName, description, requiredEnv).
2. For a **FREE** provider: add a loader to the matching `FREE_*` record in `lib/integrations/registry.ts`.
3. For a **PRO** provider: drop the file into `lib/integrations/pro/<kind>/<id>.ts` in the private `launchkit/pro` repo. The registry's `loadProModule` picks it up automatically; no explicit registration is needed.
4. Verify `verifyFreeLoaders()` returns `{ ok: true }` (sanity-check in dev).

---

## 8. Config & schema rules

- The Zod schema in [`lib/schema.ts`](lib/schema.ts) is the **only** authority on the config shape. Update it before adding fields anywhere else.
- `lib/config.ts` pipeline:
  1. Read [`lib/site.config.json`](lib/site.config.json).
  2. Resolve `<env:KEY>` tokens.
  3. Deep-merge over the per-template defaults from [`lib/templates/<type>.ts`](lib/templates/).
  4. Validate via the edition-aware schema.
  5. Export a frozen `siteConfig` object.
- Save flow ([`app/api/admin/save-config/route.ts`](app/api/admin/save-config/route.ts)):
  1. Validate the wizard payload against the schema.
  2. Strip PRO-only fields if `EDITION === "free"`.
  3. Deep-merge over existing JSON to preserve fields not exposed in the wizard.
  4. Write atomically (`fs.writeFileSync` to a `.tmp` then rename).
  5. Detect read-only FS (existing pattern) and return `{ readOnly, config }` for client-side download.
- Migrations live in `scripts/migrate-config.ts`. Every breaking schema change ships a migration step keyed on a `configVersion` field.

---

## 9. Wizard rules

- Single state object in [`app/setup/page.tsx`](app/setup/page.tsx) — already established. Keep it that way.
- One step per logical concern. Splitting into separate files only allowed once a step exceeds ~200 lines.
- Every input that touches a section must use either `Input`, `Textarea`, `Label` from [`components/ui/`](components/ui/), or the upcoming `SectionRepeater`.
- Image fields: use `ImageUploadField` (already defined in `app/setup/page.tsx`; extract to `components/setup/ImageUploadField.tsx` in Phase 2).
- PRO-only inputs in FREE: wrap in `<ProLockBadge>` instead of conditional rendering, so users see what they'd unlock.
- Color preview must use `--brand-primary` and `--brand-accent` CSS variables so live preview works without rebuild.

### 9.1 Progressive disclosure tiers
Every wizard surface (step or section editor) groups fields into three tiers. Defaults are loaded from the template; the wizard is for overrides.

| Tier | Visible by default | Examples |
|---|---|---|
| Essentials | Always shown. Cap at 5 fields per section. | Brand name, primary CTA label, hero headline, primary color, product image |
| Common | Behind a "Show more" link. | Subheadline, badge text, secondary CTA, accent color, OG image, hero variant picker |
| Advanced | Behind an "Advanced" disclosure (collapsed). | Custom CSS, animation toggles, ARIA labels, custom section IDs, schema.org metadata, raw JSON editor |

Promotion rules:
- A new option starts in **Advanced**. Promote to **Common** only after a real user has asked for it twice. Promote to **Essentials** only if it's high-leverage for ≥80% of users.
- "Reset to template defaults" button is always visible at the top of every section editor. It clears overrides for that section only.
- "Reset entire site" button lives at the bottom of the wizard; requires a typed confirmation.
- The wizard preview pane updates live for Essentials and Common edits; Advanced edits may require a save+reload (annotate when so).

### 9.2 Out-of-the-box flow
- A user landing on `/setup` with a fresh clone sees the wizard pre-filled with the active template's defaults — never blank fields.
- The wizard's first step ("Template") is also a "skip" point: a user can click "Use defaults & finish" at any step to deploy with whatever they have so far.
- The `/` route renders the configured site even when [`lib/site.config.json`](lib/site.config.json) is missing or `configured: false` — it falls back fully to template defaults and shows the [`components/SetupBanner.tsx`](components/SetupBanner.tsx).

---

## 10. Image & asset rules

- User uploads land in `public/uploads/` via [`app/api/admin/upload/route.ts`](app/api/admin/upload/route.ts). Filenames: `<type>-<timestamp>.<ext>`.
- Allowed mime types: `jpeg`, `png`, `gif`, `webp`, `svg+xml`. Max 5 MB.
- Static template assets (default avatars, logos) live in `public/images/`. Filenames `kebab-case.svg|png`.
- Reference images via absolute paths beginning with `/` (e.g. `/uploads/logo-123.png` or `/images/author.png`).
- For external URLs (CDN-hosted), add the host to `next.config.ts` `images.remotePatterns`. Never blanket-allow `**`.

---

## 11. Secrets rules

- **Never** write a real secret to [`lib/site.config.json`](lib/site.config.json). The wizard converts secret-field values to `<env:KEY>` tokens on save.
- The wizard finish step emits a `.env.local` snippet for the user to paste.
- Server code reads secrets via `process.env`, never via `siteConfig.integrations.*.apiKey`.
- The existing Stripe warning panel in [`app/setup/page.tsx`](app/setup/page.tsx) is the canonical pattern — replicate it for every secret field.

---

## 12. Styling rules

- Tailwind v4 + shadcn (`base-nova` style) per [`components.json`](components.json).
- Color tokens: `--background`, `--foreground`, `--card`, `--brand-primary`, `--brand-accent`, etc., defined in [`app/globals.css`](app/globals.css). Use these via `bg-background`, `text-foreground`, `style={{ color: "var(--brand-primary)" }}` for runtime values.
- Fonts: `font-sans` (Inter) for body, `font-heading` (Sora) for headings, `font-mono` (Geist Mono) for code.
- Dark/light theme toggled via `html.dark` class. Both palettes live in [`app/globals.css`](app/globals.css).
- Animations: Framer Motion `motion.*` components, never CSS keyframes for transitional UI. Decorative animations may use `tw-animate-css`.
- Spacing scale: stick to Tailwind defaults. No arbitrary `p-[17px]`-style values.
- Radii: use the `rounded-{sm,md,lg,xl,2xl,3xl}` tokens defined in `globals.css`.

### 12.1 Mobile-first (hard rule)
- Author every component at 375px first; layer breakpoints with `sm:` (640), `md:` (768), `lg:` (1024), `xl:` (1280), `2xl:` (1536).
- Tailwind classes ordered smallest-first. ESLint rule (Phase 1) enforces this.
- Never use horizontal scroll as a layout mechanism on mobile. If content overflows, restructure or stack.
- Use `min-h-svh` / `min-h-dvh` instead of `min-h-screen` for hero-sized sections to handle mobile browser chrome.
- Decorative `absolute` elements must include `pointer-events-none` and overflow-clipped containers so they never break touch scrolling.
- Respect `prefers-reduced-motion`: gate Framer Motion entrances behind `useReducedMotion()` from `framer-motion`.

### 12.2 Reduced motion & accessibility
- All interactive elements must be keyboard-reachable and have visible focus states (default Tailwind `focus-visible:ring-*` tokens).
- Color contrast: WCAG AA minimum (4.5:1 for body text) on both dark and light themes.
- Every image has meaningful `alt` text from config (`cfg.image.alt`); decorative images use `alt=""`.

---

## 13. Tooling & process rules

- **Context7 MCP** — pull current docs for any library, framework, SDK, API, or CLI before writing code that uses it (per user rule). Especially required for: Stripe, LemonSqueezy, Paddle, Resend, Mailchimp, ConvertKit, Loops, PostHog, Plausible, Next.js 16, React 19, Framer Motion, shadcn/ui.
- **Next.js 16** breaking changes — always read `node_modules/next/dist/docs/` before writing route handlers, server actions, or `next.config.ts` changes (per [`AGENTS.md`](AGENTS.md)).
- **Type-check + lint** before declaring work done: `npm run lint` and `tsc --noEmit`.
- **Don't proactively create docs/README files.** Only create markdown when explicitly requested.
- **Verify before claiming done** — run `npm run dev` and the relevant API route locally; show evidence.
- **Don't commit unless asked.** Never push without explicit instruction.

---

## 14. Planned integrations

| Kind | Provider | FREE | PRO | File |
|---|---|:---:|:---:|---|
| Checkout | Stripe one-time | yes | yes | `lib/integrations/checkout/stripe.ts` |
| Checkout | Stripe subscription + portal | | yes | `lib/integrations/checkout/stripe-subscription.ts` |
| Checkout | LemonSqueezy | | yes | `lib/integrations/checkout/lemonsqueezy.ts` |
| Checkout | Paddle | | yes | `lib/integrations/checkout/paddle.ts` |
| Email | none (console log) | yes | yes | `lib/integrations/email/none.ts` |
| Email | Resend | | yes | `lib/integrations/email/resend.ts` |
| Email | Mailchimp | | yes | `lib/integrations/email/mailchimp.ts` |
| Email | ConvertKit / Kit | | yes | `lib/integrations/email/convertkit.ts` |
| Email | Loops | | yes | `lib/integrations/email/loops.ts` |
| Analytics | GA4 | | yes | `lib/integrations/analytics/ga4.ts` |
| Analytics | Plausible | | yes | `lib/integrations/analytics/plausible.ts` |
| Analytics | Fathom | | yes | `lib/integrations/analytics/fathom.ts` |
| Analytics | PostHog | | yes | `lib/integrations/analytics/posthog.ts` |
| Webhook | Discord | | yes | `lib/integrations/webhooks/discord.ts` |
| Webhook | Slack | | yes | `lib/integrations/webhooks/slack.ts` |
| Webhook | Notion | | yes | `lib/integrations/webhooks/notion.ts` |
| Webhook | Airtable | | yes | `lib/integrations/webhooks/airtable.ts` |
| Webhook | Generic / Zapier | | yes | `lib/integrations/webhooks/generic.ts` |

---

## 15. Planned module structure

```
├── lib/
│   ├── schema.ts                      # zod schema + types (single source of truth)
│   ├── edition.ts                     # EDITION flag helper
│   ├── config.ts                      # resolver: defaults + JSON + env tokens + validate
│   ├── site.config.json               # user-editable config (wizard writes here)
│   ├── stripe.ts                      # Stripe SDK singleton (kept as-is)
│   ├── utils.ts                       # cn() + small helpers
│   ├── templates/
│   │   ├── ebook.ts                   # FREE
│   │   ├── saas.ts                    # FREE
│   │   ├── email-collection.ts        # FREE
│   │   ├── waitlist.ts                # PRO
│   │   ├── course.ts                  # PRO
│   │   ├── agency.ts                  # PRO
│   │   ├── portfolio.ts               # PRO
│   │   ├── event.ts                   # PRO
│   │   ├── physical.ts                # PRO
│   │   ├── consulting.ts              # PRO
│   │   └── app.ts                     # PRO
│   └── integrations/
│       ├── index.ts                   # provider registry
│       ├── types.ts                   # shared interfaces + IntegrationError
│       ├── checkout/                  # see §14
│       ├── email/
│       ├── analytics/
│       └── webhooks/
├── components/
│   ├── ui/                            # shadcn primitives (don't hand-edit; regenerate via shadcn CLI)
│   ├── SetupBanner.tsx
│   ├── setup/                         # wizard primitives
│   │   ├── PreviewPane.tsx            # NEW
│   │   ├── SectionRepeater.tsx        # NEW
│   │   ├── ImageUploadField.tsx       # NEW (extracted from app/setup/page.tsx)
│   │   ├── IntegrationCard.tsx        # NEW
│   │   └── ProLockBadge.tsx           # NEW
│   └── sections/
│       ├── shared/                    # Navbar, Footer, Newsletter, FAQ, Testimonials, TrustedBy
│       │   └── (PRO-only: CtaBand, Comparison, HowItWorks, Team, CaseStudy, BlogTeaser)
│       ├── ebook/                     # FREE template sections + variants
│       ├── saas/                      # FREE
│       ├── email/                     # FREE
│       ├── waitlist/                  # PRO
│       ├── course/                    # PRO
│       ├── agency/                    # PRO
│       ├── portfolio/                 # PRO
│       ├── event/                     # PRO
│       ├── physical/                  # PRO
│       ├── consulting/                # PRO
│       └── app/                       # PRO
├── app/
│   ├── layout.tsx
│   ├── page.tsx                       # variant switch via siteConfig
│   ├── globals.css
│   ├── setup/                         # wizard
│   ├── success/                       # post-checkout
│   ├── cancel/                        # cancelled checkout
│   └── api/
│       ├── admin/
│       │   ├── get-config/route.ts
│       │   ├── save-config/route.ts
│       │   ├── upload/route.ts
│       │   └── test-integration/route.ts   # NEW
│       ├── checkout/route.ts          # dispatcher
│       ├── email-signup/route.ts      # dispatcher
│       ├── webhooks/                  # PRO: stripe, lemonsqueezy, paddle
│       └── billing/portal/route.ts    # PRO: Stripe customer portal
├── public/
│   ├── images/                        # default template assets
│   └── uploads/                       # user uploads (gitignored in prod)
└── scripts/
    ├── migrate-config.ts              # v1 → v2 schema migration
    ├── sync-from-free.sh              # PRO repo only
    └── upgrade-to-pro.ts              # PRO repo only
```

---

## 16. Customization model

Customization is governed by §9.1 (progressive disclosure tiers). Below: what the **user** can change, organized by tier.

### 16.1 Essentials tier (always visible, ≤5 fields per step)

| What | FREE | PRO |
|---|:---:|:---:|
| Brand name + primary color | yes | yes |
| Product name + tagline | yes | yes |
| Hero headline + primary CTA label | yes | yes |
| Logo upload | yes | yes |
| Hero / product image upload | yes | yes |

### 16.2 Common tier (one click, "Show more")

| What | FREE | PRO |
|---|:---:|:---:|
| Hero subheadline, badge, secondary CTA | yes | yes |
| Accent color, theme (dark/light) | yes | yes |
| OG image upload | yes | yes |
| Pricing tiers (price, features list, CTA label) | yes (single tier) | yes (multi-tier editor) |
| Features list (icon, title, body, highlight, image per item) | yes (basic) | yes (full + image per item) |
| Testimonials list (name, role, quote, avatar) | yes (basic) | yes (full + video URL) |
| FAQ items | yes | yes |
| Footer columns, links, social | yes (basic) | yes (full) |
| Hero variant picker | yes | yes |
| Section variant picker (per section) | — | yes |
| Section ordering (drag-to-reorder) | — | yes |
| Toggle sections on/off | — | yes |
| Live preview while editing | — | yes |

### 16.3 Advanced tier (collapsed)

| What | FREE | PRO |
|---|:---:|:---:|
| Custom section IDs / nav anchors | yes | yes |
| ARIA labels per CTA | yes | yes |
| Schema.org metadata (SEO) | yes | yes |
| Animation enable/disable per section | — | yes |
| Custom CSS overrides | — | yes (`pro.customCss`) |
| Raw JSON editor (escape hatch) | — | yes |
| Remove "Made with LaunchKit" footer | — | yes (`pro.removeBranding`) |
| Export / import config | — | yes |
| AI copy generator per section | — | yes (post-v1) |

### 16.4 What developers (not end-users) change by editing files

- New template type: add `lib/templates/<type>.ts` + `components/sections/<type>/` + register in wizard picker + register in `app/page.tsx` switch.
- New integration provider: add `lib/integrations/<kind>/<provider>.ts`, register in `index.ts`.
- New section variant: add `components/sections/<template>/<Section><Variant>.tsx`, register in `app/page.tsx` switch + wizard variant picker.
- All template-shipped demo content (defaults) is edited in `lib/templates/<type>.ts` directly, not in the wizard.

What the **developer** changes by editing files (rare for end-users, common for forks):
- Add a brand-new template type → new `lib/templates/<type>.ts` + new `components/sections/<type>/` + register in wizard.
- Add a brand-new integration provider → new file in `lib/integrations/<kind>/`, register in `index.ts`.
- Add a new section variant → new file in `components/sections/<template>/<Section><Variant>.tsx` + register in `app/page.tsx` switch.

---

## 17. Definition of done (per PR)

A PR is mergeable when **all** of these are true:

1. `npm run lint` passes.
2. `tsc --noEmit` passes.
3. `npm run build` succeeds with `LAUNCHKIT_EDITION=free` and (when applicable) `=pro`.
4. Manual smoke test of the affected flow recorded in PR description (URL + screenshot or log).
5. Schema updated in [`lib/schema.ts`](lib/schema.ts) before any consumer.
6. Docs updated: this file, [`PLAN.md`](PLAN.md), or [`README.md`](README.md), as relevant.
7. No new hard-coded copy in section components.
8. No new `process.env` reads outside `lib/config.ts`, `lib/edition.ts`, `lib/integrations/*`.
9. Affected sections look correct at 375px, 768px, and 1440px (screenshots in PR for any UI change).
10. Affected templates render the demo defaults end-to-end with no missing fields (visit `/` after deleting `lib/site.config.json` if the change touches a template).
11. Any new wizard input is placed in the correct tier (Essentials / Common / Advanced) per §9.1.

---

## 18. Don'ts (red flags)

- Don't hard-code copy in any `components/sections/**.tsx`.
- Don't read `process.env` from a section component or page.
- Don't import a PRO module from a FREE-shared module.
- Don't `export default` from a non-Next.js file.
- Don't write to `lib/site.config.json` from anywhere except `/api/admin/save-config`.
- Don't ship a new integration without a `testConnection` or equivalent.
- Don't add a new field to `site.config.json` without first updating `lib/schema.ts`.
- Don't add hex colors in JSX — use CSS variables.
- Don't use emojis in code, comments, or docs unless explicitly requested by the user.
- Don't proactively create README/docs files.
- Don't commit or push unless explicitly told.
- Don't `--no-verify` or skip pre-commit hooks.
- Don't ship a section that breaks below 375px.
- Don't add a new wizard field at the Essentials tier without explicit approval — start at Advanced and promote.
- Don't ship a template with placeholder/Lorem-ipsum content. Defaults must be realistic.
- Don't use fixed-pixel widths in section layouts (`w-[1200px]`); use `max-w-*` with `mx-auto px-*`.

---

## 19. References

- [`PLAN.md`](PLAN.md) — full roadmap and FREE/PRO split details.
- [`AGENTS.md`](AGENTS.md) — Next.js 16 breaking-changes warning.
- [`README.md`](README.md) — user-facing setup docs.
- [`components.json`](components.json) — shadcn config.
- [`tsconfig.json`](tsconfig.json) — path aliases.
- [`app/globals.css`](app/globals.css) — design tokens (colors, radii, fonts).
- Next.js docs in `node_modules/next/dist/docs/` (per `AGENTS.md`).
- Context7 MCP for live SDK/library docs (per user rule).
