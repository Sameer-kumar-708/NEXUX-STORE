import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteImages } from "@/lib/images";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus - Premium E-commerce",
  description: "Experience the future of shopping",
  generator: "v0.app",
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
