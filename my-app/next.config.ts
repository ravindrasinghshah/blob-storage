import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rpa4ahazwq9zs8ny.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
