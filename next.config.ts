
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
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
      },
      {
        protocol: 'https',
        hostname: 'ideogram.ai',
      },
      {
        protocol: 'https',
        hostname: 'xxglwevjclidblnuqgdd.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      executionTimeout: 300, 
    },
  }
};

export default nextConfig;
