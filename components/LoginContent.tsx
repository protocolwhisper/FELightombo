"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="max-w-md mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <Image
            src="/tombo2.png"
            alt="Lightombo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Connect to <span className="text-movement-yellow">Lightombo</span>
        </h1>
        <p className="text-gray-400">
          Connect your Move wallet to access the transaction stream service.
        </p>
      </div>

      <div className="border border-gray-800 bg-gray-900/50 rounded-xl p-8">
        <h2 className="text-lg font-semibold mb-6 text-center">Choose your wallet</h2>
        
        <div className="space-y-3">
          {wallets && wallets.length > 0 ? (
            wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleConnect(wallet.name)}
                disabled={isLoading}
                className="w-full flex items-center gap-4 px-6 py-4 bg-black/50 border border-gray-700 rounded-lg hover:border-movement-yellow hover:bg-gray-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {wallet.icon && (
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="w-8 h-8 rounded-md"
                  />
                )}
                <span className="flex-1 text-left font-medium">{wallet.name}</span>
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-movement-yellow transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-2">No wallets detected</p>
                <p className="text-sm text-gray-500">
                  Install a Move-compatible wallet to continue
                </p>
              </div>
              
              <div className="space-y-3">
                <a
                  href="https://petra.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 bg-movement-yellow/10 border border-movement-yellow/30 rounded-lg hover:bg-movement-yellow/20 transition-colors text-movement-yellow font-medium"
                >
                  Install Petra Wallet
                </a>
                <a
                  href="https://pontem.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors text-gray-300"
                >
                  Install Pontem Wallet
                </a>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Connecting...</span>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          By connecting, you agree to our{" "}
          <a href="#" className="text-movement-yellow hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-movement-yellow hover:underline">Privacy Policy</a>
        </p>
      </div>

      <div className="mt-12 border border-gray-800 bg-gray-900/30 rounded-xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-movement-yellow">*</span>
          What you get
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-movement-yellow mt-0.5">-</span>
            Real-time transaction event streaming via WebSocket
          </li>
          <li className="flex items-start gap-2">
            <span className="text-movement-yellow mt-0.5">-</span>
            Decoded DEX swap events, transfers, mints, and burns
          </li>
          <li className="flex items-start gap-2">
            <span className="text-movement-yellow mt-0.5">-</span>
            Filter events by any smart contract address
          </li>
              <li className="flex items-start gap-2">
                <span className="text-movement-yellow mt-0.5">-</span>
                Free access with wallet signature
              </li>
        </ul>
      </div>
    </div>
  );
}

