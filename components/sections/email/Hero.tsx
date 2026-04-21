"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Gift, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/config";

export function EmailHero() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { product, leadMagnet, stats } = siteConfig;

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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Glows */}
      <div className="hero-glow w-[600px] h-[600px] top-[-100px] left-1/2 -translate-x-1/2 bg-[var(--brand-primary)]/15" />
      <div className="dot-grid absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Free badge */}
            <div className="inline-flex items-center gap-2">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
                style={{
                  background: `color-mix(in srgb, var(--brand-primary) 15%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
                  color: `var(--brand-primary)`,
                }}
              >
                <Gift className="w-3.5 h-3.5" />
                100% Free · No credit card
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              {product.name.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="gradient-text">
                {product.name.split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            <p className="text-slate-400 text-xl leading-relaxed">{product.description}</p>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-400 text-sm">{stats[0].value} founders subscribed</span>
            </div>
          </motion.div>

          {/* Email form — primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg mx-auto"
          >
            {submitted ? (
              <div className="glass rounded-2xl px-8 py-8 space-y-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: `color-mix(in srgb, var(--brand-primary) 20%, transparent)` }}
                >
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-bold text-lg">Check your inbox!</p>
                  <p className="text-slate-400 text-sm">
                    {leadMagnet.description} It might take a few minutes.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="glass rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-500 h-12 rounded-xl text-base focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/20"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 px-6 font-bold rounded-xl border-0 text-white whitespace-nowrap shadow-xl transition-all"
                      style={{
                        background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                        boxShadow: `0 8px 32px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
                      }}
                    >
                      {loading ? "Sending…" : leadMagnet.title}
                      {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
                    </Button>
                  </div>
                </div>
                <p className="text-slate-500 text-xs text-center">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                  No spam. Free forever. Unsubscribe in one click.
                </p>
              </form>
            )}
          </motion.div>

          {/* Value bullets */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { icon: "🎁", text: "Instant download" },
              { icon: "🔄", text: "Updated monthly" },
              { icon: "🔓", text: "No paywall, ever" },
            ].map((item) => (
              <div key={item.text} className="glass rounded-xl px-4 py-3 text-sm text-slate-300">
                <span className="mr-2">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
