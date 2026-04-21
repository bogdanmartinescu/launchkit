"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Layers,
  BookOpen,
  TrendingUp,
  Zap,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Layers,
  BookOpen,
  TrendingUp,
  Zap,
  MessageSquare,
};

export function EmailFeatures() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            What&apos;s inside
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Everything you need,{" "}
            <span className="gradient-text">free to access</span>
          </h2>
          <p className="text-slate-400 text-lg">
            No paywall. No teaser. Just the full, actionable toolkit — delivered to your inbox
            instantly.
          </p>
        </motion.div>

        {/* Feature list — two-column with checklist style */}
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {siteConfig.features.map((feature, idx) => {
            const Icon = iconMap[feature.icon] ?? Zap;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.07, ease: "easeOut" }}
                className="group glass rounded-2xl p-5 flex gap-4 hover:border-[var(--brand-primary)]/30 transition-all duration-300 cursor-default"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                  style={{
                    background: `color-mix(in srgb, var(--brand-primary) 15%, transparent)`,
                    border: `1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)`,
                  }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: `var(--brand-primary)` }} />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-heading font-bold text-white text-sm">{feature.title}</h3>
                    <span
                      className="shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5"
                      style={{
                        color: `var(--brand-primary)`,
                        background: `color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                      }}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {feature.highlight}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{feature.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
