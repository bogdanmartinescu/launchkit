import { siteConfig } from "@/lib/config";
import { SetupBanner } from "@/components/SetupBanner";

// Shared sections
import { Navbar } from "@/components/sections/Navbar";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";

// Ebook heroes
import { Hero as EbookHeroSplit } from "@/components/sections/Hero";
import { EbookHeroCentered } from "@/components/sections/ebook/HeroCentered";
import { EbookHeroMinimal } from "@/components/sections/ebook/HeroMinimal";
import { Features as EbookFeatures } from "@/components/sections/Features";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { Pricing as EbookPricing } from "@/components/sections/Pricing";

// SaaS heroes
import { SaasHero } from "@/components/sections/saas/Hero";
import { SaasHeroSplit } from "@/components/sections/saas/HeroSplit";
import { SaasFeatures } from "@/components/sections/saas/Features";
import { SaasPricing } from "@/components/sections/saas/Pricing";

// Email-collection heroes
import { EmailHero } from "@/components/sections/email/Hero";
import { EmailHeroBold } from "@/components/sections/email/HeroBold";
import { EmailFeatures } from "@/components/sections/email/Features";

export default function Home() {
  const { templateType, heroVariant, configured } = siteConfig;

  return (
    <>
      <Navbar />
      {!configured && <SetupBanner />}
      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        {templateType === "ebook" && heroVariant === "centered" && <EbookHeroCentered />}
        {templateType === "ebook" && heroVariant === "minimal" && <EbookHeroMinimal />}
        {templateType === "ebook" && heroVariant !== "centered" && heroVariant !== "minimal" && <EbookHeroSplit />}

        {templateType === "saas" && heroVariant === "split" && <SaasHeroSplit />}
        {templateType === "saas" && heroVariant !== "split" && <SaasHero />}

        {templateType === "email-collection" && heroVariant === "bold" && <EmailHeroBold />}
        {templateType === "email-collection" && heroVariant !== "bold" && <EmailHero />}

        {/* ── Trusted By ───────────────────────────────── */}
        <TrustedBy />

        {/* ── Features ─────────────────────────────────── */}
        {templateType === "ebook" && <EbookFeatures />}
        {templateType === "saas" && <SaasFeatures />}
        {templateType === "email-collection" && <EmailFeatures />}

        {/* ── Product Preview (ebook only) ─────────────── */}
        {templateType === "ebook" && <ProductPreview />}

        {/* ── Pricing ──────────────────────────────────── */}
        {templateType === "ebook" && <EbookPricing />}
        {templateType === "saas" && <SaasPricing />}

        {/* ── Testimonials ─────────────────────────────── */}
        <Testimonials />

        {/* ── Newsletter ───────────────────────────────── */}
        <Newsletter />

        {/* ── FAQ ──────────────────────────────────────── */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
