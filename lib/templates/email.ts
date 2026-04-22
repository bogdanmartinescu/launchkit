import type { SiteConfigInput } from "../schema";

/**
 * Email-collection template — default content for a lead-magnet / waitlist
 * landing page where the primary conversion is an email capture, not a sale.
 */
export const emailDefaults: SiteConfigInput = {
  version: 2,
  templateType: "email-collection",

  brand: {
    name: "LaunchKit",
    primaryColor: "#3b82f6",
    accentColor: "#06b6d4",
    logoUrl: "",
    productImageUrl: "",
  },

  product: {
    name: "The AI Founder Toolkit",
    tagline: "Everything you need, free",
    description:
      "A hand-picked collection of tools, templates, and playbooks — used by 12,000+ AI founders to build and ship faster. Free forever.",
    badge: "100% Free Forever",
    price: 0,
    originalPrice: 0,
    currency: "USD",
    format: "Instant Access",
    pages: 0,
    chapters: 0,
  },

  leadMagnet: {
    title: "Get Free Access",
    description:
      "Get instant access to the full toolkit plus a monthly roundup of new resources. No spam. Unsubscribe anytime.",
    filePath: "",
  },

  sections: {
    navbar: {
      ctaLabel: "Join Free",
      showSignIn: false,
      links: [
        { label: "What's Inside", href: "#features" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
    },

    hero: {
      variant: "split",
      eyebrow: "100% Free · No credit card",
      headline: "The AI Founder",
      headlineAccent: "Toolkit",
      description:
        "A hand-picked collection of tools, templates, and playbooks — used by 12,000+ AI founders to build and ship faster. Free forever.",
      ctaPrimary: { label: "Get Free Access", href: "#", action: "dialog" },
      ctaSecondary: { label: "", href: "#", action: "link" },
      trustLine:
        "No spam. Free forever. Unsubscribe in one click.",
      socialProofLabel: "12,000+ founders subscribed",
    },

    trustedBy: {
      eyebrow: "Trusted by founders building at",
      logos: [
        { name: "OpenAI", logo: "/images/logo-openai.svg" },
        { name: "Anthropic", logo: "/images/logo-anthropic.svg" },
        { name: "Product Hunt", logo: "/images/logo-producthunt.svg" },
        { name: "Y Combinator", logo: "/images/logo-yc.svg" },
        { name: "Indie Hackers", logo: "/images/logo-indiehackers.svg" },
        { name: "Hacker News", logo: "/images/logo-hn.svg" },
      ],
    },

    features: {
      eyebrow: "What's inside",
      heading: "Everything you need,",
      headingAccent: "free to access",
      subheading:
        "No paywall. No teaser. Just the full, actionable toolkit — delivered to your inbox instantly.",
      items: [
        {
          icon: "FileText",
          title: "47 Curated Tools",
          body: "A hand-picked list of the best AI tools for founders — from ideation and prototyping to marketing and customer support. No fluff.",
          highlight: "Updated monthly",
        },
        {
          icon: "Layers",
          title: "10 Prompt Templates",
          body: "Battle-tested ChatGPT and Claude prompts for writing landing copy, generating feature ideas, and handling customer emails in seconds.",
          highlight: "Copy-paste ready",
        },
        {
          icon: "BookOpen",
          title: "Startup Checklist",
          body: "A 120-point launch checklist used by 500+ AI founders. From initial idea to first paying customer, nothing gets skipped.",
          highlight: "120-point checklist",
        },
        {
          icon: "TrendingUp",
          title: "AI Investor Radar",
          body: "A living list of 80+ investors actively writing checks for AI startups in 2025 — including their thesis and portfolio focus.",
          highlight: "80+ active investors",
        },
        {
          icon: "Zap",
          title: "No-Code Stack Guide",
          body: "The exact no-code and low-code stack to build and launch an AI startup MVP in under a weekend, with tool-by-tool setup guides.",
          highlight: "Weekend MVP",
        },
        {
          icon: "MessageSquare",
          title: "Community Access",
          body: "Get invited to a private Slack group of 2,000+ AI founders sharing what's working, failed experiments, and live feedback.",
          highlight: "2,000+ members",
        },
      ],
    },

    preview: {
      enabled: false,
    },

    pricing: {
      enabled: false,
      eyebrow: "",
      heading: "",
      headingAccent: "",
      subheading: "",
      ctaLabel: "Get Free Access",
      guarantee: "",
      features: [],
      stats: [
        { value: "12,000+", label: "Founders subscribed" },
        { value: "47", label: "Curated tools" },
        { value: "4.9/5", label: "Average rating" },
        { value: "Free", label: "Always free" },
      ],
    },

    testimonials: {
      eyebrow: "Testimonials",
      heading: "Founders who",
      headingAccent: "actually use it",
      subheading:
        "Real results from real founders. Not cherry-picked — these are typical outcomes.",
      items: [
        {
          name: "Jordan Lee",
          role: "AI founder, Summly",
          avatar: "/images/avatar-1.png",
          quote:
            "The investor list alone saved me weeks of research. I reached out to 12 investors from the list and got 3 meetings in my first month.",
          stars: 5,
          metric: "3 investor meetings booked",
        },
        {
          name: "Maria Fernandez",
          role: "Solo founder, Clipify",
          avatar: "/images/avatar-2.png",
          quote:
            "Used the no-code stack guide to build my MVP over a weekend. Launched on Product Hunt and got 400 upvotes. This toolkit is gold.",
          stars: 5,
          metric: "MVP in 2 days",
        },
        {
          name: "Derek Walsh",
          role: "Founder, Agentify",
          avatar: "/images/avatar-3.png",
          quote:
            "The prompt templates alone have saved me at least 5 hours a week. I use them every single day for content, support, and code review.",
          stars: 5,
          metric: "5 hours saved per week",
        },
      ],
    },

    newsletter: {
      eyebrow: "Weekly roundup",
      heading: "New tools every",
      headingAccent: "Tuesday",
      subheading:
        "A curated, ~5-minute email every Tuesday with the best new AI tools and the prompts we're using right now.",
      placeholder: "Enter your email",
      ctaLabel: "Subscribe",
      disclaimer: "Join 12,000+ founders. No spam. Unsubscribe any time.",
      successMessage: "You're in — see you Tuesday!",
    },

    faq: {
      eyebrow: "FAQ",
      heading: "Frequently asked",
      headingAccent: "questions",
      subheading:
        "If you don't find what you're looking for, just email us. We respond within 24 hours.",
      contactPrompt: "Still have a question?",
      contactEmail: "hello@launchkit.co",
      items: [
        {
          q: "Is this really free?",
          a: "Yes, completely. We make our money from sponsorships and affiliate partnerships with the tools we recommend. You'll never be charged.",
        },
        {
          q: "How often is the toolkit updated?",
          a: "We update the tool list monthly and send a newsletter to subscribers whenever we add significant new resources.",
        },
        {
          q: "Will I receive spam after signing up?",
          a: "Never. You'll receive the toolkit immediately and a monthly update. That's it. Unsubscribe with one click at any time.",
        },
        {
          q: "Is the community private?",
          a: "Yes. The Slack group is invitation-only. You receive your invite link in the welcome email right after signing up.",
        },
        {
          q: "Can I share this with my team?",
          a: "Absolutely. The toolkit is free to share. We just ask that you link to this page rather than forwarding the raw files.",
        },
      ],
    },

    footer: {
      description:
        "A hand-picked collection of tools, templates, and playbooks — used by 12,000+ AI founders to build and ship faster. Free forever.",
      quickLinksHeading: "Quick Links",
      contactHeading: "Contact",
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
