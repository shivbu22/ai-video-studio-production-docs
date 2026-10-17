import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ai-video-studio/shared-types", "@ai-video-studio/remotion"],
  reactStrictMode: true,
};

export default nextConfig;
