import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // localhost と 127.0.0.1 を行き来すると dev 時に /_next/* へ cross-origin と判定されるため
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
