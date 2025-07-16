/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'blog.api.klubiq.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.api.klubiq.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:1337/uploads/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://blog.api.klubiq.com/uploads/:path*',
      },
    ]
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      qs: require.resolve('qs'),
    }
    return config
  },
}

module.exports = nextConfig 