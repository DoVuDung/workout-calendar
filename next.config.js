/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
