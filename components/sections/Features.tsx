"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Users,
  CreditCard,
  BarChart2,
  MessageSquare,
  Zap,
  Bell,
  Smartphone,
  MapPin,
  Camera,
  Lock,
  WifiOff,
  Heart,
  Sparkles,
  Globe,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  Users,
  CreditCard,
  BarChart2,
  MessageSquare,
  Zap,
  Bell,
  Smartphone,
  MapPin,
  Camera,
  Lock,
  WifiOff,
  Heart,
  Sparkles,
  Globe,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export function Features() {
  const section = siteConfig.sections.features;
  if (!section.enabled || section.items.length === 0) return null;

  return (
    <section id="features" className="py-24 lg:py-32 relative">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
        >
          {section.eyebrow && (
            <span className="inline-block px-3 py-1.5 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-semibold tracking-wide uppercase mb-4">
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
            <p className="text-slate-400 text-lg leading-relaxed">
              {section.subheading}
            </p>
          )}
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {section.items.map((feature) => {
            const Icon = iconMap[feature.icon] ?? Zap;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group relative glass rounded-2xl p-6 hover:border-[var(--brand-primary)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--brand-primary)]/10 cursor-default"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[var(--brand-primary)]/10 group-hover:bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-5 h-5 text-[var(--brand-primary)]" />
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-white text-lg mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {feature.body}
                </p>

                {/* Highlight pill */}
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
                  {feature.highlight}
                </span>

                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 5%, transparent), color-mix(in srgb, var(--brand-accent) 5%, transparent))`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
