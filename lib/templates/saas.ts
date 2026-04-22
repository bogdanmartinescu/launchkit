import type { SiteConfigInput } from "../schema";

/**
 * SaaS template — default content for a B2B SaaS product landing page with
 * tiered pricing, feature grid, and dashboard hero imagery.
 */
export const saasDefaults: SiteConfigInput = {
  version: 2,
  templateType: "saas",

  brand: {
    name: "LaunchKit",
    primaryColor: "#3b82f6",
    accentColor: "#06b6d4",
    logoUrl: "",
    productImageUrl: "",
  },

  product: {
    name: "LaunchKit SaaS",
    tagline: "Ship your SaaS in days, not months",
    description:
      "The complete Next.js + Postgres + Stripe starter with authentication, billing, multi-tenancy, and analytics wired up — so you can focus on the features that actually matter.",
    badge: "Production-Ready Boilerplate",
    price: 299,
    originalPrice: 499,
    currency: "USD",
    format: "Codebase + Docs",
    pages: 0,
    chapters: 0,
  },

  leadMagnet: {
    title: "Watch Demo",
    description: "See how LaunchKit scales from solo-founder MVP to 100k users.",
    filePath: "",
  },

  pricingTiers: [
    {
      name: "Starter",
      price: 29,
      period: "mo",
      features: [
        "Up to 1,000 active users",
        "Basic analytics dashboard",
        "Email support",
        "Community access",
      ],
      isPopular: false,
      ctaLabel: "Start Free Trial",
      stripePriceId: "",
    },
    {
      name: "Growth",
      price: 99,
      period: "mo",
      features: [
        "Up to 25,000 active users",
        "Advanced analytics + cohorts",
        "Priority email & chat support",
        "Custom domain",
        "Team seats (up to 10)",
      ],
      isPopular: true,
      ctaLabel: "Start Free Trial",
      stripePriceId: "",
    },
    {
      name: "Enterprise",
      price: null,
      period: "mo",
      features: [
        "Unlimited users",
        "SSO & SAML",
        "24/7 dedicated support",
        "SLA & custom contracts",
        "On-prem deployment option",
      ],
      isPopular: false,
      ctaLabel: "Contact Sales",
      stripePriceId: "",
    },
  ],

  sections: {
    navbar: {
      ctaLabel: "Start Free Trial",
      showSignIn: true,
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
    },

    hero: {
      variant: "centered",
      eyebrow: "Production-Ready Boilerplate",
      headline: "Ship your SaaS in",
      headlineAccent: "days, not months",
      description:
        "The complete Next.js + Postgres + Stripe starter with authentication, billing, multi-tenancy, and analytics wired up — so you can focus on the features that actually matter.",
      ctaPrimary: {
        label: "Start Free Trial",
        href: "#pricing",
        action: "scroll",
      },
      ctaSecondary: { label: "Watch Demo", href: "#", action: "dialog" },
      trustLine:
        "14-day free trial · No credit card required · Cancel anytime",
      socialProofLabel: "500+ teams already building",
      bullets: [
        "Ship 10× faster",
        "Enterprise-grade security",
        "Real-time analytics",
      ],
    },

    trustedBy: {
      eyebrow: "Trusted by teams at",
      logos: [
        { name: "Vercel", logo: "/images/logo-vercel.svg" },
        { name: "Stripe", logo: "/images/logo-stripe.svg" },
        { name: "Supabase", logo: "/images/logo-supabase.svg" },
        { name: "Railway", logo: "/images/logo-railway.svg" },
        { name: "Linear", logo: "/images/logo-linear.svg" },
        { name: "Resend", logo: "/images/logo-resend.svg" },
      ],
    },

    features: {
      eyebrow: "Everything included",
      heading: "Built for speed.",
      headingAccent: "Ready for scale.",
      subheading:
        "Every piece you need to go from idea to revenue, wired together and production-ready on day one.",
      items: [
        {
          icon: "Zap",
          title: "Ship in Minutes, Not Days",
          body: "Pre-built authentication, billing, database, and email baked in. Zero boilerplate to write — just start building your product.",
          highlight: "10× faster setup",
        },
        {
          icon: "ShieldCheck",
          title: "Production-Ready Security",
          body: "Row-level security, OAuth, RBAC, and SOC 2-ready audit logs out of the box. Security best practices without the headache.",
          highlight: "Enterprise-grade",
        },
        {
          icon: "BarChart2",
          title: "Built-in Analytics",
          body: "Real-time dashboards for MRR, churn, active users, and feature usage. Know what's working before your next sprint.",
          highlight: "Real-time insights",
        },
        {
          icon: "CreditCard",
          title: "Stripe Billing, Wired Up",
          body: "Subscriptions, one-time payments, usage-based billing, and upgrade flows — all connected and ready to customize.",
          highlight: "0% revenue cut",
        },
        {
          icon: "Users",
          title: "Team & Multi-Tenancy",
          body: "Invite teammates, manage roles, and handle org-level permissions with a battle-tested multi-tenant architecture.",
          highlight: "B2B-ready from day 1",
        },
        {
          icon: "Globe",
          title: "Deploy Anywhere",
          body: "One-command deploy to Vercel, Railway, Fly.io, or your own VPS. Docker image included for full control.",
          highlight: "Full portability",
        },
      ],
    },

    preview: {
      enabled: false,
    },

    pricing: {
      eyebrow: "Simple, transparent pricing",
      heading: "Choose your",
      headingAccent: "growth plan",
      subheading: "Start free. Scale when you're ready. No hidden fees.",
      badge: "Most Popular",
      ctaLabel: "Start Free Trial",
      guarantee: "14-day free trial. No credit card required.",
      features: [],
      stats: [
        { value: "500+", label: "SaaS apps launched" },
        { value: "$12M+", label: "Revenue generated by customers" },
        { value: "4.9/5", label: "Average rating" },
        { value: "14-day", label: "Free trial" },
      ],
    },

    testimonials: {
      eyebrow: "Testimonials",
      heading: "Teams who",
      headingAccent: "shipped on LaunchKit",
      subheading:
        "Real results from real founders. Not cherry-picked — these are typical outcomes.",
      items: [
        {
          name: "Tom Bradley",
          role: "Founder, Shipright",
          avatar: "/images/avatar-1.png",
          quote:
            "We went from zero to a paying customer in under a week. The billing and auth setup alone saved us two months of work.",
          stars: 5,
          metric: "First customer in 5 days",
        },
        {
          name: "Anika Sharma",
          role: "CTO, Loopwise",
          avatar: "/images/avatar-2.png",
          quote:
            "I've evaluated every SaaS boilerplate out there. This is the only one where I didn't have to fight the architecture. It just worked.",
          stars: 5,
          metric: "Saved 3 months of dev time",
        },
        {
          name: "Chris Mercer",
          role: "Solo founder, Noteful",
          avatar: "/images/avatar-3.png",
          quote:
            "Built my first SaaS solo using this. $4k MRR in 60 days. The analytics alone helped me double retention by spotting the right drop-off.",
          stars: 5,
          metric: "$4k MRR in 60 days",
        },
      ],
    },

    newsletter: {
      eyebrow: "Product updates",
      heading: "Build log,",
      headingAccent: "straight to your inbox",
      subheading:
        "One email every Tuesday with changelog highlights, new integrations, and SaaS-building tips from real operators.",
      placeholder: "you@company.com",
      ctaLabel: "Subscribe",
      disclaimer: "Join 4,000+ builders. No spam. Unsubscribe any time.",
      successMessage: "You're subscribed — see you Tuesday!",
    },

    faq: {
      eyebrow: "FAQ",
      heading: "Questions?",
      headingAccent: "We've got answers.",
      subheading:
        "If you don't find what you're looking for, just email us. We respond within 24 hours.",
      contactPrompt: "Still have a question?",
      contactEmail: "hello@launchkit.co",
      items: [
        {
          q: "Do I need a team to use this?",
          a: "Not at all. Most of our customers are solo founders or small 2-3 person teams. The whole stack is designed to be managed by one person.",
        },
        {
          q: "What technologies does it use?",
          a: "Next.js, TypeScript, Tailwind, Prisma, Supabase (or Postgres), Stripe, and Resend. All proven, widely-documented tools with strong communities.",
        },
        {
          q: "Can I use this for B2B SaaS?",
          a: "Absolutely. Multi-tenancy, org-level billing, team invites, and role-based access are all built in and ready for B2B use cases.",
        },
        {
          q: "Is the code mine to keep?",
          a: "Yes. You get full source code ownership. No lock-in, no ongoing fees for the codebase itself.",
        },
        {
          q: "What kind of support do you offer?",
          a: "All plans include email support. Pro and Enterprise plans include private Slack access and priority response.",
        },
      ],
    },

    footer: {
      description:
        "The complete Next.js + Postgres + Stripe starter with authentication, billing, multi-tenancy, and analytics wired up — so you can focus on the features that actually matter.",
      quickLinksHeading: "Product",
      contactHeading: "Company",
      contactEmail: "hello@launchkit.co",
      legalLinks: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
      tagline: "Built with Next.js & Tailwind CSS",
      copyrightSuffix: "All rights reserved.",
      social: {
        twitter: "https://twitter.com/yourbrand",
        github: "https://github.com/yourbrand",
        linkedin: "https://linkedin.com/company/yourbrand",
      },
    },
  },
};
