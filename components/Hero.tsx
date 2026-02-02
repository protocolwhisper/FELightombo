"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
      {/* Center CTA */}
      <div className="text-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-terminal-green text-xl md:text-2xl tracking-[0.3em] uppercase mb-8 glitch-hover">
            LIGHTOMBO
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/login"
            className="inline-block border-2 border-terminal-green text-terminal-green px-12 py-4 text-lg tracking-[0.2em] uppercase hover:bg-terminal-green hover:text-black transition-all duration-300"
          >
            CLICK TO CONNECT
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-terminal-green/50 text-sm tracking-wider mt-8 max-w-md mx-auto"
        >
          the essential toolkit for every move developer
        </motion.p>
      </div>

      {/* Decorative +++ patterns */}
      <div className="absolute right-[20%] top-20 text-terminal-green/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[18%] top-40 text-terminal-green/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[22%] top-60 text-terminal-green/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[20%] bottom-40 text-terminal-green/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[18%] bottom-20 text-terminal-green/60 text-2xl tracking-widest">
        +++
      </div>
    </section>
  );
}
