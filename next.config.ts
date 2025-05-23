import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // JSONモジュールをインポート可能にする
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      use: "json-loader",
      type: "javascript/auto",
    });
    return config;
  },
};

export default nextConfig;
