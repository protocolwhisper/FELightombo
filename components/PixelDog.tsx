"use client";

import { motion } from "framer-motion";

export default function PixelDog() {
  // 8-bit pitbull pixel art (simplified)
  const pixels = [
    // Row 1 - ears
    [0,0,1,1,0,0,0,1,1,0,0],
    // Row 2
    [0,1,1,1,1,1,1,1,1,1,0],
    // Row 3 - head
    [1,1,1,1,1,1,1,1,1,1,1],
    // Row 4 - eyes
    [1,0,1,1,1,1,1,1,1,0,1],
    // Row 5
    [1,1,1,1,1,1,1,1,1,1,1],
    // Row 6 - nose
    [0,1,1,1,0,1,0,1,1,1,0],
    // Row 7 - mouth
    [0,0,1,1,1,1,1,1,1,0,0],
    // Row 8 - body
    [0,0,0,1,1,1,1,1,0,0,0],
  ];

  return (
    <motion.div 
      className="flex flex-col gap-[1px]"
      animate={{ 
        y: [0, -3, 0],
        rotate: [0, -2, 0, 2, 0]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {pixels.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[1px]">
          {row.map((pixel, colIndex) => (
            <div
              key={colIndex}
              className={`w-[3px] h-[3px] ${pixel ? 'bg-accent-yellow' : 'bg-transparent'}`}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
}
