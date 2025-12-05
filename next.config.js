/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Force rebuild on deployment
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig

