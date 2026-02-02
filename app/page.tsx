"use client";

import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import ClientNavbar from "@/components/ClientNavbar";
import AsciiBackground from "@/components/AsciiBackground";
import FloatingBlocks from "@/components/FloatingBlocks";
import { motion } from "framer-motion";

export default function Home() {
  const products = [
    {
      title: "API Access",
      description: "Harness the power of Lightombo without the hassle of managing blockchain infrastructure.",
      linkText: "Learn How API Access Works",
      features: [
        "Versatile Access: Generate API keys tailored to various development needs across different networks.",
        "Effortless Integration: Write transactions and retrieve MoveVM data without managing nodes.",
        "Real-Time Insights: Monitor and analyze transaction data with comprehensive metrics."
      ]
    },
    {
      title: "No Code Indexing",
      description: "Build your product, not infra. Access on-chain data instantly and focus on the fun stuff.",
      linkText: "Learn How No Code Indexing Works",
      features: [
        "Instant Data Access: Quickly pull in blockchain data without complex indexing logic.",
        "Web-based Configuration: Easily set up and customize your indexing API using a straightforward web UI.",
        "Managed Infrastructure: Get real-time blockchain data updates with zero maintenance."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-accent-yellow scanline">
      <AsciiBackground />
      <FloatingBlocks />
      <ClientNavbar />
      
      <main className="relative z-20 pb-20 pt-16">
        <Hero />
        
        {/* Products Section */}
        <section id="products" className="px-6 py-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="text-accent-yellow/40 text-sm tracking-[0.3em] uppercase">// PRODUCTS</span>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <FeatureCard 
                key={index}
                title={product.title}
                description={product.description}
                features={product.features}
                linkText={product.linkText}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-accent-yellow text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Build without <span className="opacity-60">frontiers</span>
            </h2>
            <p className="text-accent-yellow/40 text-sm max-w-xl mx-auto">
              Lightombo gives you the tools to build anything, anywhere, without limits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time streams",
                description: "Listen to the Movement blockchain as transactions are processed. Get instant access to transaction data."
              },
              {
                title: "Labs-hosted infra",
                description: "Skip the complexity of running your own nodes. Access our production-ready transaction stream API."
              },
              {
                title: "Self-deploy",
                description: "Need full control? Deploy the transaction stream service yourself with our open-source implementation."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-accent-yellow/20 p-6 hover:border-accent-yellow/40 transition-colors bg-black/30"
              >
                <div className="text-accent-yellow/40 text-xs mb-3">0{index + 1}</div>
                <h3 className="text-accent-yellow text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-accent-yellow/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-accent-yellow text-2xl md:text-4xl font-bold tracking-tight mb-8">
              What will you build?
            </h2>
            <a
              href="/dashboard"
              className="inline-block border border-accent-yellow text-accent-yellow px-8 py-3 text-sm tracking-widest uppercase hover:bg-accent-yellow hover:text-black transition-all duration-300"
            >
              START BUILDING →
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
