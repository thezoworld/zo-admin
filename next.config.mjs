/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "proxy.cdn.zo.xyz",
      },
    ],
  },
}

export default nextConfig
