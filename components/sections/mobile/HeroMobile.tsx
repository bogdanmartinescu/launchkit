"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { StoreBadgesRow } from "@/components/ui/StoreBadges";

/**
 * Split hero for the `mobile-app` template: copy + store badges on the left,
 * phone mockup on the right. Falls back to a gradient-filled phone frame with
 * the product name when no `brand.productImageUrl` is provided.
 */
export function HeroMobile() {
  const hero = siteConfig.sections.hero;
  const { product, app, brand } = siteConfig;

  if (!hero.enabled) return null;

  const avgRating =
    (app.iosRating + app.androidRating) / (app.iosRating && app.androidRating ? 2 : 1) ||
    app.iosRating ||
    app.androidRating;
  const totalReviews = app.iosReviewCount + app.androidReviewCount;

  return (
    <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 -left-40 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `color-mix(in srgb, var(--brand-primary) 18%, transparent)` }}
        />
        <div
          className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: `color-mix(in srgb, var(--brand-accent) 15%, transparent)` }}
        />
      </div>
      <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-7"
          >
            {hero.eyebrow && (
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
                style={{
                  background: `color-mix(in srgb, var(--brand-primary) 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--brand-primary) 20%, transparent)`,
                  color: `var(--brand-primary)`,
                }}
              >
                {hero.eyebrow}
              </span>
            )}

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-page">
              {hero.headline}
              {hero.headlineAccent && (
                <>
                  {" "}
                  <span className="gradient-text">{hero.headlineAccent}</span>
                </>
              )}
            </h1>

            {hero.subheadline && (
              <p className="text-lg lg:text-xl text-page-muted leading-relaxed max-w-xl">
                {hero.subheadline}
              </p>
            )}

            {/* Store badges */}
            <StoreBadgesRow
              appStoreUrl={app.appStoreUrl}
              playStoreUrl={app.playStoreUrl}
              className="pt-2"
            />

            {/* Rating + downloads trust line */}
            {(avgRating > 0 || app.downloads) && (
              <div className="flex flex-wrap items-center gap-5 pt-3">
                {avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          fill={i < Math.round(avgRating) ? "#f59e0b" : "transparent"}
                          stroke="#f59e0b"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-page">
                      {avgRating.toFixed(1)}
                    </span>
                    {totalReviews > 0 && (
                      <span className="text-sm text-page-muted">
                        ({totalReviews.toLocaleString()} reviews)
                      </span>
                    )}
                  </div>
                )}
                {app.downloads && (
                  <>
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: "var(--page-text-muted)" }}
                    />
                    <span className="text-sm text-page-muted">
                      <span className="font-semibold text-page">{app.downloads}</span> downloads
                    </span>
                  </>
                )}
                {app.category && (
                  <>
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: "var(--page-text-muted)" }}
                    />
                    <span className="text-sm text-page-muted">{app.category}</span>
                  </>
                )}
              </div>
            )}

            {hero.trustLine && (
              <p className="text-sm text-page-muted">{hero.trustLine}</p>
            )}
          </motion.div>

          {/* Right: phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative flex justify-center"
          >
            <PhoneFrame imageUrl={hero.image.url || brand.productImageUrl} alt={hero.image.alt || product.name} productName={product.name} appIconUrl={app.appIconUrl} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Portable phone mockup used across the mobile-app template. Fills with the
 * provided `imageUrl`; falls back to a branded gradient + app name when empty.
 */
export function PhoneFrame({
  imageUrl,
  alt,
  productName,
  appIconUrl,
  className,
}: {
  imageUrl?: string;
  alt?: string;
  productName?: string;
  appIconUrl?: string;
  className?: string;
}) {
  const hasImage = Boolean(imageUrl);
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{
        width: "min(320px, 100%)",
        filter: `drop-shadow(0 40px 60px color-mix(in srgb, var(--brand-primary) 25%, rgba(0,0,0,0.35)))`,
      }}
    >
      {/* Frame */}
      <div
        className="relative rounded-[3rem] p-[10px]"
        style={{
          background:
            "linear-gradient(160deg, #1f2937 0%, #0b1020 60%, #1f2937 100%)",
          boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.06)",
          aspectRatio: "9 / 19.5",
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full h-full rounded-[2.4rem] overflow-hidden"
          style={{
            background: hasImage
              ? "#000"
              : `linear-gradient(160deg, var(--brand-primary), var(--brand-accent))`,
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-20"
            style={{ background: "#0b1020" }}
          />

          {hasImage ? (
            <Image
              src={imageUrl!}
              alt={alt || productName || "App screenshot"}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              {appIconUrl ? (
                <Image
                  src={appIconUrl}
                  alt={productName || "App icon"}
                  width={96}
                  height={96}
                  className="rounded-3xl shadow-2xl mb-5"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-3xl mb-5 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-2xl"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {(productName ?? "App").charAt(0).toUpperCase()}
                </div>
              )}
              <p className="text-white font-heading font-bold text-2xl leading-tight drop-shadow-lg">
                {productName}
              </p>
              <p className="text-white/80 text-sm mt-1.5 drop-shadow">Tap to explore</p>
            </div>
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
