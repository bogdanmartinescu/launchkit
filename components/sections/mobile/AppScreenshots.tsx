"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

/**
 * Horizontally-scrolling gallery of phone screenshots. Renders branded
 * gradient placeholders when an item has no `url` so the section still looks
 * polished in a fresh-cloned template.
 */
export function AppScreenshots() {
  const section = siteConfig.sections.appScreenshots;
  if (!section.enabled || section.items.length === 0) return null;

  return (
    <section id="screenshots" className="py-24 lg:py-32 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
        style={{
          background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--brand-accent) 30%, transparent), transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          {section.eyebrow && (
            <span
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
              style={{
                background: `color-mix(in srgb, var(--brand-accent) 10%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-accent) 20%, transparent)`,
                color: `var(--brand-accent)`,
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
      </div>

      {/* Scroll row — bleeds off the page edges for a cinematic feel */}
      <div className="relative">
        <div
          className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--page-bg), transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--page-bg), transparent)" }}
        />

        <div className="overflow-x-auto scroll-smooth pb-6">
          <div className="flex items-center gap-6 lg:gap-8 px-6 lg:px-16 w-max">
            {section.items.map((shot, idx) => (
              <motion.figure
                key={`${shot.url}-${idx}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 flex flex-col items-center gap-3"
                style={{ width: "min(220px, 60vw)" }}
              >
                <PhoneShot url={shot.url} alt={shot.alt} index={idx} />
                {shot.caption && (
                  <figcaption className="text-xs text-page-muted text-center max-w-[200px]">
                    {shot.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneShot({
  url,
  alt,
  index,
}: {
  url: string;
  alt: string;
  index: number;
}) {
  const hasImage = Boolean(url);
  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio: "9 / 19.5",
        filter: `drop-shadow(0 24px 48px color-mix(in srgb, var(--brand-primary) 22%, rgba(0,0,0,0.3)))`,
      }}
    >
      <div
        className="absolute inset-0 rounded-[2.2rem] p-[8px]"
        style={{
          background: "linear-gradient(160deg, #1f2937 0%, #0b1020 60%, #1f2937 100%)",
          boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="relative w-full h-full rounded-[1.8rem] overflow-hidden"
          style={{
            background: hasImage
              ? "#000"
              : `linear-gradient(${135 + index * 20}deg, color-mix(in srgb, var(--brand-primary) 85%, #000), color-mix(in srgb, var(--brand-accent) 85%, #000))`,
          }}
        >
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full z-20"
            style={{ background: "#0b1020" }}
          />
          {hasImage ? (
            <Image
              src={url}
              alt={alt || "App screenshot"}
              fill
              sizes="(max-width: 768px) 60vw, 220px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/90 font-heading font-bold text-3xl drop-shadow-lg">
                {index + 1}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
