/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React Strict Mode to highlight potential problems
  eslint: {
    // Disable ESLint during production builds to prevent lint errors from blocking the build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
