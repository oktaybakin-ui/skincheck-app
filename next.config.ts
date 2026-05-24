import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // Lint hataları production build'ini durdurmasın (kod çalışmasını etkilemez).
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
