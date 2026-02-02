/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
