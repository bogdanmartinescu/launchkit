import type { SiteConfigInput } from "../schema";

/**
 * Ebook template — default content for the out-of-the-box ebook landing page.
 *
 * Every string and image URL rendered by the page has a sensible default here
 * so the template is deployable with zero edits. Users override anything they
 * want via `lib/site.config.json` (populated by the /setup wizard).
 *
 * Shape matches {@link SiteConfigInput} (a deep-partial of the validated
 * config). `lib/config.ts` merges this with `site.config.json`.
 */
export const ebookDefaults: SiteConfigInput = {
  version: 2,
  templateType: "ebook",

  brand: {
    name: "LaunchKit",
    primaryColor: "#6366f1",
    accentColor: "#8b5cf6",
    logoUrl: "",
    productImageUrl: "",
  },

  product: {
    name: "The SaaS Launch Playbook",
    tagline: "From Zero to First 100 Customers",
    description:
      "A step-by-step blueprint used by 3,000+ founders to validate ideas, build an audience, and land paying customers — before writing a single line of code.",
    badge: "New Edition — 2025",
    price: 49,
    originalPrice: 97,
    currency: "USD",
    format: "PDF + EPUB",
    pages: 312,
    chapters: 18,
  },

  leadMagnet: {
    title: "Get Free Sample Chapter",
    description:
      "Enter your email and we'll send you Chapter 1 — Idea Validation — for free, instantly.",
    filePath: "/downloads/sample.pdf",
  },

  sections: {
    navbar: {
      ctaLabel: "Buy Now — $49",
      showSignIn: false,
      links: [
        { label: "Features", href: "#features" },
        { label: "Preview", href: "#preview" },
        { label: "Pricing", href: "#pricing" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "FAQ", href: "#faq" },
      ],
    },

    hero: {
      variant: "split",
      eyebrow: "New Edition — 2025",
      headline: "The SaaS Launch",
      headlineAccent: "Playbook",
      subheadline: "From Zero to First 100 Customers",
      description:
        "A step-by-step blueprint used by 3,000+ founders to validate ideas, build an audience, and land paying customers — before writing a single line of code.",
      ctaPrimary: { label: "Buy Now — $49", href: "#pricing", action: "checkout" },
      ctaSecondary: { label: "Get Free Sample Chapter", href: "#", action: "dialog" },
      trustLine:
        "30-day money-back guarantee · Instant download · DRM-free",
      socialProofLabel: "3,200+ founders",
      bullets: [
        "Proven framework used by 3,000+ founders",
        "Step-by-step — from idea to first $1,000",
        "Instant PDF + EPUB delivery",
        "30-day money-back guarantee",
      ],
    },

    trustedBy: {
      eyebrow: "As seen in & read by founders at",
      logos: [
        { name: "TechCrunch", logo: "/images/logo-techcrunch.svg" },
        { name: "Product Hunt", logo: "/images/logo-producthunt.svg" },
        { name: "Y Combinator", logo: "/images/logo-yc.svg" },
        { name: "Indie Hackers", logo: "/images/logo-indiehackers.svg" },
        { name: "Hacker News", logo: "/images/logo-hn.svg" },
        { name: "The Hustle", logo: "/images/logo-thehustle.svg" },
      ],
    },

    features: {
      eyebrow: "What's inside",
      heading: "Everything You Need to",
      headingAccent: "Launch & Grow",
      subheading:
        "312 pages of battle-tested strategies, frameworks, and templates — distilled from real launches.",
      items: [
        {
          icon: "Lightbulb",
          title: "Idea Validation Framework",
          body: "Stop building in the dark. Our 5-step validation sprint helps you confirm demand before you invest a single hour of development time.",
          highlight: "Save months of wasted work",
        },
        {
          icon: "Users",
          title: "Audience-First Growth",
          body: "Learn the exact content and community playbooks used to build waitlists of 10,000+ subscribers from scratch, with zero ad spend.",
          highlight: "Organic growth strategies",
        },
        {
          icon: "CreditCard",
          title: "Revenue Before Code",
          body: "Discover how to pre-sell your product, collect real money, and validate pricing — all before your MVP is finished.",
          highlight: "Pre-sell your product",
        },
        {
          icon: "BarChart2",
          title: "Metrics That Matter",
          body: "Cut through vanity metrics. A clear dashboard of the 7 KPIs every early-stage SaaS founder must obsess over to reach product-market fit.",
          highlight: "Data-driven decisions",
        },
        {
          icon: "MessageSquare",
          title: "Customer Interview Scripts",
          body: "Word-for-word scripts and templates for customer discovery calls that surface real pain points and turn prospects into champions.",
          highlight: "Real customer insights",
        },
        {
          icon: "Zap",
          title: "90-Day Launch Sprint",
          body: "A battle-tested week-by-week action plan that takes you from idea to first paying customers in exactly 90 days.",
          highlight: "Proven roadmap",
        },
      ],
    },

    preview: {
      eyebrow: "Inside the book",
      heading: "A Peek at What",
      headingAccent: "You'll Learn",
      subheading:
        "312 pages across 18 chapters. Here's the table of contents.",
      tocHeading: "Table of Contents",
      bonusHeading: "Included bonuses",
      author: {
        name: "Alex Rivera",
        role: "3× Founder · $2M ARR · Advisor to 50+ startups",
        bio: "Alex has launched 3 SaaS products, the last of which reached $2M ARR in 18 months. He distilled everything that worked — and everything that didn't — into this playbook.",
        avatar: "/images/author.png",
      },
      tocItems: [
        { chapter: 1, title: "Idea Validation: The 5-Day Sprint" },
        { chapter: 2, title: "Finding Your Target Customer" },
        { chapter: 3, title: "Building a Waitlist from Zero" },
        { chapter: 4, title: "Pricing Psychology & Strategy" },
        { chapter: 5, title: "Pre-Selling Before You Build" },
        { chapter: 6, title: "The Minimum Viable Product Myth" },
        { chapter: 7, title: "Your First 10 Customers" },
        { chapter: 8, title: "Content-Led Growth on Autopilot" },
        { chapter: 9, title: "Retention & Churn Reduction" },
        { chapter: 10, title: "Scaling from $1k to $10k MRR" },
      ],
      bonusItems: [
        "Notion template: 90-Day Launch Sprint Board",
        "Spreadsheet: Unit Economics Calculator",
        "10 Customer Interview Script Templates",
        "Swipe file: 50 Cold Email Templates",
      ],
    },

    pricing: {
      eyebrow: "Simple, transparent pricing",
      heading: "One Price.",
      headingAccent: "Everything Included.",
      subheading: "No subscriptions. No upsells. Pay once and own it forever.",
      badge: "Best Value",
      includedLabel: "Everything included",
      ctaLabel: "Get Instant Access — $49",
      guarantee: "30-day money-back guarantee — no questions asked.",
      features: [
        "312-page PDF + EPUB",
        "18 in-depth chapters",
        "90-Day Launch Sprint plan",
        "5 bonus templates & scripts",
        "Lifetime updates included",
        "30-day money-back guarantee",
      ],
      stats: [
        { value: "3,200+", label: "Founders who've read it" },
        { value: "$2M+", label: "Revenue generated by readers" },
        { value: "4.9/5", label: "Average rating" },
        { value: "30-day", label: "Money-back guarantee" },
      ],
    },

    testimonials: {
      eyebrow: "Testimonials",
      heading: "Founders Who",
      headingAccent: "Used It & Shipped",
      subheading:
        "Real results from real founders. Not cherry-picked — these are typical outcomes.",
      items: [
        {
          name: "Sarah Chen",
          role: "Founder, Promptly AI",
          avatar: "/images/avatar-1.png",
          quote:
            "I used Alex's validation framework and got 40 pre-orders before writing a single line of code. This playbook is the most practical resource I've ever bought.",
          stars: 5,
          metric: "40 pre-orders before MVP",
        },
        {
          name: "Marcus Johnson",
          role: "Solo founder, Trackflow",
          avatar: "/images/avatar-2.png",
          quote:
            "Went from 0 to $8k MRR in 90 days following the sprint plan almost exactly. The customer interview scripts alone were worth 10× the price.",
          stars: 5,
          metric: "$8k MRR in 90 days",
        },
        {
          name: "Priya Nair",
          role: "Co-founder, Notio",
          avatar: "/images/avatar-3.png",
          quote:
            "I've read every startup book out there. This is the only one that tells you exactly what to do, in what order, with no fluff. Wish I had it 3 years ago.",
          stars: 5,
          metric: "3 failed startups → 1 exit",
        },
      ],
    },

    newsletter: {
      eyebrow: "Stay in the loop",
      heading: "Weekly tactics for",
      headingAccent: "SaaS founders",
      subheading:
        "Get one actionable framework, insight, or template every Tuesday. Straight to your inbox. No fluff. Unsubscribe any time.",
      placeholder: "Enter your email",
      ctaLabel: "Subscribe",
      disclaimer: "Join 4,000+ founders. No spam. Unsubscribe at any time.",
      successMessage: "You're on the list — see you Tuesday!",
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
          q: "Is this for technical or non-technical founders?",
          a: "Both. The playbook focuses on business strategy, customer development, and growth — not code. Technical founders will find it equally valuable for the business fundamentals they often skip.",
        },
        {
          q: "I already have a product. Is it still useful?",
          a: "Absolutely. Chapters 7-18 focus entirely on growth, retention, and scaling from early revenue to $10k+ MRR. Many readers buy it after launch specifically for those chapters.",
        },
        {
          q: "What format does it come in?",
          a: "You'll receive a DRM-free PDF and EPUB immediately after purchase. Both are optimized for desktop and mobile reading.",
        },
        {
          q: "Are the bonus templates included in the price?",
          a: "Yes. All 5 bonus templates, scripts, and the 90-Day Sprint Notion board are included at no extra charge.",
        },
        {
          q: "What's your refund policy?",
          a: "You get a full 30-day money-back guarantee. If you feel it wasn't worth it, email us and we'll refund you immediately — no questions asked.",
        },
      ],
    },

    footer: {
      description:
        "A step-by-step blueprint used by 3,000+ founders to validate ideas, build an audience, and land paying customers — before writing a single line of code.",
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
        twitter: "https://twitter.com/launchkit",
        github: "https://github.com/launchkit",
        linkedin: "https://linkedin.com/company/launchkit",
      },
    },
  },
};
