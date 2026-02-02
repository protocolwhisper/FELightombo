"use client";

import { motion } from "framer-motion";

const blocks = [
  { size: 60, x: "5%", y: "15%", delay: 0 },
  { size: 40, x: "12%", y: "45%", delay: 0.2 },
  { size: 80, x: "8%", y: "75%", delay: 0.4 },
  { size: 50, x: "85%", y: "20%", delay: 0.1 },
  { size: 70, x: "90%", y: "50%", delay: 0.3 },
  { size: 45, x: "88%", y: "80%", delay: 0.5 },
  { size: 35, x: "75%", y: "35%", delay: 0.15 },
  { size: 55, x: "20%", y: "25%", delay: 0.25 },
];

export default function FloatingBlocks() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          className="absolute bg-accent-yellow/80"
          style={{
            width: block.size,
            height: block.size,
            left: block.x,
            top: block.y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.6, 0.8, 0.6],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: block.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
