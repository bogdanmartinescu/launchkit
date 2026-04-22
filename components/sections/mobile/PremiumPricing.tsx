"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { StoreBadgesRow } from "@/components/ui/StoreBadges";

/**
 * Dual-tier pricing for mobile apps: a free/store-download side and an
 * optional Premium upgrade card that hits Stripe Checkout for web-based
 * upgrades (subscriptions, premium content, etc).
 *
 * The Premium card is automatically hidden when neither a Stripe price nor a
 * non-zero product price is configured, so the free template still makes
 * sense for apps that don't sell a premium tier.
 */
export function MobilePremiumPricing() {
  const section = siteConfig.sections.pricing;
  const { product, app, integrations } = siteConfig;

  if (!section.enabled) return null;

  const hasPremium =
    product.price > 0 || Boolean(integrations.stripePriceId);

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: integrations.stripePriceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Checkout unavailable. Please try again.");
    }
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
        style={{
          background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--brand-primary) 30%, transparent), transparent)`,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          {section.eyebrow && (
            <span
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
              style={{
                background: `color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)`,
                color: `var(--brand-primary)`,
              }}
            >
              {section.eyebrow}
            </span>
          )}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-page mb-4 leading-tight">
            {section.heading}
            {section.headingAccent && (
              <>
                {" "}
                <span className="gradient-text">{section.headingAccent}</span>
              </>
            )}
          </h2>
          {section.subheading && (
            <p className="text-lg text-page-muted leading-relaxed">{section.subheading}</p>
          )}
        </motion.div>

        <div className={`grid ${hasPremium ? "md:grid-cols-2" : "max-w-lg mx-auto"} gap-6 lg:gap-8`}>
          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 lg:p-10 flex flex-col"
          >
            <div className="mb-6">
              <p className="text-sm font-semibold text-page-muted uppercase tracking-wide mb-1">
                Free
              </p>
              <h3 className="font-heading font-bold text-page text-2xl mb-3">
                Download the app
              </h3>
              <div className="flex items-end gap-2">
                <span className="font-heading font-extrabold text-page text-5xl leading-none">
                  $0
                </span>
                <span className="text-page-muted text-sm mb-2">forever</span>
              </div>
            </div>

            {section.features.length > 0 && (
              <ul className="space-y-3 mb-8 flex-1">
                {section.features.slice(0, 5).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-page-muted text-sm"
                  >
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: `var(--brand-primary)` }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <StoreBadgesRow
              appStoreUrl={app.appStoreUrl}
              playStoreUrl={app.playStoreUrl}
              className="justify-start"
            />
          </motion.div>

          {/* Premium tier */}
          {hasPremium && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-3xl p-8 lg:p-10 flex flex-col overflow-hidden"
              style={{
                background: `linear-gradient(160deg, color-mix(in srgb, var(--brand-primary) 20%, var(--page-bg-card)), var(--page-bg-card))`,
                border: `1.5px solid color-mix(in srgb, var(--brand-primary) 40%, transparent)`,
                boxShadow: `0 24px 64px color-mix(in srgb, var(--brand-primary) 20%, transparent)`,
              }}
            >
              {section.badge && (
                <div className="absolute top-6 right-6">
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(245, 158, 11, 0.15)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      color: "#f59e0b",
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {section.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p
                  className="text-sm font-semibold uppercase tracking-wide mb-1"
                  style={{ color: `var(--brand-primary)` }}
                >
                  Premium
                </p>
                <h3 className="font-heading font-bold text-page text-2xl mb-3">
                  {product.name}
                </h3>
                <div className="flex items-end gap-2">
                  <span className="text-page-muted text-sm mb-4">$</span>
                  <span className="font-heading font-extrabold text-page text-5xl leading-none">
                    {product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-page-muted text-sm line-through mb-2">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {section.features.length > 5 && (
                <ul className="space-y-3 mb-8 flex-1">
                  {section.features.slice(5).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-page text-sm"
                    >
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {section.features.length <= 5 && (
                <ul className="space-y-3 mb-8 flex-1">
                  {section.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-page text-sm"
                    >
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <Button
                onClick={handleUpgrade}
                size="lg"
                className="w-full text-white font-bold text-base py-4 rounded-xl shadow-xl transition-all duration-200 border-0 h-auto hover:opacity-95"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  boxShadow: `0 14px 32px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
                }}
              >
                {section.ctaLabel || `Upgrade for $${product.price}`}
              </Button>

              {section.guarantee && (
                <p className="text-xs text-page-muted text-center mt-4">
                  {section.guarantee}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
