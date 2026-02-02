"use client";

import { useState, useEffect } from "react";

export default function WanderingDog() {
  const [frame, setFrame] = useState(0);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const COLS = 2;
  const ROWS = 6;
  const FRAME_WIDTH = 32;
  const FRAME_HEIGHT = 32;
  const TOTAL_FRAMES = 12;

  // Process image to remove background and recolor to yellow theme
  useEffect(() => {
    const img = new Image();
    img.src = "/image.jpg";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Target the slate grey background: ~RGB(107, 115, 128)
      const targetR = 107;
      const targetG = 115;
      const targetB = 128;
      const tolerance = 40;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate color distance from background
        const distance = Math.sqrt(
          Math.pow(r - targetR, 2) + 
          Math.pow(g - targetG, 2) + 
          Math.pow(b - targetB, 2)
        );
        
        // If close to background color, make transparent
        if (distance < tolerance) {
          data[i + 3] = 0;
        } else {
          // Recolor the dog to yellow/gold theme
          const gray = (r + g + b) / 3;
          
          if (gray < 60) {
            // Dark pixels (outlines) - keep dark/black
            data[i] = 10;
            data[i + 1] = 10;
            data[i + 2] = 10;
          } else if (gray > 200) {
            // White pixels - make yellow
            data[i] = 255;
            data[i + 1] = 195;
            data[i + 2] = 0;
          } else if (r > 150 && g > 100 && b < 120) {
            // Brown pixels - make darker gold
            data[i] = 200;
            data[i + 1] = 150;
            data[i + 2] = 0;
          } else {
            // Other pixels - make gold tinted
            data[i] = Math.min(255, gray * 1.2);
            data[i + 1] = Math.min(255, gray * 0.9);
            data[i + 2] = 0;
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL("image/png"));
    };
  }, []);

  // Smooth sprite animation using requestAnimationFrame
  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;
    const frameDelay = 120; // Faster animation for jumping

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameDelay) {
        setFrame(f => (f + 1) % TOTAL_FRAMES);
        lastTime = currentTime;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const col = frame % COLS;
  const row = Math.floor(frame / COLS);
  const bgX = -col * FRAME_WIDTH;
  const bgY = -row * FRAME_HEIGHT;

  if (!processedImage) return null;

  return (
    <div
      className="pointer-events-none"
      style={{
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        backgroundImage: `url(${processedImage})`,
        backgroundPosition: `${bgX}px ${bgY}px`,
        backgroundSize: `${COLS * FRAME_WIDTH}px ${ROWS * FRAME_HEIGHT}px`,
        imageRendering: 'pixelated',
        animation: 'jumpBetween 6s ease-in-out infinite',
      }}
    />
  );
}
