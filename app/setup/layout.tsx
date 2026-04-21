import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup — Configure Your Landing Page",
  description: "Configure your landing page template in a few steps.",
};

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {children}
    </div>
  );
}
