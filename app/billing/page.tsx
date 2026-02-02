"use client";

import Footer from "@/components/Footer";
import ClientNavbar from "@/components/ClientNavbar";
import AsciiBackground from "@/components/AsciiBackground";
import FloatingBlocks from "@/components/FloatingBlocks";
import { motion } from "framer-motion";

export default function Billing() {
  const tiers = [
    {
      name: "Free",
      tagline: "Hack & build",
      price: "$0",
      features: [
        "1 project",
        "1 active stream",
        "small monthly quota (events or GB)",
        "community support",
        'watermark: "best effort"'
      ]
    },
    {
      name: "Builder",
      tagline: "Projects",
      price: "$49/mo",
      features: [
        "up to 3 projects",
        "up to 10 active streams",
        "larger quota + paid overages",
        "retries + basic delivery reports"
      ]
    },
    {
      name: "Team",
      tagline: "Serious apps",
      price: "$199/mo",
      features: [
        "10–20 projects",
        "50+ streams",
        "longer retention (24h/7d)",
        "priority support",
        "higher throughput + more destinations"
      ]
    },
    {
      name: "Protocol",
      tagline: "Infra",
      price: "from $1,500–$5,000/mo",
      features: [
        "dedicated capacity / higher limits",
        "99.x uptime target + SLA",
        "custom decoders (your DEX, your events)",
        "incident support channel",
        "optional private deployment / region pinning"
      ]
    },
    {
      name: "Enterprise",
      tagline: "Custom",
      price: "custom",
      features: [
        "multi-region, dedicated clusters",
        "compliance needs",
        "custom ingestion/export"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-accent-yellow scanline">
      <AsciiBackground />
      <FloatingBlocks />
      <ClientNavbar />
      
      <main className="relative z-20 pb-20 pt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="text-accent-yellow text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Proposed LightTombo tiers
            </h1>
          </motion.div>

          <div className="space-y-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-accent-yellow/30 bg-black/50 backdrop-blur-sm p-6 hover:border-accent-yellow/60 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-accent-yellow text-xl font-bold">
                        {tier.name}
                      </h2>
                      <span className="text-accent-yellow/40 text-sm">
                        — "{tier.tagline}"
                      </span>
                    </div>
                  </div>
                  <div className="text-accent-yellow text-lg font-bold">
                    {tier.price}
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="text-accent-yellow/70 text-sm flex items-start gap-2"
                    >
                      <span className="text-accent-yellow/40 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
