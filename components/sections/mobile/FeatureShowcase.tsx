"use client";

import Image from "next/image";
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
  Target,
  Shield,
  TrendingUp,
  CheckCircle2,
  Fingerprint,
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
  Target,
  Shield,
  TrendingUp,
  CheckCircle2,
  Fingerprint,
};

/**
 * Alternating feature-with-screenshot showcase, inspired by the Finwise
 * landing page. Each row renders a big product screenshot on one side and a
 * narrative (title / description / sub-benefits) on the other. Rows alternate
 * sides; on mobile they collapse to a stacked layout with the image first.
 */
export function FeatureShowcase() {
  const section = siteConfig.sections.featureShowcase;
  if (!section.enabled || section.items.length === 0) return null;

  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
        style={{
          background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--brand-primary) 30%, transparent), transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        {(section.heading || section.subheading) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 lg:mb-24"
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
            {section.heading && (
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-page mb-4 leading-tight">
                {section.heading}
                {section.headingAccent && (
                  <>
                    {" "}
                    <span className="gradient-text">{section.headingAccent}</span>
                  </>
                )}
              </h2>
            )}
            {section.subheading && (
              <p className="text-lg text-page-muted leading-relaxed">{section.subheading}</p>
            )}
          </motion.div>
        )}

        {/* Alternating rows */}
        <div className="space-y-24 lg:space-y-32">
          {section.items.map((item, idx) => {
            const imageOnRight = idx % 2 === 0;
            return (
              <div
                key={`${item.title}-${idx}`}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  imageOnRight ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                {/* Text side */}
                <motion.div
                  initial={{ opacity: 0, x: imageOnRight ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {item.eyebrow && (
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase"
                      style={{
                        background: `color-mix(in srgb, var(--brand-accent) 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, var(--brand-accent) 20%, transparent)`,
                        color: `var(--brand-accent)`,
                      }}
                    >
                      {item.eyebrow}
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-page text-2xl sm:text-3xl lg:text-4xl leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-page-muted text-base lg:text-lg leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Sub-benefits */}
                  {item.items.length > 0 && (
                    <ul className="space-y-5 pt-2">
                      {item.items.map((sub) => {
                        const Icon = iconMap[sub.icon] ?? Sparkles;
                        return (
                          <li key={sub.title} className="flex gap-4">
                            <div
                              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                background: `color-mix(in srgb, var(--brand-primary) 12%, transparent)`,
                                border: `1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent)`,
                              }}
                            >
                              <Icon
                                className="w-5 h-5"
                                style={{ color: `var(--brand-primary)` }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-heading font-semibold text-page text-base mb-1">
                                {sub.title}
                              </h4>
                              {sub.body && (
                                <p className="text-page-muted text-sm leading-relaxed">
                                  {sub.body}
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </motion.div>

                {/* Screenshot side */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex justify-center"
                >
                  {item.inPhoneFrame ? (
                    <ShowcasePhone
                      imageUrl={item.image.url}
                      alt={item.image.alt || item.title}
                      index={idx}
                      label={item.title}
                    />
                  ) : (
                    <ShowcaseFlat
                      imageUrl={item.image.url}
                      alt={item.image.alt || item.title}
                      index={idx}
                      label={item.title}
                    />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Phone-framed screenshot — ideal for mobile app showcases. Falls back to a
 * branded gradient + label when no image URL is provided.
 */
function ShowcasePhone({
  imageUrl,
  alt,
  index,
  label,
}: {
  imageUrl: string;
  alt: string;
  index: number;
  label: string;
}) {
  const hasImage = Boolean(imageUrl);
  return (
    <div
      className="relative w-full"
      style={{
        maxWidth: "300px",
        aspectRatio: "9 / 19.5",
        filter: `drop-shadow(0 40px 60px color-mix(in srgb, var(--brand-primary) 22%, rgba(0,0,0,0.3)))`,
      }}
    >
      {/* Decorative glow behind the phone */}
      <div
        className="absolute -inset-10 rounded-full blur-3xl -z-10 opacity-60"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--brand-primary) 30%, transparent), transparent 70%)`,
        }}
      />

      <div
        className="absolute inset-0 rounded-[2.8rem] p-[9px]"
        style={{
          background: "linear-gradient(160deg, #1f2937 0%, #0b1020 60%, #1f2937 100%)",
          boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="relative w-full h-full rounded-[2.25rem] overflow-hidden"
          style={{
            background: hasImage
              ? "#000"
              : `linear-gradient(${135 + index * 25}deg, color-mix(in srgb, var(--brand-primary) 85%, #000), color-mix(in srgb, var(--brand-accent) 85%, #000))`,
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full z-20"
            style={{ background: "#0b1020" }}
          />

          {hasImage ? (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
            />
          ) : (
            <PhonePlaceholder index={index} label={label} />
          )}

          {/* Screen sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(150deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 70%, rgba(255,255,255,0.04) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Flat rounded screenshot — ideal for SaaS dashboards, web screenshots, or
 * any non-mobile product. Falls back to a branded gradient placeholder.
 */
function ShowcaseFlat({
  imageUrl,
  alt,
  index,
  label,
}: {
  imageUrl: string;
  alt: string;
  index: number;
  label: string;
}) {
  const hasImage = Boolean(imageUrl);
  return (
    <div
      className="relative w-full max-w-xl"
      style={{
        filter: `drop-shadow(0 30px 60px color-mix(in srgb, var(--brand-primary) 20%, rgba(0,0,0,0.3)))`,
      }}
    >
      <div
        className="absolute -inset-6 rounded-3xl blur-3xl -z-10 opacity-50"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--brand-primary) 30%, transparent), transparent 70%)`,
        }}
      />
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          background: hasImage
            ? "#000"
            : `linear-gradient(${135 + index * 25}deg, color-mix(in srgb, var(--brand-primary) 85%, #000), color-mix(in srgb, var(--brand-accent) 85%, #000))`,
          border: "1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)",
        }}
      >
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-white/90 font-heading font-bold text-xl drop-shadow">
              {label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PhonePlaceholder({ index, label }: { index: number; label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-white font-heading font-bold text-2xl shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        {index + 1}
      </div>
      <p className="text-white/95 font-heading font-bold text-lg leading-tight drop-shadow-lg">
        {label}
      </p>
      <p className="text-white/70 text-xs mt-1.5 drop-shadow">Add screenshot via /setup</p>
    </div>
  );
}
