import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cpjlcwamma.cloudimg.io",
      },
      {
        protocol: "https",
        hostname: "villabase.imagesque.com",
      },
      {
        protocol: "https",
        hostname: "images.elivaas.com",
      },
      {
        protocol: "https",
        hostname: "**.elivaas.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
