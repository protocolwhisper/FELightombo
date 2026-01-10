"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import ClientNavbar from "@/components/ClientNavbar";

const LoginContent = dynamic(
  () => import("@/components/LoginContent"),
  { 
    ssr: false,
    loading: () => (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="h-10 bg-gray-800 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        <div className="border border-gray-800 bg-gray-900/50 rounded-xl p-8">
          <div className="h-6 bg-gray-800 rounded w-1/3 mx-auto mb-6 animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }
);

export default function Login() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-movement-yellow selection:text-black">
      <ClientNavbar />
      
      <main className="px-6 py-20 max-w-7xl mx-auto">
        <LoginContent />
      </main>

      <Footer />
    </div>
  );
}
