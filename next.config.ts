/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false, // ⛔ disable Turbopack
  },
};

module.exports = nextConfig;
