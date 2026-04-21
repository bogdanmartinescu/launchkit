"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-8 px-6">
    <span className="text-slate-500 font-semibold text-sm tracking-widest uppercase whitespace-nowrap">
      {name}
    </span>
  </div>
);

export function TrustedBy() {
  const logos = [...siteConfig.clients, ...siteConfig.clients];

  return (
    <section className="py-16 border-y border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold tracking-widest text-slate-500 uppercase mb-10"
        >
          As seen in &amp; read by founders at
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Left/right fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0f1e] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0f1e] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee w-max">
          {logos.map((client, i) => (
            <LogoPlaceholder key={`${client.name}-${i}`} name={client.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
