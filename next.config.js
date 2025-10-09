/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Suppress hydration warnings for browser extension attributes
  reactStrictMode: true,
  // Headers for CSP and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';",
          },
        ],
      },
    ];
  },
  // Ensure hot reload works properly in development
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  }),
};

module.exports = nextConfig;
