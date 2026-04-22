"use client";

import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Testimonials() {
  const section = siteConfig.sections.testimonials;
  if (!section.enabled || section.items.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 lg:py-32 relative">
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
          <span className="inline-block px-3 py-1.5 rounded-full bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/20 text-[var(--brand-accent)] text-xs font-semibold tracking-wide uppercase mb-4">
            {section.eyebrow}
          </span>
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

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {section.items.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-6 flex flex-col gap-5 hover:border-[var(--brand-primary)]/30 transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-300 text-sm leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Metric highlight */}
              <div className="px-3 py-2 rounded-lg bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20">
                <span className="text-[var(--brand-primary)] text-xs font-bold">{testimonial.metric}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))` }}
                >
                  <User className="w-5 h-5" style={{ color: "#fff" }} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
