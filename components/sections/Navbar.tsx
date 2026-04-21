"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const logoUrl = siteConfig.brand.logoUrl;
  const ctaPrice = siteConfig.product.price;
  const ctaLabel =
    siteConfig.templateType === "email-collection"
      ? "Join Free"
      : siteConfig.templateType === "saas"
      ? "Start Free Trial"
      : `Buy Now — $${ctaPrice}`;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-blur-xl border-b shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
      style={
        isScrolled
          ? { backgroundColor: "var(--page-bg-nav)", borderColor: "var(--page-border)" }
          : undefined
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteConfig.brand.name}
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary,#6366f1)] to-[var(--brand-accent,#8b5cf6)] flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-heading font-bold text-page text-lg tracking-tight">
                  {siteConfig.brand.name}
                </span>
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.nav.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-2 text-sm font-medium text-page-muted hover:text-page transition-colors rounded-lg hover:bg-black/[0.06] dark:hover:bg-white/[0.06] cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {siteConfig.templateType !== "email-collection" && (
              <button
                onClick={() => handleNavClick("#pricing")}
                className="text-sm font-medium text-page-muted hover:text-page transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
            <Button
              onClick={() => handleNavClick("#pricing")}
              className="bg-gradient-to-r from-[var(--brand-primary,#6366f1)] to-[var(--brand-accent,#8b5cf6)] hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 border-0 cursor-pointer"
            >
              {ctaLabel}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-page-muted hover:text-page hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden backdrop-blur-xl border-b"
          style={{
            backgroundColor: "var(--page-bg-mobile)",
            borderColor: "var(--page-border)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="w-full text-left px-4 py-3 text-sm font-medium text-page-muted hover:text-page hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t mt-2" style={{ borderColor: "var(--page-border)" }}>
              <Button
                onClick={() => handleNavClick("#pricing")}
                className="w-full bg-gradient-to-r from-[var(--brand-primary,#6366f1)] to-[var(--brand-accent,#8b5cf6)] hover:opacity-90 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 border-0"
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
