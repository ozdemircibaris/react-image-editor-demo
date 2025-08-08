import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ozdemircibaris/react-image-editor"],
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
