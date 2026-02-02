"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import ClientNavbar from "@/components/ClientNavbar";
import AsciiBackground from "@/components/AsciiBackground";
import FloatingBlocks from "@/components/FloatingBlocks";

const DashboardContent = dynamic(
  () => import("@/components/DashboardContent"),
  { 
    ssr: false,
    loading: () => (
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-terminal-green/50 animate-pulse">loading stream...</div>
      </div>
    )
  }
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-terminal-green scanline">
      <AsciiBackground />
      <FloatingBlocks />
      <ClientNavbar />
      
      <main className="relative z-20 px-6 pt-20 pb-24 max-w-7xl mx-auto">
        <DashboardContent />
      </main>

      <Footer />
    </div>
  );
}
