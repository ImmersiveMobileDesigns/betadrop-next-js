/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    // Disable image optimization for static export
    images: {
        unoptimized: true,
    },
    // Trailing slashes are recommended for static exports
    trailingSlash: true,
};

module.exports = nextConfig;
