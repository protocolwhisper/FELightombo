"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginContent() {
  const { connect, connected, wallets, isLoading } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push("/dashboard");
    }
  }, [connected, router]);

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="text-accent-yellow text-6xl mb-6 font-bold tracking-[0.3em]">
          +++
        </div>
        <h1 className="text-accent-yellow text-2xl tracking-tight mb-4">
          // connect_wallet
        </h1>
        <p className="text-accent-yellow/50 text-sm">
          Link your Move wallet to access the transaction stream
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-2 border-accent-yellow/50 bg-[#1a1400]/90 backdrop-blur-sm"
      >
        {/* Header bar */}
        <div className="border-b-2 border-accent-yellow/50 bg-accent-yellow/10 px-4 py-3 flex items-center justify-between">
          <span className="text-accent-yellow text-sm tracking-wider font-bold">// select_wallet</span>
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-accent-yellow/40" />
            <span className="w-2 h-2 bg-accent-yellow/60" />
            <span className="w-2 h-2 bg-accent-yellow" />
          </div>
        </div>
        
        <div className="p-6 bg-[#120e00]">
          <div className="space-y-3">
            {wallets && wallets.length > 0 ? (
              wallets.map((wallet, index) => (
                <motion.button
                  key={wallet.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleConnect(wallet.name)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-4 px-6 py-4 border border-accent-yellow/20 hover:border-accent-yellow hover:bg-accent-yellow/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {wallet.icon && (
                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      className="w-8 h-8"
                    />
                  )}
                  <span className="flex-1 text-left text-accent-yellow/80 group-hover:text-accent-yellow">
                    {wallet.name}
                  </span>
                  <span className="text-accent-yellow/40 group-hover:text-accent-yellow transition-colors">
                    →
                  </span>
                </motion.button>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="text-4xl text-accent-yellow/40 mb-4">[ ]</div>
                  <p className="text-accent-yellow/60 mb-2">// no_wallets_detected</p>
                  <p className="text-sm text-accent-yellow/40">
                    Install a Move-compatible wallet to continue
                  </p>
                </div>
                
                <div className="space-y-3">
                  <a
                    href="https://petra.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 border border-accent-yellow/40 hover:bg-accent-yellow hover:text-black transition-all text-accent-yellow"
                  >
                    Install Petra Wallet →
                  </a>
                  <a
                    href="https://razorwallet.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 border border-accent-yellow/20 hover:border-accent-yellow/60 transition-colors text-accent-yellow/60"
                  >
                    Install Razor Wallet →
                  </a>
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-accent-yellow/60">
              <span className="animate-pulse">...</span>
              <span>connecting</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-accent-yellow/40">
          By connecting, you agree to our{" "}
          <a href="#" className="text-accent-yellow/60 hover:text-accent-yellow underline">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-accent-yellow/60 hover:text-accent-yellow underline">Privacy</a>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 border-2 border-accent-yellow/30 bg-[#1a1400]/50 p-6"
      >
        <h3 className="text-accent-yellow text-sm mb-4">
          + what_you_get
        </h3>
        <ul className="space-y-2 text-xs text-accent-yellow/60">
          <li className="flex items-start gap-2">
            <span className="text-accent-yellow">+</span>
            Real-time transaction event streaming
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-yellow">+</span>
            Decoded DEX swaps, transfers, mints, burns
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-yellow">+</span>
            Filter by any smart contract address
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-yellow">+</span>
            Free access with wallet signature
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
