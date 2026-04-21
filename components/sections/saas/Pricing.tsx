"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function SaasPricing() {
  const { pricingTiers, pricing } = siteConfig;

  const handleTierClick = async (tier: (typeof pricingTiers)[number]) => {
    if (!tier.stripePriceId) {
      alert("Stripe price ID not configured. Set it in the /setup wizard.");
      return;
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: tier.stripePriceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Checkout unavailable. Please try again.");
    }
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          className="w-[600px] h-[400px] rounded-full blur-3xl opacity-10"
          style={{ background: `var(--brand-primary)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span
            className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
            style={{
              background: `color-mix(in srgb, var(--brand-primary) 15%, transparent)`,
              border: `1px solid color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
              color: `var(--brand-primary)`,
            }}
          >
            Simple, transparent pricing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Choose your <span className="gradient-text">growth plan</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Start free. Scale when you&apos;re ready. No hidden fees.
          </p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: "easeOut" }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                tier.isPopular
                  ? "border-2 shadow-2xl"
                  : "glass"
              }`}
              style={
                tier.isPopular
                  ? {
                      border: `2px solid color-mix(in srgb, var(--brand-primary) 50%, transparent)`,
                      background: `color-mix(in srgb, var(--brand-primary) 8%, #111827)`,
                      boxShadow: `0 25px 60px color-mix(in srgb, var(--brand-primary) 20%, transparent)`,
                    }
                  : {}
              }
            >
              {/* Popular badge */}
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                    }}
                  >
                    <Zap className="w-3 h-3 fill-white" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-heading font-bold text-white text-lg mb-4">{tier.name}</h3>
                <div className="flex items-end gap-1.5">
                  {tier.price !== null ? (
                    <>
                      <span className="text-slate-400 text-lg font-semibold mt-1">$</span>
                      <span className="font-heading font-extrabold text-white text-5xl leading-none">
                        {tier.price}
                      </span>
                      <span className="text-slate-400 text-sm mb-1">/{tier.period}</span>
                    </>
                  ) : (
                    <span className="font-heading font-extrabold text-white text-4xl leading-none">
                      Custom
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleTierClick(tier)}
                size="lg"
                className={`group w-full font-bold rounded-xl h-12 border-0 transition-all duration-200 ${
                  tier.isPopular ? "text-white shadow-lg" : "bg-white/[0.06] hover:bg-white/[0.1] text-white"
                }`}
                style={
                  tier.isPopular
                    ? {
                        background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                        boxShadow: `0 8px 24px color-mix(in srgb, var(--brand-primary) 35%, transparent)`,
                      }
                    : {}
                }
              >
                {tier.ctaLabel}
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        {pricing.guarantee && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-10 text-slate-500 text-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {pricing.guarantee}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
        >
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading font-extrabold text-white text-2xl gradient-text">
                {stat.value}
              </p>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
