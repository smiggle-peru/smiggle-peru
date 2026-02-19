/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Desactiva Image Optimization de Vercel
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.smiggle-peru.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;