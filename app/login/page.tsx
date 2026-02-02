"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import ClientNavbar from "@/components/ClientNavbar";
import AsciiBackground from "@/components/AsciiBackground";
import FloatingBlocks from "@/components/FloatingBlocks";

const LoginContent = dynamic(
  () => import("@/components/LoginContent"),
  { 
    ssr: false,
    loading: () => (
      <div className="max-w-lg mx-auto text-center">
        <div className="text-terminal-green/50 animate-pulse">loading...</div>
      </div>
    )
  }
);

export default function Login() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-terminal-green scanline">
      <AsciiBackground />
      <FloatingBlocks />
      <ClientNavbar />
      
      <main className="relative z-20 px-6 py-32 max-w-7xl mx-auto pb-24">
        <LoginContent />
      </main>

      <Footer />
    </div>
  );
}
