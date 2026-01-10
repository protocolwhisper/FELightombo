"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WalletProvider = dynamic(
  () => import("@/components/WalletProvider"),
  { ssr: false }
);

export default function ClientWalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <WalletProvider>{children}</WalletProvider>;
}

