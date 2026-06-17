import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
initOpenNextCloudflareForDev();

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
};

export default nextConfig;
