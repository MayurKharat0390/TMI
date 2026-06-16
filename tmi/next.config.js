if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
  delete globalThis.localStorage;
}

/** @type {import('next').NextConfig} */
const nextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,   // ✅ REQUIRED for static export
    formats: ["image/avif", "image/webp"],
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;