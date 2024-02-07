/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.monobank.com.ua' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
};

module.exports = nextConfig;
