import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy /api/backend/* requests to Render backend
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://cardio-vascular-backend.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;
