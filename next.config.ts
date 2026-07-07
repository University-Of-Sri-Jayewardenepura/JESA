import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from bundling firebase-admin; let Node.js load it
  // natively at runtime. Avoids CJS/ESM conflicts between jwks-rsa and jose.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
