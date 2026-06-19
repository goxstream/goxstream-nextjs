import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's4.anilist.co',
			},
			{
				protocol: 'https',
				hostname: 'cdn.myanimelist.net',
			},
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
		],
	},
	serverExternalPackages: ["@cloudflare/containers", "cloudflare:workers"],
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = config.externals || [];
			config.externals.push("cloudflare:workers");
		}
		return config;
	},
	turbopack: {}
};

export default nextConfig;
