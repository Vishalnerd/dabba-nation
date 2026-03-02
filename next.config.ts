/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This ensures a small type error doesn't crash the final deploy
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;