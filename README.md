# Next.js Single-Product Landing Page Template

A premium, dark-themed landing page template for selling a single digital product (ebook, PDF, course, etc.). Built with Next.js 15, Tailwind CSS v4, shadcn/ui, Framer Motion, and Stripe Checkout.

**Live inspiration:** [Finwise](https://finwise-omega.vercel.app/)

---

## Features

- **Hero** — Product mockup, headline, description, dual CTAs (Buy Now + free email capture)
- **TrustedBy** — Animated marquee logo strip
- **Features** — 6-card grid with scroll-triggered animations
- **Product Preview** — Table of contents, author bio, bonus items
- **Pricing** — Single product card with Stripe Checkout
- **Testimonials** — 3-column quote grid with star ratings
- **Newsletter** — Email capture band (placeholder, plug in any provider)
- **FAQ** — shadcn Accordion, driven by config
- **Footer** — Logo, nav links, social icons, copyright
- `/success` and `/cancel` pages for post-checkout flow

---

## Tech Stack

| Tool | Version |
|---|---|
| Next.js | 15 (App Router) |
| TypeScript | ✓ |
| Tailwind CSS | v4 |
| shadcn/ui | latest |
| Framer Motion | latest |
| Stripe | latest |
| Lucide React | latest |

---

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd next-landing
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Get your Stripe keys from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).  
Create a product and copy the Price ID from [dashboard.stripe.com/products](https://dashboard.stripe.com/products).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Customising Your Product

**All content is driven by a single file: `lib/config.ts`.**

Edit these fields to match your product:

```ts
// lib/config.ts
export const siteConfig = {
  name: "Your Brand",
  product: {
    name: "Your Product Name",
    tagline: "Your tagline",
    description: "Your description...",
    price: 49,
    originalPrice: 97,
    pages: 200,
    chapters: 12,
    format: "PDF + EPUB",
  },
  stripe: {
    priceId: "price_your_stripe_price_id",
  },
  features: [ /* ... */ ],
  preview: { /* author, TOC, bonuses */ },
  pricing: { features: [ /* bullet list */ ] },
  testimonials: [ /* ... */ ],
  faq: [ /* ... */ ],
  // etc.
};
```

---

## Adding Real Email Delivery

The `app/api/email-signup/route.ts` endpoint is a **placeholder** that logs to console. To send real emails:

### With Resend

```bash
npm install resend
```

```ts
// app/api/email-signup/route.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Inside POST handler:
await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID! });
await resend.emails.send({
  from: "hello@yourdomain.com",
  to: email,
  subject: "Your free chapter is here!",
  html: `<p>Download: <a href="...">click here</a></p>`,
});
```

### With Mailchimp / ConvertKit

Use their respective SDKs in the same route. The handler signature stays identical.

---

## Stripe Webhook (optional)

For automated file delivery after purchase, add a webhook handler:

```bash
# app/api/webhook/route.ts
```

Use `stripe listen --forward-to localhost:3000/api/webhook` during development.

---

## Deploying

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

Update `NEXT_PUBLIC_BASE_URL` to your production domain.

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx           # Root layout, fonts, metadata
│   ├── page.tsx             # Home page — assembles all sections
│   ├── globals.css          # Design tokens + Tailwind config
│   ├── success/page.tsx     # Post-purchase thank-you page
│   ├── cancel/page.tsx      # Cancelled payment page
│   └── api/
│       ├── checkout/route.ts      # Stripe Checkout Session creation
│       └── email-signup/route.ts  # Email capture (placeholder)
├── components/
│   ├── ui/                  # shadcn primitives
│   └── sections/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── TrustedBy.tsx
│       ├── Features.tsx
│       ├── ProductPreview.tsx
│       ├── Pricing.tsx
│       ├── Testimonials.tsx
│       ├── Newsletter.tsx
│       ├── FAQ.tsx
│       └── Footer.tsx
├── lib/
│   ├── config.ts            # ALL site content — edit this to rebrand
│   ├── stripe.ts            # Stripe SDK singleton
│   └── utils.ts             # shadcn cn() utility
├── public/
│   └── images/              # Product mockup, avatars, logos
└── .env.local.example
```

---

## License

MIT — use freely in commercial projects.
