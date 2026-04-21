"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/config";

export function Hero() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
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

  const handleBuyNow = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: siteConfig.integrations.stripePriceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Checkout unavailable. Please try again.");
    }
  };

  const { product, leadMagnet, stats } = siteConfig;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background glows */}
      <div className="hero-glow w-[600px] h-[600px] top-[-100px] left-[-200px] bg-[var(--brand-primary)]/20" />
      <div className="hero-glow w-[400px] h-[400px] bottom-[-50px] right-[-100px] bg-[var(--brand-accent)]/15" />
      <div className="dot-grid absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-start">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
                style={{
                  background: `color-mix(in srgb, var(--brand-primary) 15%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
                  color: `var(--brand-primary)`,
                }}
              >
                <Star className="w-3 h-3 fill-current" />
                {product.badge}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                {product.name.split(" ").slice(0, 3).join(" ")}{" "}
                <span className="gradient-text">{product.name.split(" ").slice(3).join(" ")}</span>
              </h1>
              <p
                className="text-xl font-semibold font-heading"
                style={{ color: `var(--brand-primary)` }}
              >
                {product.tagline}
              </p>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              {product.description}
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-slate-400 ml-1.5">{stats[0].value} founders</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="group text-white font-bold px-8 py-4 text-base rounded-xl transition-all duration-200 border-0 h-auto"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  boxShadow: `0 8px 32px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
                }}
              >
                Buy Now — ${product.price}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => setDialogOpen(true)}
                variant="outline"
                size="lg"
                className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 text-base rounded-xl h-auto transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" style={{ color: `var(--brand-primary)` }} />
                {leadMagnet.title}
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>30-day money-back guarantee · Instant download · DRM-free</span>
            </div>
          </motion.div>

          {/* Right: Book mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl scale-110 opacity-30"
                style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
              />

              {/* Book cover */}
              <div className="relative w-72 sm:w-80 lg:w-96 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative"
                  style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 40%, #0a0f1e), color-mix(in srgb, var(--brand-accent) 30%, #0a0f1e))` }}
                >
                  <div className="absolute inset-0 dot-grid opacity-30" />
                  <div className="relative z-10 space-y-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
                      style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-white text-xl leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-white/70 text-sm font-medium">{product.tagline}</p>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/50 text-xs">
                        {product.pages} pages · {product.format}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/40 to-transparent" />
              </div>

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-4 -left-6 glass rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-none">{stats[0].value}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Founders</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="absolute -top-4 -right-6 glass rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `color-mix(in srgb, var(--brand-primary) 20%, transparent)` }}
                  >
                    <ShieldCheck className="w-4 h-4" style={{ color: `var(--brand-primary)` }} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-none">30-day</p>
                    <p className="text-slate-400 text-xs mt-0.5">Guarantee</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Email signup dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#111827] border border-white/10 text-white max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold text-white">
              {leadMagnet.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
              {leadMagnet.description}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-white font-semibold">Check your inbox!</p>
              <p className="text-slate-400 text-sm">We&apos;ve sent the free chapter. Enjoy!</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4 pt-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/[0.05] border-white/10 text-white placeholder:text-slate-500 rounded-xl h-12"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold rounded-xl h-12 text-base border-0 transition-all"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                }}
              >
                {loading ? "Sending…" : "Send Me the Free Chapter"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
              <p className="text-center text-xs text-slate-500">
                No spam, ever. Unsubscribe in one click.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
