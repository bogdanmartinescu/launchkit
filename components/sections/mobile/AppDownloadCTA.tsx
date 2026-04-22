"use client";

import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { StoreBadgesRow } from "@/components/ui/StoreBadges";

/**
 * Prominent mid-page call-to-action that repeats the store download action
 * with platform ratings and total downloads next to the badges.
 */
export function AppDownloadCTA() {
  const section = siteConfig.sections.appDownload;
  const { app } = siteConfig;

  if (!section.enabled) return null;

  const anyRating = app.iosRating > 0 || app.androidRating > 0;

  return (
    <section id="download" className="py-24 lg:py-32 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
        style={{
          background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--brand-primary) 30%, transparent), transparent)`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 8%, transparent), transparent 50%, color-mix(in srgb, var(--brand-accent) 8%, transparent))`,
        }}
      />
      <div className="dot-grid absolute inset-0 opacity-30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-8 lg:p-12 text-center space-y-7"
        >
          {section.eyebrow && (
            <span
              className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                background: `color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)`,
                color: `var(--brand-primary)`,
              }}
            >
              {section.eyebrow}
            </span>
          )}

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-page leading-tight">
            {section.heading}
            {section.headingAccent && (
              <>
                {" "}
                <span className="gradient-text">{section.headingAccent}</span>
              </>
            )}
          </h2>

          {section.subheading && (
            <p className="text-lg text-page-muted max-w-2xl mx-auto leading-relaxed">
              {section.subheading}
            </p>
          )}

          {/* Badges */}
          <div className="flex justify-center pt-2">
            <StoreBadgesRow
              appStoreUrl={app.appStoreUrl}
              playStoreUrl={app.playStoreUrl}
            />
          </div>

          {/* Stats strip */}
          {(section.showRatings && anyRating) || (section.showDownloads && app.downloads) ? (
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-5">
              {section.showRatings && app.iosRating > 0 && (
                <StatItem
                  icon={<Star className="w-4 h-4" fill="#f59e0b" stroke="#f59e0b" />}
                  value={app.iosRating.toFixed(1)}
                  label={`iOS${app.iosReviewCount ? ` · ${formatReviews(app.iosReviewCount)}` : ""}`}
                />
              )}
              {section.showRatings && app.androidRating > 0 && (
                <StatItem
                  icon={<Star className="w-4 h-4" fill="#f59e0b" stroke="#f59e0b" />}
                  value={app.androidRating.toFixed(1)}
                  label={`Android${app.androidReviewCount ? ` · ${formatReviews(app.androidReviewCount)}` : ""}`}
                />
              )}
              {section.showDownloads && app.downloads && (
                <StatItem
                  icon={<Users className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />}
                  value={app.downloads}
                  label="downloads"
                />
              )}
            </div>
          ) : null}

          {section.trustLine && (
            <p className="text-sm text-page-muted pt-2">{section.trustLine}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading font-bold text-page text-lg">{value}</span>
        <span className="text-xs text-page-muted uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}

function formatReviews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M reviews`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}k reviews`;
  return `${count} reviews`;
}
