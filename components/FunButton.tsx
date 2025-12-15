"use client";

import { motion } from "framer-motion";

export default function FunButton() {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        rotate: [0, -2, 2, -2, 2, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ 
        scale: 0.95,
        rotate: [0, 5, -5, 0]
      }}
      animate={{
        boxShadow: [
          "0 0 20px rgba(250, 255, 0, 0.3)",
          "0 0 40px rgba(250, 255, 0, 0.6)",
          "0 0 20px rgba(250, 255, 0, 0.3)"
        ]
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="relative bg-movement-yellow text-black px-10 py-4 rounded-md font-bold text-xl hover:bg-yellow-400 transition-colors overflow-hidden group"
    >
      <motion.span
        className="relative z-10 inline-block"
        animate={{
          x: [0, 2, -2, 2, -2, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Start Building
      </motion.span>
      
      {/* Animated background shine */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "200%"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.button>
  );
}

