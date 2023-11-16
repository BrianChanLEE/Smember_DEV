/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack5: true,
  webpack: (config, options) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
