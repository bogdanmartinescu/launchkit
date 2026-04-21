"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, ShieldCheck, Zap } from "lucide-react";
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

export function SaasHero() {
  const [demoOpen, setDemoOpen] = useState(false);
  const { product, leadMagnet } = siteConfig;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background glows */}
      <div className="hero-glow w-[700px] h-[700px] top-[-200px] right-[-200px] bg-[var(--brand-primary)]/15" />
      <div className="hero-glow w-[500px] h-[500px] bottom-[-100px] left-[-150px] bg-[var(--brand-accent)]/10" />
      <div className="dot-grid absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-semibold tracking-wide uppercase">
                <Zap className="w-3 h-3 fill-current" />
                {product.badge}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.0] tracking-tight">
                {product.name.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="gradient-text">{product.name.split(" ").slice(-1)}</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Star rating */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-slate-400">500+ teams already building</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group h-auto py-4 px-8 text-base font-bold rounded-xl text-white border-0 shadow-xl transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  boxShadow: `0 8px 32px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
                }}
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => setDemoOpen(true)}
                variant="outline"
                size="lg"
                className="group h-auto py-4 px-8 text-base font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white rounded-xl transition-all duration-200"
              >
                <Play className="w-4 h-4 mr-2 fill-current opacity-60" />
                Watch Demo
              </Button>
            </div>

            {/* Trust */}
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>14-day free trial · No credit card required · Cancel anytime</span>
            </div>
          </motion.div>

          {/* App screenshot mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-16 relative"
          >
            {/* Glow behind screenshot */}
            <div
              className="absolute inset-0 blur-3xl scale-90 opacity-30 rounded-3xl"
              style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
            />

            {/* Dashboard placeholder */}
            <div className="relative glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <div className="flex-1 mx-4">
                  <div className="h-5 bg-white/[0.06] rounded-md w-48 mx-auto" />
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 lg:p-8 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "MRR", value: "$12,480", change: "+18%" },
                    { label: "Active Users", value: "1,284", change: "+6%" },
                    { label: "Churn Rate", value: "2.1%", change: "-0.4%" },
                    { label: "NPS Score", value: "67", change: "+3" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="glass rounded-xl p-4 space-y-1"
                    >
                      <p className="text-slate-500 text-xs">{stat.label}</p>
                      <p className="text-white font-bold text-lg">{stat.value}</p>
                      <p className="text-emerald-400 text-xs font-semibold">{stat.change}</p>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="glass rounded-xl p-4 h-32 flex items-end gap-1.5">
                  {[40, 65, 50, 80, 70, 90, 75, 95, 85, 100, 88, 110].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm opacity-70"
                      style={{
                        height: `${h * 0.7}%`,
                        background: `linear-gradient(to top, var(--brand-primary), var(--brand-accent))`,
                      }}
                    />
                  ))}
                </div>

                {/* Table placeholder rows */}
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-2">
                      <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                      <div className="flex-1 h-4 bg-white/[0.04] rounded" />
                      <div className="w-16 h-4 bg-white/[0.04] rounded" />
                      <div className="w-20 h-6 bg-[var(--brand-primary)]/20 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demo modal */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="bg-[#111827] border border-white/10 text-white max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold text-white">
              Watch the Demo
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
              {leadMagnet.description}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
              >
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
              <p className="text-slate-500 text-sm">Demo video placeholder</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500">
            Replace this with your Loom or YouTube embed.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
