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
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-accent-yellow font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            LIGHTOMBO
          </Link>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-accent-yellow text-black px-4 py-1.5 text-sm font-bold hover:bg-accent-yellow/80 transition-colors"
          >
            {menuOpen ? '×' : 'MENU'}
          </button>
        </div>
      </div>


      {/* Dropdown menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 right-6 z-50 bg-accent-yellow text-black p-6 min-w-[200px]"
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
