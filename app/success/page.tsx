import Link from "next/link";
import { CheckCircle2, Download, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Purchase Complete — Thank You!",
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl" />
      </div>
      <div className="dot-grid absolute inset-0 opacity-40" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-white text-lg">{siteConfig.brand.name}</span>
        </Link>

        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            You&apos;re all set! 🎉
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Thank you for purchasing{" "}
            <span className="text-white font-semibold">{siteConfig.product.name}</span>. Your
            download link has been sent to your email.
          </p>
        </div>

        {/* Download card */}
        <div className="glass rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{siteConfig.product.name}</p>
              <p className="text-slate-500 text-xs">
                {siteConfig.product.format} · {siteConfig.product.pages} pages
              </p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            Check your inbox for the download link. If you don&apos;t see it within 5 minutes,
            check your spam folder or{" "}
            <a href="mailto:hello@launchkit.co" className="text-indigo-400 hover:text-indigo-300">
              contact us
            </a>
            .
          </p>
          <a
            href={siteConfig.leadMagnet.filePath}
            download
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download directly
          </a>
        </div>

        {siteConfig.preview?.bonusItems && siteConfig.preview.bonusItems.length > 0 && (
          <div className="glass rounded-2xl p-6 text-left">
            <p className="text-white font-semibold text-sm mb-3">Your bonuses are also included:</p>
            <ul className="space-y-2">
              {siteConfig.preview.bonusItems.map((bonus) => (
                <li key={bonus} className="flex items-center gap-2.5 text-slate-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {bonus}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/">
          <Button
            variant="outline"
            className="bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
