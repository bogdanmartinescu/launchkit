"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, CheckCircle2 } from "lucide-react";
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

export function EbookHeroMinimal() {
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

  if (!section.enabled) return null;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Very subtle background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent), transparent)`,
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {section.eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--brand-primary, #6366f1)" }}
          >
            {section.eyebrow}
          </motion.p>
        )}

        {/* Big headline — minimal, left-aligned */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.07 }}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.06] tracking-tight mb-8"
          style={{ color: "var(--page-text)" }}
        >
          {section.headline}
          {section.headlineAccent && (
            <>
              {" "}
              <span className="gradient-text">{section.headlineAccent}</span>
            </>
          )}
        </motion.h1>

        {section.subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="text-xl lg:text-2xl font-medium mb-6"
            style={{ color: "var(--page-text-muted)" }}
          >
            {section.subheadline}
          </motion.p>
        )}

        {section.bullets.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3 mb-12"
          >
            {section.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-base" style={{ color: "var(--page-text-muted)" }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--brand-primary, #6366f1)" }} />
                {b}
              </li>
            ))}
          </motion.ul>
        )}

        {/* Price + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="font-heading text-4xl font-extrabold" style={{ color: "var(--page-text)" }}>
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg line-through" style={{ color: "var(--page-text-subtle)" }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs" style={{ color: "var(--page-text-muted)" }}>
              One-time payment · {product.format}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {section.ctaPrimary.label && (
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="h-13 px-8 rounded-xl text-white font-bold text-base shadow-xl border-0 hover:opacity-90 hover:scale-[1.02] transition-all"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary, #6366f1), var(--brand-accent, #8b5cf6))`,
                }}
              >
                {section.ctaPrimary.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {section.ctaSecondary.label && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setDialogOpen(true)}
                className="h-13 px-6 rounded-xl font-semibold hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                style={{ color: "var(--page-text-muted)" }}
              >
                <Download className="w-4 h-4 mr-2" />
                {section.ctaSecondary.label}
              </Button>
            )}
          </div>
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
                <CheckCircle2 className="w-7 h-7 text-green-400" />
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
