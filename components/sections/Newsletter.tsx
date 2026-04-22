"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
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
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      setSubmitted(true);
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent" />

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 10%, transparent), transparent 55%, color-mix(in srgb, var(--brand-accent) 10%, transparent))`,
        }}
      />
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{
              background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
              boxShadow: `0 12px 32px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
            }}
          >
            <Mail className="w-7 h-7" style={{ color: "#fff" }} />
          </div>

          <span className="inline-block px-3 py-1.5 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-semibold tracking-wide uppercase mb-4">
            Stay in the loop
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Weekly tactics for{" "}
            <span className="gradient-text">SaaS founders</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Get one actionable framework, insight, or template every Tuesday. Straight to your
            inbox. No fluff. Unsubscribe any time.
          </p>

          {submitted ? (
            <div className="glass rounded-2xl px-8 py-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <p className="font-semibold">You&apos;re on the list — see you Tuesday!</p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/[0.05] border-white/10 text-white placeholder:text-slate-500 focus:border-[var(--brand-primary)] rounded-xl h-12 text-base"
              />
              <Button
                type="submit"
                disabled={loading}
                className="text-white font-bold px-6 rounded-xl h-12 border-0 shadow-lg transition-all hover:opacity-90 whitespace-nowrap"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                  boxShadow: `0 8px 24px color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
                }}
              >
                {loading ? "Subscribing…" : "Subscribe"}
                {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </Button>
            </form>
          )}

          <p className="text-slate-600 text-xs mt-4">
            Join 4,000+ founders. No spam. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
