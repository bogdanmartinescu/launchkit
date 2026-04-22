"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function Pricing() {
  const { product } = siteConfig;
  const section = siteConfig.sections.pricing;

  const handleBuyNow = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: siteConfig.integrations.stripePriceId }),
      });
      const data = await res.json();
      if (data.url) window.location.assign(data.url);
    } catch {
      alert("Checkout unavailable. Please try again.");
    }
  };

  if (!section.enabled) return null;

  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: `color-mix(in srgb, var(--brand-primary) 10%, transparent)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          {section.eyebrow && (
            <span className="inline-block px-3 py-1.5 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-semibold tracking-wide uppercase mb-4">
              {section.eyebrow}
            </span>
          )}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {section.heading}
            {section.headingAccent && (
              <>
                {" "}
                <span className="gradient-text">{section.headingAccent}</span>
              </>
            )}
          </h2>
          {section.subheading && (
            <p className="text-slate-400 text-lg">{section.subheading}</p>
          )}
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg mx-auto"
        >
          <div className="relative glass rounded-3xl p-8 lg:p-10 overflow-hidden gradient-border">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 8%, transparent), color-mix(in srgb, var(--brand-accent) 8%, transparent))`,
              }}
            />

            {/* Popular badge */}
            {section.badge && (
              <div className="absolute top-6 right-6">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/25 text-amber-400 text-xs font-bold">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  {section.badge}
                </span>
              </div>
            )}

            <div className="relative z-10">
              {/* Product name */}
              <h3 className="font-heading font-bold text-white text-xl mb-1">
                {product.name}
              </h3>
              <p className="text-slate-400 text-sm mb-8">{product.tagline}</p>

              {/* Price */}
              <div className="flex items-end gap-3 mb-8">
                <div className="flex items-start">
                  <span className="text-slate-400 text-xl font-semibold mt-1">$</span>
                  <span className="font-heading font-extrabold text-white text-7xl leading-none">
                    {product.price}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <span className="text-slate-500 text-sm line-through">${product.originalPrice}</span>
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    Save ${product.originalPrice - product.price}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="group w-full text-white font-bold text-lg py-4 rounded-xl shadow-xl transition-all duration-200 border-0 h-auto mb-4 hover:opacity-95"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  boxShadow: `0 16px 40px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
                }}
              >
                {section.ctaLabel}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Guarantee */}
              {section.guarantee && (
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-8">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {section.guarantee}
                </div>
              )}

              {/* Divider */}
              {section.features.length > 0 && (
                <div className="border-t border-white/[0.06] pt-8">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">
                    {section.includedLabel}
                  </p>
                  <ul className="space-y-3">
                    {section.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-slate-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
        >
          {section.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading font-extrabold text-white text-2xl lg:text-3xl gradient-text">
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
