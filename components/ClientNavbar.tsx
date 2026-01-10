"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const NavbarContent = dynamic(
  () => import("@/components/NavbarContent"),
  { 
    ssr: false,
    loading: () => (
      <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
          <span className="text-xl font-bold text-white tracking-tighter">Lightombo</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <span>Products</span>
          <span>About Lightombo</span>
          <span>Use Cases</span>
          <span>Blog</span>
          <span>Docs</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="bg-movement-yellow text-black px-4 py-2 rounded-md text-sm font-bold">
            Connect Wallet
          </Link>
        </div>
      </nav>
    )
  }
);

export default function ClientNavbar() {
  return <NavbarContent />;
}

