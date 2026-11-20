import type { NextConfig } from "next";

const apiHostname = process.env.NEXT_PUBLIC_API_HOSTNAME ?? "localhost";
const isDev = !process.env.NEXT_PUBLIC_API_HOSTNAME;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Development: http://localhost:3007/uploads/**
      ...(isDev
        ? [{ protocol: "http" as const, hostname: "localhost", port: "3007", pathname: "/uploads/**" }]
        : []),
      // Production: https://<NEXT_PUBLIC_API_HOSTNAME>/uploads/**
      ...(!isDev
        ? [{ protocol: "https" as const, hostname: apiHostname, pathname: "/uploads/**" }]
        : []),
    ],
  },
};

export default nextConfig;
