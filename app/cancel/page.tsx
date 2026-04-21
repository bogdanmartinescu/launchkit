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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-4 h-4 text-white" />
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
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold rounded-xl border-0 shadow-lg shadow-indigo-500/25 w-full sm:w-auto">
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
