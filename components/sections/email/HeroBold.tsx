"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/config";

const STAT_ICONS = [Users, Mail, Shield];

export function EmailHeroBold() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero" }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const { leadMagnet } = siteConfig;
  const section = siteConfig.sections.hero;
  const stats = siteConfig.sections.pricing.stats;

  if (!section.enabled) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Bold full-bleed gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(150deg,
            color-mix(in srgb, var(--brand-primary, #6366f1) 22%, var(--page-bg, #0a0f1e)) 0%,
            var(--page-bg, #0a0f1e) 50%,
            color-mix(in srgb, var(--brand-accent, #8b5cf6) 18%, var(--page-bg, #0a0f1e)) 100%)`,
        }}
      />
      <div className="dot-grid absolute inset-0 opacity-50" />

      {/* Large ambient orbs */}
      <div
        className="hero-glow w-[600px] h-[600px] top-[-200px] left-[-100px]"
        style={{ background: `color-mix(in srgb, var(--brand-primary, #6366f1) 20%, transparent)` }}
      />
      <div
        className="hero-glow w-[400px] h-[400px] bottom-[-100px] right-[-80px]"
        style={{ background: `color-mix(in srgb, var(--brand-accent, #8b5cf6) 18%, transparent)` }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
            style={{
              background: `linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))`,
              boxShadow: `0 8px 32px color-mix(in srgb, var(--brand-primary, #6366f1) 40%, transparent)`,
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Huge bold headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.06] tracking-tight mb-6"
          style={{ color: "var(--page-text)" }}
        >
          {section.headline}
          {section.headlineAccent && (
            <span className="block gradient-text mt-2 text-4xl sm:text-5xl lg:text-6xl">
              {section.headlineAccent}
            </span>
          )}
        </motion.h1>

        {/* Description */}
        {section.description && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-lg lg:text-xl leading-relaxed max-w-xl mx-auto mb-10"
            style={{ color: "var(--page-text-muted)" }}
          >
            {section.description}
          </motion.p>
        )}

        {/* Prominent email form */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
        >
          {submitted ? (
            <div className="glass rounded-2xl px-8 py-10 max-w-md mx-auto">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `color-mix(in srgb, var(--brand-primary, #6366f1) 20%, transparent)` }}
              >
                <ArrowRight className="w-7 h-7" style={{ color: "var(--brand-primary, #6366f1)" }} />
              </div>
              <p className="font-heading text-xl font-bold mb-1" style={{ color: "var(--page-text)" }}>
                You&apos;re in! 🎉
              </p>
              <p className="text-sm" style={{ color: "var(--page-text-muted)" }}>
                Welcome aboard. Check your inbox for the welcome email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--page-text-muted)" }}
                />
                <Input
                  type="email"
                  placeholder={leadMagnet.description || "Enter your email…"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-13 rounded-xl text-base"
                  style={{
                    background: "var(--glass-bg)",
                    border: `1px solid var(--glass-border)`,
                    color: "var(--page-text)",
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="h-13 px-7 rounded-xl text-white font-bold border-0 whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))`,
                  boxShadow: `0 6px 20px color-mix(in srgb, var(--brand-primary, #6366f1) 35%, transparent)`,
                }}
              >
                {loading ? "Joining…" : (
                  <>
                    {section.ctaPrimary.label || leadMagnet.title || "Subscribe Free"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {section.trustLine && (
            <p className="text-xs mt-4" style={{ color: "var(--page-text-subtle)" }}>
              {section.trustLine}
            </p>
          )}
        </motion.div>

        {/* Stats row */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="flex flex-wrap items-center justify-center gap-10 mt-16"
          >
            {stats.map((stat, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent)` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--brand-primary, #6366f1)" }} />
                  </div>
                  <div className="text-left">
                    <p className="font-heading text-lg font-bold leading-none mb-0.5" style={{ color: "var(--page-text)" }}>
                      {stat.value}
                    </p>
                    <p className="text-xs" style={{ color: "var(--page-text-muted)" }}>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
