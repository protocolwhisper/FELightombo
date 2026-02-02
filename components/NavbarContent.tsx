"use client";

import Link from 'next/link';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavbarContent() {
  const { account, connected, disconnect } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  const shortenAddress = (address?: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      {/* Top left brand */}
      <div className="fixed top-4 left-6 z-50">
        <Link href="/" className="text-terminal-green font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
          LIGHTOMBO
        </Link>
      </div>

      {/* Vertical sidebar left */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-16 bg-terminal-green/30" />
        <span className="text-terminal-green text-xs tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          W.
        </span>
        <div className="w-px h-16 bg-terminal-green/30" />
        <span className="text-terminal-green/60 text-xs tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Honors
        </span>
        <div className="w-px h-24 bg-terminal-green/30" />
      </div>

      {/* Menu button - top right */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 right-6 z-50 bg-terminal-green text-black px-4 py-2 text-sm font-bold hover:bg-terminal-green/80 transition-colors"
      >
        {menuOpen ? '×' : 'MENU'}
      </button>

      {/* Dropdown menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-6 z-50 bg-terminal-green text-black p-6 min-w-[200px]"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-2 right-2 text-black/60 hover:text-black text-xl"
            >
              ×
            </button>
            
            <nav className="flex flex-col gap-2 text-sm font-bold mb-6">
              <Link href="/#products" onClick={() => setMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                PRODUCTS
              </Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                DASHBOARD
              </Link>
              <Link href="#" onClick={() => setMenuOpen(false)} className="hover:opacity-60 transition-opacity">
                DOCS
              </Link>
              <Link href="#" onClick={() => setMenuOpen(false)} className="opacity-60">
                LABS
              </Link>
            </nav>

            <div className="border-t border-black/20 pt-4">
              {connected ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-mono opacity-60">
                    {shortenAddress(account?.address.toString())}
                  </span>
                  <button
                    onClick={() => { disconnect(); setMenuOpen(false); }}
                    className="text-xs font-bold hover:opacity-60 text-left"
                  >
                    DISCONNECT →
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setMenuOpen(false)}
                  className="text-xs font-bold hover:opacity-60"
                >
                  CONNECT →
                </Link>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-black/20">
              <span className="text-xs opacity-60 mr-4">socials →</span>
              <span className="text-xs font-bold">TW</span>
              <span className="text-xs mx-2 opacity-40">|</span>
              <span className="text-xs font-bold">GH</span>
              <span className="text-xs mx-2 opacity-40">|</span>
              <span className="text-xs font-bold">DC</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
