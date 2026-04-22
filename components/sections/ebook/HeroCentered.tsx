"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Star, BookOpen, Users, Award } from "lucide-react";
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
import Image from "next/image";

export function EbookHeroCentered() {
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
      if (data.url) window.location.assign(data.url);
    } catch {
      alert("Checkout unavailable. Please try again.");
    }
  };

  const { product, leadMagnet } = siteConfig;
  const section = siteConfig.sections.hero;
  const productImage = section.image.url || siteConfig.brand.productImageUrl;

  if (!section.enabled) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div
        className="hero-glow w-[700px] h-[700px] top-[-150px] left-1/2 -translate-x-1/2"
        style={{ background: `color-mix(in srgb, var(--brand-primary, #6366f1) 18%, transparent)` }}
      />
      <div className="dot-grid absolute inset-0" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {section.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                background: `color-mix(in srgb, var(--brand-primary, #6366f1) 15%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-primary, #6366f1) 25%, transparent)`,
                color: `var(--brand-primary, #6366f1)`,
              }}
            >
              <Star className="w-3 h-3 fill-current" />
              {section.eyebrow}
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
          style={{ color: "var(--page-text)" }}
        >
          {section.headline}
          {section.headlineAccent && (
            <span className="block gradient-text mt-1">{section.headlineAccent}</span>
          )}
        </motion.h1>

        {section.description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: "var(--page-text-muted)" }}
          >
            {section.description}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          {section.ctaPrimary.label && (
            <Button
              onClick={handleBuyNow}
              size="lg"
              className="h-13 px-8 rounded-xl text-white font-bold text-base shadow-xl border-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))`,
                boxShadow: `0 8px 32px color-mix(in srgb, var(--brand-primary, #6366f1) 35%, transparent)`,
              }}
            >
              {section.ctaPrimary.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {section.ctaSecondary.label && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="h-13 px-8 rounded-xl font-semibold text-base border-page hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all"
              style={{ color: "var(--page-text)" }}
            >
              <Download className="w-4 h-4 mr-2" />
              {section.ctaSecondary.label}
            </Button>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm mb-16"
          style={{ color: "var(--page-text-muted)" }}
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <strong className="text-page">3,200+</strong> readers
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <strong className="text-page">{product.pages}</strong> pages
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <strong className="text-page">{product.chapters}</strong> chapters
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <strong className="text-page">4.9</strong>/5 rating
          </span>
        </motion.div>

        {/* Product mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-sm"
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={section.image.alt || product.name}
              width={400}
              height={520}
              className="w-full rounded-2xl shadow-2xl"
              style={{ boxShadow: `0 32px 80px color-mix(in srgb, var(--brand-primary, #6366f1) 25%, rgba(0,0,0,0.4))` }}
            />
          ) : (
            <div
              className="relative w-64 h-80 mx-auto rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary, #6366f1) 25%, var(--page-bg-card, #111827)), var(--page-bg-card, #111827))`,
                border: `1px solid color-mix(in srgb, var(--brand-primary, #6366f1) 20%, transparent)`,
                boxShadow: `0 32px 80px color-mix(in srgb, var(--brand-primary, #6366f1) 25%, rgba(0,0,0,0.4))`,
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, var(--brand-primary, #6366f1) 20%, transparent)` }}
                >
                  <BookOpen className="w-8 h-8" style={{ color: "var(--brand-primary, #6366f1)" }} />
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-page text-lg leading-tight">{product.name}</p>
                  <p className="text-xs mt-1.5" style={{ color: "var(--page-text-muted)" }}>
                    {product.format} · {product.pages} pages
                  </p>
                </div>
              </div>
              {/* Spine effect */}
              <div
                className="absolute left-0 top-0 bottom-0 w-6 opacity-60"
                style={{ background: `linear-gradient(to right, color-mix(in srgb, var(--brand-accent, #8b5cf6) 40%, transparent), transparent)` }}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Free chapter dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{leadMagnet.title}</DialogTitle>
            <DialogDescription>{leadMagnet.description}</DialogDescription>
          </DialogHeader>
          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-7 h-7 text-green-400" />
              </div>
              <p className="font-semibold text-page mb-1">Check your inbox!</p>
              <p className="text-sm text-page-muted">The free chapter is on its way.</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 pt-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="text-white font-semibold border-0"
                style={{ background: `linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))` }}
              >
                {loading ? "Sending…" : "Send Me the Free Chapter"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
