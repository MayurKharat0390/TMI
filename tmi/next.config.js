if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
  delete globalThis.localStorage;
}

/** @type {import('next').NextConfig} */
const nextConfig = {

  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,   // ✅ REQUIRED for static export
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;