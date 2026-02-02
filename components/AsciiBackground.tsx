"use client";

import { useEffect, useRef } from "react";

const ASCII_CHARS = ['/', '\\', '-', '_', '|', '+', '=', '*', '.', ':', ';', ',', '^', '~', '"', "'", '`'];
const SPECIAL_PATTERNS = ['+++', '---', '===', '|||', '...', '^^^', '###'];

interface Particle {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  targetOpacity: number;
}

export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      const density = Math.floor((canvas.width * canvas.height) / 8000);

      for (let i = 0; i < density; i++) {
        const usePattern = Math.random() > 0.85;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          char: usePattern 
            ? SPECIAL_PATTERNS[Math.floor(Math.random() * SPECIAL_PATTERNS.length)]
            : ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
          speed: 0.1 + Math.random() * 0.3,
          opacity: 0,
          targetOpacity: 0.1 + Math.random() * 0.4,
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "12px 'JetBrains Mono', 'Fira Code', monospace";

      particlesRef.current.forEach((particle) => {
        // Fade in/out
        if (particle.opacity < particle.targetOpacity) {
          particle.opacity += 0.005;
        }

        // Random flicker
        if (Math.random() > 0.995) {
          particle.targetOpacity = Math.random() > 0.5 ? 0.1 + Math.random() * 0.4 : 0;
        }

        // Slow drift
        particle.y += particle.speed * 0.2;
        particle.x += Math.sin(particle.y * 0.01) * 0.1;

        // Wrap around
        if (particle.y > canvas.height + 20) {
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }

        // Draw - yellow theme
        ctx.fillStyle = `rgba(255, 195, 0, ${particle.opacity})`;
        ctx.fillText(particle.char, particle.x, particle.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "#0a0a0a" }}
    />
  );
}
