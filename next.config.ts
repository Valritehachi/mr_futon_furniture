import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'obkhemmqcmujtwykliwf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      // Futon Frames -> Futon Sets
      {
        source: '/product-category/futon-frames',
        destination: '/futon-sets',
        permanent: true,
      },
      {
        source: '/product-category/futon-frames/:path*',
        destination: '/futon-sets',
        permanent: true,
      },
      
      // Futon Mattresses
      {
        source: '/product-category/futon-mattresses',
        destination: '/mattresses',
        permanent: true,
      },
      {
        source: '/product-category/futon-mattresses/:path*',
        destination: '/mattresses',
        permanent: true,
      },

       // Shop page redirect
      {
        source: '/shop',
        destination: '/contact',
        permanent: true,
      },
      
      // Catch-all for other old product categories
      {
        source: '/product-category/:slug*',
        destination: '/contact',
        permanent: true,
      },
      
      // Catch-all for other old product categories
      {
        source: '/product-category/:slug*',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;