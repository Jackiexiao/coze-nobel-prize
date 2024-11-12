/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['api.miruike-tech.com'], // 添加允许的图片域名
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.byteimg.com',
            },
        ],
    },
};

module.exports = nextConfig;
