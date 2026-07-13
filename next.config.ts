import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Keep server-only packages external so Turbopack doesn't try to bundle
	// their Node-specific code. Prevents CJS/ESM/gRPC bundling issues.
	serverExternalPackages: ["firebase-admin", "jsonwebtoken"],
};

export default nextConfig;
