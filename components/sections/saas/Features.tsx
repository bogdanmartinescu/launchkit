"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  BarChart2,
  CreditCard,
  Users,
  Globe,
  BookOpen,
  Layers,
  FileText,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const iconMap: Record<string, React.ElementType> = {
  Zap,
  ShieldCheck,
  BarChart2,
  CreditCard,
  Users,
  Globe,
  BookOpen,
  Layers,
  FileText,
  TrendingUp,
  MessageSquare,
};

export function SaasFeatures() {
  const section = siteConfig.sections.features;
  if (!section.enabled || section.items.length === 0) return null;

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
          {section.eyebrow && (
            <span
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
              style={{
                background: `color-mix(in srgb, var(--brand-primary) 15%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
                color: `var(--brand-primary)`,
              }}
            >
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {section.items.map((feature, idx) => {
            const Icon = iconMap[feature.icon] ?? Zap;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
                className="group glass rounded-2xl p-6 hover:border-[var(--brand-primary)]/30 transition-all duration-300 hover:shadow-lg cursor-default relative overflow-hidden"
                style={{
                  ["--hover-shadow" as string]: `color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-[var(--brand-primary)]/5 to-[var(--brand-accent)]/5" />

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors relative z-10"
                  style={{
                    background: `color-mix(in srgb, var(--brand-primary) 15%, transparent)`,
                    border: `1px solid color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: `var(--brand-primary)` }} />
                </div>

                <h3 className="font-heading font-bold text-white text-base mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 relative z-10">
                  {feature.body}
                </p>

                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full relative z-10"
                  style={{
                    color: `var(--brand-primary)`,
                    background: `color-mix(in srgb, var(--brand-primary) 12%, transparent)`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: `var(--brand-primary)` }}
                  />
                  {feature.highlight}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
