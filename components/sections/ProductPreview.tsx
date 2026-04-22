"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Gift, User } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function ProductPreview() {
  const section = siteConfig.sections.preview;
  const { product } = siteConfig;
  if (!section.enabled || section.tocItems.length === 0) return null;

  return (
    <section id="preview" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          {section.eyebrow && (
            <span className="inline-block px-3 py-1.5 rounded-full bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/20 text-[var(--brand-accent)] text-xs font-semibold tracking-wide uppercase mb-4">
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Book mockup + stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Book card */}
            <div className="relative glass rounded-3xl p-8 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 5%, transparent), color-mix(in srgb, var(--brand-accent) 5%, transparent))`,
                }}
              />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-28 h-36 rounded-xl overflow-hidden shadow-2xl shadow-black/50 flex-shrink-0">
                  <div
                    className="w-full h-full flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 35%, #0b1020), color-mix(in srgb, var(--brand-accent) 35%, #0b1020))`,
                    }}
                  >
                    <div className="absolute inset-0 dot-grid opacity-40" />
                    <BookOpen className="relative z-10 w-8 h-8 text-[var(--brand-primary)]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[var(--brand-primary)] text-sm mb-4">{product.tagline}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Pages", value: product.pages },
                      { label: "Chapters", value: product.chapters },
                      { label: "Format", value: product.format },
                      { label: "Updates", value: "Lifetime" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center glass rounded-xl p-2.5">
                        <p className="font-bold text-white text-sm">{stat.value}</p>
                        <p className="text-slate-500 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
                >
                  <User className="w-6 h-6" style={{ color: "#fff" }} />
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm">{section.author.name}</p>
                  <p className="text-[var(--brand-primary)] text-xs mb-3">{section.author.role}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{section.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Bonuses */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-4 h-4 text-amber-400" />
                <h4 className="font-heading font-bold text-white text-sm">{section.bonusHeading}</h4>
              </div>
              <ul className="space-y-2.5">
                {section.bonusItems.map((bonus) => (
                  <li key={bonus} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {bonus}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Table of contents */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="glass rounded-3xl p-8 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-heading font-bold text-white">{section.tocHeading}</h3>
              <span className="ml-auto text-xs text-slate-500">{product.chapters} chapters</span>
            </div>

            <div className="space-y-1">
              {section.tocItems.map((item, idx) => (
                <motion.div
                  key={item.chapter}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0 group hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors cursor-default"
                >
                  <span className="text-xs font-mono text-[var(--brand-primary)] w-8 flex-shrink-0 text-center">
                    {String(item.chapter).padStart(2, "0")}
                  </span>
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                    {item.title}
                  </span>
                </motion.div>
              ))}

              {/* More chapters hint */}
              <div className="flex items-center gap-4 py-3 px-2 -mx-2">
                <span className="text-xs font-mono text-slate-600 w-8 text-center">…</span>
                <span className="text-slate-600 text-sm italic">
                  {product.chapters - section.tocItems.length} more chapters inside
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
