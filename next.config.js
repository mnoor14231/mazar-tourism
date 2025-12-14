/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  // Force rebuild on deployment
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig

