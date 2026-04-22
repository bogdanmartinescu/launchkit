import Link from "next/link";
import { XCircle, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Payment Cancelled",
};

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-40" />

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
              boxShadow: `0 6px 16px color-mix(in srgb, var(--brand-primary) 30%, transparent)`,
            }}
          >
            <BookOpen className="w-4 h-4" style={{ color: "#fff" }} />
          </div>
          <span className="font-heading font-bold text-white text-lg">{siteConfig.brand.name}</span>
        </Link>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-slate-700/30 border border-slate-600/30 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-slate-400" />
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <h1 className="font-heading text-3xl font-bold text-white">Payment Cancelled</h1>
          <p className="text-slate-400 text-lg">
            No worries — your cart is saved. Head back to complete your purchase whenever you&apos;re
            ready.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/#pricing">
            <Button
              className="text-white font-bold rounded-xl border-0 shadow-lg w-full sm:w-auto hover:opacity-95"
              style={{
                background: `linear-gradient(135deg, var(--brand-primary), var(--brand-accent))`,
                boxShadow: `0 10px 24px color-mix(in srgb, var(--brand-primary) 25%, transparent)`,
              }}
            >
              Try again
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white rounded-xl w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
