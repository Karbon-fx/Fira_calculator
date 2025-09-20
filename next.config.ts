import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/firc-calculator',
        permanent: true,
      },
    ];
  },
  webpack: (config, {isServer}) => {
    // Fixes npm packages that depend on server-side modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
