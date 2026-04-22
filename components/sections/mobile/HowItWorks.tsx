"use client";

import { motion } from "framer-motion";
import {
  Download,
  UserPlus,
  Rocket,
  Sparkles,
  MapPin,
  Bell,
  Heart,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const iconMap: Record<string, React.ElementType> = {
  Download,
  UserPlus,
  Rocket,
  Sparkles,
  MapPin,
  Bell,
  Heart,
  Zap,
};

/**
 * Numbered step-by-step onboarding for a mobile app. Perfect for showing
 * a 3-step user journey (Download → Sign up → Enjoy).
 */
export function HowItWorks() {
  const section = siteConfig.sections.howItWorks;
  if (!section.enabled || section.items.length === 0) return null;

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
        style={{
          background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--brand-primary) 30%, transparent), transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
                background: `color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)`,
                color: `var(--brand-primary)`,
              }}
            >
              {section.eyebrow}
            </span>
          )}
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-page mb-4 leading-tight">
            {section.heading}
            {section.headingAccent && (
              <>
                {" "}
                <span className="gradient-text">{section.headingAccent}</span>
              </>
            )}
          </h2>
          {section.subheading && (
            <p className="text-lg text-page-muted leading-relaxed">{section.subheading}</p>
          )}
        </motion.div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-6">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden md:block absolute top-[3.25rem] left-[16.66%] right-[16.66%] h-px -z-0"
            style={{
              background: `linear-gradient(to right, color-mix(in srgb, var(--brand-primary) 40%, transparent), color-mix(in srgb, var(--brand-accent) 40%, transparent))`,
            }}
          />

          {section.items.map((step, idx) => {
            const Icon = iconMap[step.icon] ?? Download;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center text-center px-4"
              >
                {/* Numbered icon disc */}
                <div className="relative mb-6">
                  <div
                    className="w-[6.5rem] h-[6.5rem] rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                      boxShadow: `0 16px 40px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
                    }}
                  >
                    <Icon className="w-9 h-9" style={{ color: "#fff" }} />
                  </div>
                  <div
                    className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center font-heading font-extrabold text-sm shadow-lg"
                    style={{
                      background: "var(--page-bg-card)",
                      border: `2px solid color-mix(in srgb, var(--brand-primary) 40%, transparent)`,
                      color: `var(--brand-primary)`,
                    }}
                  >
                    {idx + 1}
                  </div>
                </div>

                <h3 className="font-heading font-bold text-page text-xl mb-2">
                  {step.title}
                </h3>
                <p className="text-page-muted text-sm leading-relaxed max-w-xs">
                  {step.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
