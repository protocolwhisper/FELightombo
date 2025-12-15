"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-black text-white py-16 px-6 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-movement-yellow/50 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-start">
          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <h4 className="font-bold mb-6 text-white text-sm tracking-wider uppercase">Products</h4>
            <ul className="space-y-3 text-sm list-none p-0 m-0">
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  API Access
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  No Code Indexing
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Gas Station
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  NFT Studio
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <h4 className="font-bold mb-6 text-white text-sm tracking-wider uppercase">Resources</h4>
            <ul className="space-y-3 text-sm list-none p-0 m-0">
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Documentation
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Blog
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Community
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Help Center
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col"
          >
            <h4 className="font-bold mb-6 text-white text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-3 text-sm list-none p-0 m-0">
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  About
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Careers
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Contact
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-movement-yellow transition-colors inline-block group">
                  Privacy Policy
                  <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 Lightombo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-movement-yellow transition-colors">Terms</Link>
              <Link href="#" className="hover:text-movement-yellow transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-movement-yellow transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-movement-yellow/5 to-transparent pointer-events-none" />
    </footer>
  );
}
