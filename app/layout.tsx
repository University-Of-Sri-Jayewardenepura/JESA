import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/core/facebook-pixel";
import MSClarity from "@/components/core/ms-clarity";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "JESA 2026 | J'pura Employability Skills Awards",
	description:
		"Official 2026 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
	metadataBase: new URL("https://jesa.usjp.ac.lk"),
	alternates: {
		canonical: "https://jesa.usjp.ac.lk",
	},
	openGraph: {
		title: "JESA 2026 | J'pura Employability Skills Awards",
		description:
			"Official 2026 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
		url: "https://jesa.usjp.ac.lk",
		siteName: "JESA 2026",
		images: [
			{
				url: "/images/opengraph-image.webp",
				width: 1200,
				height: 630,
				alt: "JESA 2026 | J'pura Employability Skills Awards",
				type: "image/webp",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "JESA 2026 | J'pura Employability Skills Awards",
		description:
			"Official 2026 JESA aka J'pura Employability Skills Awards, the ultimate platform for honoring the accomplishments of young talents.",
		images: ["/images/opengraph-image.webp"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link href="https://use.typekit.net/wnv5dxv.css" rel="stylesheet" />
			</head>
			<body className={`${inter.variable} antialiased`}>
				<MSClarity />
				<FacebookPixel />
				{children}
			</body>
		</html>
	);
}
