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
        destination: '/futon-mattresses',
        permanent: true,
      },
      {
        source: '/product-category/futon-mattresses/:path*',
        destination: '/futon-mattresses',
        permanent: true,
      },
      
      // Catch-all for other old product categories
      {
        source: '/product-category/:slug*',
        destination: '/shop',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;