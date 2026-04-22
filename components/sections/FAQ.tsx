"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/config";

export function FAQ() {
  const section = siteConfig.sections.faq;
  if (!section.enabled || section.items.length === 0) return null;

  return (
    <section id="faq" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <span className="inline-block px-3 py-1.5 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-semibold tracking-wide uppercase mb-4">
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
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {section.subheading}
              </p>
            )}
            {section.contactEmail && (
              <a
                href={`mailto:${section.contactEmail}`}
                className="inline-flex items-center gap-2 text-[var(--brand-primary)] hover:text-[var(--brand-accent)] font-semibold text-sm transition-colors"
              >
                {section.contactEmail}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Accordion multiple={false} className="space-y-3">
              {section.items.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="glass rounded-2xl px-6 border border-white/[0.06] overflow-hidden transition-all"
                >
                  <AccordionTrigger className="text-white font-semibold text-sm py-5 hover:no-underline hover:text-[var(--brand-primary)] text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-sm leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
