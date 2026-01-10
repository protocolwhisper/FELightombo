"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import ClientNavbar from "@/components/ClientNavbar";

const DashboardContent = dynamic(
  () => import("@/components/DashboardContent"),
  { 
    ssr: false,
    loading: () => (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-10 bg-gray-800 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="border border-gray-800 bg-gray-900/50 rounded-xl p-8">
          <div className="h-20 bg-gray-800 rounded animate-pulse mb-4"></div>
          <div className="h-12 bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-movement-yellow selection:text-black">
      <ClientNavbar />
      
      <main className="px-6 py-12 max-w-7xl mx-auto">
        <DashboardContent />
      </main>

      <Footer />
    </div>
  );
}
