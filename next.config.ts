import path from "node:path";
import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',
  // Pin the workspace root so a lockfile in a parent folder can't confuse it.
  outputFileTracingRoot: path.join(__dirname),

  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },

  // Security: hide server fingerprint
  poweredByHeader: false,

  // Image optimization: serve AVIF/WebP automatically
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Tree-shake large packages to reduce client bundle
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
