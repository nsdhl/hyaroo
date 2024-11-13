// Configuration options for Next.js
const nextConfig = {
  swcMinify: true,      // Enable SWC minification for improved performance
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/product/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['likewows.com'],
    },
  },
};

// Configuration object tells the next-pwa plugin 
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);
