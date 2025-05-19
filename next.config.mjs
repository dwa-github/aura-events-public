/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ea7ob5tqugt59b3o.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
