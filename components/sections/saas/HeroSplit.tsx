"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, CheckCircle2, Zap, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import Image from "next/image";

const HIGHLIGHTS = [
  { icon: Zap, text: "Ship 10× faster" },
  { icon: Shield, text: "Enterprise-grade security" },
  { icon: BarChart3, text: "Real-time analytics" },
];

export function SaasHeroSplit() {
  const { product } = siteConfig;
  const productImage = siteConfig.brand.productImageUrl;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Glows */}
      <div
        className="hero-glow w-[500px] h-[500px] top-[-80px] right-[-120px]"
        style={{ background: `color-mix(in srgb, var(--brand-primary, #6366f1) 15%, transparent)` }}
      />
      <div
        className="hero-glow w-[300px] h-[300px] bottom-0 left-[-60px]"
        style={{ background: `color-mix(in srgb, var(--brand-accent, #8b5cf6) 12%, transparent)` }}
      />
      <div className="dot-grid absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Badge */}
            <span
              className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                background: `color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-primary, #6366f1) 22%, transparent)`,
                color: `var(--brand-primary, #6366f1)`,
              }}
            >
              {product.badge}
            </span>

            <div>
              <h1
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5"
                style={{ color: "var(--page-text)" }}
              >
                {product.name}
                <span className="block gradient-text">{product.tagline}</span>
              </h1>
              <p className="text-lg lg:text-xl leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                {product.description}
              </p>
            </div>

            {/* Highlight bullets */}
            <ul className="flex flex-col gap-3">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, var(--brand-primary, #6366f1) 15%, transparent)` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "var(--brand-primary, #6366f1)" }} />
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--page-text)" }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-13 px-8 rounded-xl text-white font-bold text-base shadow-xl border-0 hover:opacity-90 hover:scale-[1.02] transition-all"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))`,
                  boxShadow: `0 8px 28px color-mix(in srgb, var(--brand-primary, #6366f1) 30%, transparent)`,
                }}
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-13 px-7 rounded-xl font-semibold gap-2 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                style={{ color: "var(--page-text-muted)" }}
              >
                <PlayCircle className="w-5 h-5" />
                Watch demo
              </Button>
            </div>

            {/* Trust */}
            <p className="text-xs flex items-center gap-2" style={{ color: "var(--page-text-subtle)" }}>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              No credit card required · Free for 14 days · Cancel anytime
            </p>
          </motion.div>

          {/* Right: App screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Outer glow ring */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-30"
              style={{ background: `linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))` }}
            />
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: `1px solid color-mix(in srgb, var(--brand-primary, #6366f1) 20%, var(--glass-border))`,
                boxShadow: `0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent)`,
              }}
            >
              {productImage ? (
                <Image
                  src={productImage}
                  alt={`${product.name} screenshot`}
                  width={720}
                  height={480}
                  className="w-full h-auto"
                />
              ) : (
                <div
                  className="w-full h-80 lg:h-96"
                  style={{ background: "var(--page-bg-card)" }}
                >
                  {/* Fake UI chrome */}
                  <div
                    className="flex items-center gap-1.5 px-4 h-10 border-b"
                    style={{ borderColor: "var(--page-border)" }}
                  >
                    {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                    ))}
                    <div
                      className="flex-1 h-5 mx-4 rounded-full"
                      style={{ background: "var(--glass-bg)" }}
                    />
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-14 rounded-xl animate-pulse"
                        style={{
                          background: `color-mix(in srgb, var(--brand-primary, #6366f1) ${10 + i * 3}%, var(--glass-bg))`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="px-5 grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-20 rounded-xl"
                        style={{ background: "var(--glass-bg)", border: `1px solid var(--glass-border)` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 glass rounded-xl px-4 py-3 shadow-xl"
            >
              <p className="text-xs font-medium" style={{ color: "var(--page-text-muted)" }}>MRR Growth</p>
              <p className="font-heading text-xl font-bold gradient-text">+127%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute -top-5 -right-5 glass rounded-xl px-4 py-3 shadow-xl"
            >
              <p className="text-xs font-medium" style={{ color: "var(--page-text-muted)" }}>Active Users</p>
              <p className="font-heading text-xl font-bold" style={{ color: "var(--page-text)" }}>12,400</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
