import type { SiteConfigInput } from "../schema";

/**
 * Mobile-app template — default content for a consumer mobile app landing
 * page. The demo uses a fictional outdoor-navigation app called "TrailMate"
 * so a freshly-cloned template is visually complete without any edits.
 */
export const mobileAppDefaults: SiteConfigInput = {
  version: 2,
  templateType: "mobile-app",

  brand: {
    name: "TrailMate",
    primaryColor: "#10b981",
    accentColor: "#14b8a6",
    logoUrl: "",
    productImageUrl: "",
  },

  product: {
    name: "TrailMate Premium",
    tagline: "The smart outdoor companion",
    description:
      "Offline maps, live tracking, and AI-powered trail recommendations — everywhere your next adventure takes you.",
    badge: "Editor's Choice 2025",
    price: 29,
    originalPrice: 59,
    currency: "USD",
    format: "iOS + Android",
    pages: 0,
    chapters: 0,
  },

  leadMagnet: {
    title: "Watch the demo",
    description: "See TrailMate in action before you download.",
    filePath: "",
  },

  app: {
    // Swap these for your real store URLs once the app is approved.
    appStoreUrl: "",
    playStoreUrl: "",
    iosRating: 4.8,
    androidRating: 4.7,
    iosReviewCount: 18_420,
    androidReviewCount: 24_180,
    downloads: "250k+",
    category: "Navigation · Outdoors",
    appIconUrl: "",
  },

  sections: {
    navbar: {
      ctaLabel: "Download",
      showSignIn: false,
      links: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Screenshots", href: "#screenshots" },
        { label: "Premium", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },

    hero: {
      variant: "split",
      eyebrow: "New · Version 3.0",
      headline: "Your next adventure,",
      headlineAccent: "mapped out.",
      subheadline:
        "Offline trail maps, live location sharing, and AI-generated route suggestions — TrailMate is the only app you need off the grid.",
      description: "",
      ctaPrimary: { label: "Download free", href: "#download", action: "scroll" },
      ctaSecondary: { label: "See how it works", href: "#how-it-works", action: "scroll" },
      trustLine: "Free to download · Premium features optional · Works offline worldwide",
      socialProofLabel: "250k+ outdoor lovers",
      bullets: [],
    },

    trustedBy: {
      eyebrow: "Featured in",
      logos: [
        { name: "Apple", logo: "/images/logo-apple.svg" },
        { name: "Product Hunt", logo: "/images/logo-producthunt.svg" },
        { name: "Outside Magazine", logo: "/images/logo-outside.svg" },
        { name: "Wired", logo: "/images/logo-wired.svg" },
        { name: "The Verge", logo: "/images/logo-theverge.svg" },
        { name: "9to5Mac", logo: "/images/logo-9to5mac.svg" },
      ],
    },

    appDownload: {
      eyebrow: "Free to start",
      heading: "Download TrailMate",
      headingAccent: "today.",
      subheading:
        "Available on iPhone and Android — free forever, with optional Premium for advanced features.",
      trustLine: "No account required to browse. Works offline. Your data stays on your device.",
      showRatings: true,
      showDownloads: true,
      showQr: false,
    },

    // Generic 6-feature grid is disabled on mobile-app; the FeatureShowcase
    // below replaces it with an alternating narrative + screenshot layout.
    features: {
      enabled: false,
      eyebrow: "",
      heading: "",
      headingAccent: "",
      subheading: "",
      items: [],
    },

    featureShowcase: {
      enabled: true,
      eyebrow: "Everything you need",
      heading: "Built for real",
      headingAccent: "adventures.",
      subheading:
        "Each feature is crafted for the field — reliable offline, battery-conscious, and easy to use with one hand and gloves on.",
      items: [
        {
          eyebrow: "Navigation",
          title: "Offline topo maps that actually work",
          description:
            "Download entire regions before you leave home and TrailMate becomes your trail companion even when the bars drop. Contour lines, water sources, and campsites — all accessible at 10,000ft.",
          image: { url: "", alt: "Offline map screen" },
          inPhoneFrame: true,
          items: [
            {
              icon: "MapPin",
              title: "Download regions",
              body: "Save entire states worth of trails for offline use with a single tap.",
              highlight: "",
            },
            {
              icon: "WifiOff",
              title: "100% offline-first",
              body: "Navigation, recording, and search all work without signal. Re-sync when you're back.",
              highlight: "",
            },
            {
              icon: "Target",
              title: "Military-grade GPS",
              body: "Accurate to within 3 meters, even under dense canopy or in deep canyons.",
              highlight: "",
            },
          ],
        },
        {
          eyebrow: "Safety",
          title: "Keep your crew in the loop",
          description:
            "Live location sharing with trusted contacts, automatic check-ins at key waypoints, and one-tap SOS. Peace of mind for you, peace of mind for the people who love you.",
          image: { url: "", alt: "Live safety sharing screen" },
          inPhoneFrame: true,
          items: [
            {
              icon: "Users",
              title: "Live location sharing",
              body: "Share your position in real time with unlimited friends. Tokens expire after 24h.",
              highlight: "",
            },
            {
              icon: "Bell",
              title: "Smart check-ins",
              body: "Automatic alerts when you reach your summit or deviate from your planned route.",
              highlight: "",
            },
            {
              icon: "Shield",
              title: "One-tap SOS",
              body: "Emergency services + your contacts get your exact GPS coordinates in one tap.",
              highlight: "",
            },
          ],
        },
        {
          eyebrow: "Discovery",
          title: "AI-powered trail suggestions",
          description:
            "Tell TrailMate your skill, your time window, and your vibe. Our AI picks the perfect route from 50,000+ curated trails worldwide — and learns what you love over time.",
          image: { url: "", alt: "AI trail suggestions screen" },
          inPhoneFrame: true,
          items: [
            {
              icon: "Sparkles",
              title: "Personalized picks",
              body: "Routes matched to your skill level, duration, and recent history. Every time.",
              highlight: "",
            },
            {
              icon: "TrendingUp",
              title: "Adapts to you",
              body: "Rate trails after each hike and the AI tailors suggestions to your preferences.",
              highlight: "",
            },
            {
              icon: "Globe",
              title: "50,000+ curated trails",
              body: "Every route vetted by local rangers. From quick loops to thru-hikes.",
              highlight: "",
            },
          ],
        },
      ],
    },

    appScreenshots: {
      eyebrow: "A look inside",
      heading: "Beautiful. Fast.",
      headingAccent: "Genuinely useful.",
      subheading:
        "Every screen earns its place. Swipe through to see how TrailMate behaves in the wild.",
      items: [
        { url: "", alt: "Home screen", caption: "Discover trails near you" },
        { url: "", alt: "Route view", caption: "Follow turn-by-turn directions" },
        { url: "", alt: "Offline maps", caption: "Download regions for offline use" },
        { url: "", alt: "Trip journal", caption: "Relive every trip" },
        { url: "", alt: "Safety share", caption: "Share your location live" },
      ],
    },

    howItWorks: {
      eyebrow: "How it works",
      heading: "On the trail in",
      headingAccent: "three taps.",
      subheading:
        "From download to first route in under two minutes. Seriously.",
      items: [
        {
          icon: "Download",
          title: "Download the app",
          body:
            "Get TrailMate from the App Store or Google Play. Free forever, no signup required to start exploring.",
        },
        {
          icon: "MapPin",
          title: "Pick your adventure",
          body:
            "Browse 50,000+ curated trails or ask our AI for a route that matches your mood and time window.",
        },
        {
          icon: "Rocket",
          title: "Head outside",
          body:
            "Download offline, follow the map, share with friends — then come back and relive every mile.",
        },
      ],
    },

    preview: {
      enabled: false,
      eyebrow: "",
      heading: "",
      headingAccent: "",
      subheading: "",
      tocItems: [],
      bonusItems: [],
    },

    pricing: {
      enabled: true,
      eyebrow: "Pricing",
      heading: "Free forever.",
      headingAccent: "Premium when you want more.",
      subheading:
        "Download for free and use every core feature. Unlock Premium for AI routing, live sharing with unlimited friends, and more.",
      badge: "Most popular",
      includedLabel: "Premium includes",
      ctaLabel: "Upgrade to Premium",
      guarantee: "Cancel anytime · 30-day money-back guarantee",
      features: [
        "Offline topographic maps",
        "GPS route recording",
        "50,000+ curated trails",
        "Photo trip journals",
        "Basic safety sharing",
        "AI-powered route suggestions",
        "Unlimited offline regions",
        "Live location sharing with unlimited friends",
        "Advanced trip analytics",
        "Priority customer support",
      ],
      stats: [
        { value: "250k+", label: "Downloads" },
        { value: "4.8 / 5", label: "Average rating" },
        { value: "50k+", label: "Curated trails" },
        { value: "100%", label: "Offline-capable" },
      ],
    },

    testimonials: {
      eyebrow: "Testimonials",
      heading: "Adventurers who",
      headingAccent: "never leave home without it.",
      subheading:
        "Real reviews from the App Store and Google Play — not cherry-picked, not edited.",
      items: [
        {
          name: "Jordan Pine",
          role: "Thru-hiker · PCT class of '24",
          avatar: "",
          quote:
            "Used TrailMate for the entire Pacific Crest Trail. Offline maps saved me twice when I lost the trail in the Sierras. Genuinely better than paper.",
          stars: 5,
          metric: "2,650 miles tracked",
        },
        {
          name: "Ana Márquez",
          role: "Trail runner · Colorado",
          avatar: "",
          quote:
            "The AI route suggestions nailed my vibe on the first try. 6-mile loop, 800 ft gain, done in 50 minutes. Now it's the only trail app I use.",
          stars: 5,
          metric: "4× weekly runs",
        },
        {
          name: "Kenji Watanabe",
          role: "Weekend adventurer",
          avatar: "",
          quote:
            "Live sharing is a game changer — my wife can see exactly where I am without an account. Peace of mind for both of us.",
          stars: 5,
          metric: "Shared with 3 family",
        },
      ],
    },

    newsletter: {
      eyebrow: "Trail mail",
      heading: "New trails, every",
      headingAccent: "Friday.",
      subheading:
        "A handpicked trail somewhere in the world, with tips from locals — straight to your inbox.",
      placeholder: "your@email.com",
      ctaLabel: "Subscribe",
      disclaimer: "Join 18,000+ outdoor lovers. No spam. Unsubscribe anytime.",
      successMessage: "You're in — see you Friday!",
    },

    faq: {
      eyebrow: "FAQ",
      heading: "Common",
      headingAccent: "questions.",
      subheading: "Can't find what you're looking for? Reach out — we respond in under 24 hours.",
      contactPrompt: "Still have a question?",
      contactEmail: "hello@trailmate.app",
      items: [
        {
          q: "Is TrailMate really free?",
          a: "Yes — the core app is free forever, including offline maps for up to 3 regions, 50,000+ curated trails, and basic GPS tracking. Premium unlocks advanced features like AI routing and unlimited offline regions.",
        },
        {
          q: "Does it work with no signal?",
          a: "Completely. Download the regions you need before you go, and every feature — navigation, recording, journaling — works 100% offline. Re-sync when you're back on WiFi.",
        },
        {
          q: "Which devices are supported?",
          a: "iPhones running iOS 16 or later, and Android phones running version 10 or later. A Wear OS and watchOS companion is in public beta.",
        },
        {
          q: "Can I cancel Premium any time?",
          a: "Yes. Premium is a simple monthly or annual subscription. Cancel with one tap from your App Store or Play Store account, effective at the end of your billing period.",
        },
        {
          q: "What about my privacy?",
          a: "Your location history stays on your device by default. We never sell data, don't show ads, and don't track you. Live sharing is opt-in per session and tokens expire after 24 hours.",
        },
      ],
    },

    footer: {
      description:
        "The smart outdoor companion — offline maps, live tracking, and AI-powered trail recommendations for iOS and Android.",
      quickLinksHeading: "App",
      contactHeading: "Company",
      contactEmail: "hello@trailmate.app",
      legalLinks: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Press kit", href: "/press" },
      ],
      tagline: "Made for the outdoors, built with Next.js",
      copyrightSuffix: "All rights reserved.",
      social: {
        twitter: "https://twitter.com/trailmate",
        github: "",
        linkedin: "https://linkedin.com/company/trailmate",
      },
    },
  },
};
