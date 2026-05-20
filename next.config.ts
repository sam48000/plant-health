import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Vercel Blob — photos uploadées en production
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Permet les photos jusqu'à 10MB (défaut : 1MB — trop petit pour les photos iPhone)
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
