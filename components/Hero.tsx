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
          <h1 className="text-accent-yellow text-xl md:text-2xl tracking-[0.3em] uppercase mb-8 glitch-hover">
            LIGHTOMBO
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/dashboard"
            className="inline-block border-2 border-accent-yellow text-accent-yellow px-12 py-4 text-lg tracking-[0.2em] uppercase hover:bg-accent-yellow hover:text-black transition-all duration-300"
          >
            GO TO APP
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-accent-yellow/50 text-sm tracking-wider mt-8 max-w-md mx-auto"
        >
          the essential toolkit for every <span className="text-accent-yellow font-bold underline decoration-2 underline-offset-4">move</span> developer
        </motion.p>
      </div>

      {/* Decorative +++ patterns */}
      <div className="absolute right-[20%] top-20 text-accent-yellow/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[18%] top-40 text-accent-yellow/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[22%] top-60 text-accent-yellow/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[20%] bottom-40 text-accent-yellow/60 text-2xl tracking-widest">
        +++
      </div>
      <div className="absolute right-[18%] bottom-20 text-accent-yellow/60 text-2xl tracking-widest">
        +++
      </div>
    </section>
  );
}
