// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for better performance in production
  output: 'standalone',
  
  // Configure allowed hosts
  experimental: {
    serverComponentsExternalPackages: ['@opennextjs/cloudflare'],
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/projects',
        permanent: true,
      },
    ];
  },
  
  // Configure image optimization
  images: {
    domains: ['assets.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Configure environment variables
  env: {
    APP_ENV: process.env.NODE_ENV,
  },
  
  // Configure build settings
  swcMinify: true,
  reactStrictMode: true,
  
  // Configure Cloudflare specific settings
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
