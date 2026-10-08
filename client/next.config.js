/** @type {import('next').NextConfig} */
const mainServerUrl = process.env.MAIN_SERVER_URL || "http://main-server:8000";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${mainServerUrl}/v1/:path*`,
      },
      {
        source: "/api-logs/:path*",
        destination: `${mainServerUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
