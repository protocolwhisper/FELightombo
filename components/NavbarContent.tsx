"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export default function NavbarContent() {
  const { account, connected, disconnect } = useWallet();

  const shortenAddress = (address?: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/tombo2.png" 
          alt="Lightombo Logo" 
          width={32} 
          height={32} 
          className="rounded-full object-cover"
        />
        <span className="text-xl font-bold text-white tracking-tighter">Lightombo</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="/#products" className="hover:text-white transition-colors">Products</Link>
        <Link href="#" className="hover:text-white transition-colors">About Lightombo</Link>
        <Link href="#" className="hover:text-white transition-colors">Use Cases</Link>
        <Link href="#" className="hover:text-white transition-colors">Blog</Link>
        <Link href="#" className="hover:text-white transition-colors">Docs</Link>
      </div>

      <div className="flex items-center gap-4">
        {connected ? (
          <>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-movement-yellow hover:text-yellow-300 hidden sm:flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-gray-400 hidden sm:block">
                {shortenAddress(account?.address.toString())}
              </span>
              <button 
                onClick={() => disconnect()}
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-white hover:text-gray-300 hidden sm:block">
              Log In
            </Link>
            <Link href="/login" className="bg-movement-yellow text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-yellow-400 transition-colors">
              Connect Wallet
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

