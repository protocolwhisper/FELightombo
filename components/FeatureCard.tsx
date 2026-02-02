"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  linkText: string;
}

export default function FeatureCard({ title, description, features, linkText }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative group"
    >
      {/* Terminal-style card */}
      <div className="border-2 border-accent-yellow/50 bg-[#1a1400]/90 backdrop-blur-sm p-0 overflow-hidden hover:border-accent-yellow transition-colors">
        {/* Header bar */}
        <div className="border-b-2 border-accent-yellow/50 bg-accent-yellow/10 px-4 py-3 flex items-center justify-between">
          <span className="text-accent-yellow text-sm tracking-wider font-bold">// {title.toLowerCase().replace(' ', '_')}</span>
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-accent-yellow/40" />
            <span className="w-2 h-2 bg-accent-yellow/60" />
            <span className="w-2 h-2 bg-accent-yellow" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-[#120e00]">
          <motion.h3 
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-accent-yellow text-2xl font-bold tracking-tight mb-4"
          >
            {title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-accent-yellow/80 text-sm leading-relaxed mb-6"
          >
            {description}
          </motion.p>

          <div className="space-y-4 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex gap-3"
              >
                <span className="text-accent-yellow text-xs mt-1">+</span>
                <div className="flex-1">
                  <span className="text-accent-yellow text-sm font-semibold">{feature.split(':')[0]}:</span>
                  <span className="text-accent-yellow/70 text-sm">{feature.split(':')[1]}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="inline-flex items-center gap-2 text-accent-yellow text-sm font-semibold hover:text-accent-yellow/70 transition-colors group/link underline underline-offset-4"
          >
            <span>{linkText}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              →
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
