import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${siteConfig.product.name} — ${siteConfig.product.tagline}`,
  description: siteConfig.product.description,
  openGraph: {
    title: siteConfig.product.name,
    description: siteConfig.product.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.product.name,
    description: siteConfig.product.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { primaryColor, accentColor } = siteConfig.brand;
  const themeClass = siteConfig.theme === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full ${themeClass}`}
    >
      <head>
        {/* Inject brand + theme CSS custom properties — update via /setup wizard */}
        <style>{`
          :root {
            --brand-primary: ${primaryColor};
            --brand-accent: ${accentColor};
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
