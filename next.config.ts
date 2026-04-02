import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Optimiza el empaquetado para Docker o entornos no-Vercel
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crests.football-data.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
