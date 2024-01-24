/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jar-img.monobank.com.ua',
      },
      {
        protocol: 'https',
        hostname: 'ava-img.monobank.com.ua',
      },
    ],
  },
};

module.exports = nextConfig;
