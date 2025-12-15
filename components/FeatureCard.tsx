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
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden group"
    >
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-0 overflow-hidden">
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-movement-yellow/0 via-movement-yellow/20 to-movement-yellow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content Sections */}
        <div className="relative z-10">
          {/* First Section - Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 border-b border-gray-800/50"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-3xl font-bold text-white tracking-tight">{title}</h3>
              <div className="w-3 h-3 rounded-full bg-movement-yellow/60 group-hover:bg-movement-yellow transition-colors shadow-[0_0_10px_rgba(250,255,0,0.5)]" />
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
          </motion.div>

          {/* Second Section - Features (appears on scroll) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-8"
          >
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-movement-yellow mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1.5">{feature.split(':')[0]}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.split(':')[1]}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="inline-flex items-center gap-2 text-movement-yellow font-semibold hover:text-yellow-300 transition-colors group/link"
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
          </motion.div>
        </div>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_white,_transparent)] pointer-events-none" />
      </div>
    </motion.div>
  );
}
