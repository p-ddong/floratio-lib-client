import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.nparks.gov.sg"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.nparks.gov.sg",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
