import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack configuration (used by default in Next.js 16)
  turbopack: {
    resolveAlias: {
      // Externalize better-sqlite3 for server-side rendering
      'better-sqlite3': 'better-sqlite3',
    },
  },
  // Webpack configuration (for backward compatibility when using --webpack flag)
  webpack: (config, { isServer }) => {
    // Fix for better-sqlite3
    if (isServer) {
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

export default nextConfig;
