import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteImages } from "@/lib/images";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NEXUS — Premium Tech Store",
  description:
    "Discover a curated collection of premium electronics. Quality meets innovation at NEXUS Store.",
  generator: "Next.js",
  keywords: ["electronics", "tech store", "premium", "gadgets", "nexus"],
  openGraph: {
    title: "NEXUS — Premium Tech Store",
    description:
      "Discover a curated collection of premium electronics. Quality meets innovation.",
    type: "website",
    siteName: "NEXUS Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS — Premium Tech Store",
    description:
      "Discover a curated collection of premium electronics.",
  },
  icons: {
    icon: [
      {
        url: siteImages.iconLight,
        media: "(prefers-color-scheme: light)",
      },
      {
        url: siteImages.iconDark,
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: siteImages.iconSvg,
        type: "image/svg+xml",
      },
    ],
    apple: siteImages.apple,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased bg-[#09090B] text-foreground">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
