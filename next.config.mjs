/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/contact',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/policies',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/sensor-installation',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/data-collection',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/database-processing',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/smart-alerts',
        destination: '/admin-dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
