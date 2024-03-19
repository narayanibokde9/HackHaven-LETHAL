/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // image sources
    images: {
        domains: [
            "ipfs.io",
            "gateway.pinata.cloud",
            "amaranth-imperial-boa-5.mypinata.cloud",
        ],
    },
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },
};

export default nextConfig;
