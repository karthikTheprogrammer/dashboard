/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: '/dashboard',
  assetPrefix: '/dashboard/',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
