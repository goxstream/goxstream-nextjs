import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-heading",
	subsets: ["latin"],
});

export const runtime = "edge";

export const metadata: Metadata = {
	title: "GoxStream | Premium Anime Streaming",
	description: "The ultimate modern anime streaming platform.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${plusJakartaSans.variable} font-body antialiased`}>
				<TooltipProvider>{children}</TooltipProvider>
			</body>
		</html>
	);
}
