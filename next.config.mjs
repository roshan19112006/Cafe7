/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cafe7.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cafe7.in',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
