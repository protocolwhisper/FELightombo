import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable SSR for pages that use wallet adapter
  // All wallet adapter code is loaded via dynamic imports with ssr: false
};

export default nextConfig;
