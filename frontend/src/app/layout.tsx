import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart PDF Pro | Free Deep Scan & PDF Utilities",
  description:
    "Advanced PDF tools: Merge, Split, Image to PDF, and Deep Data Extraction.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5202519329050813"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {children}
      </body>
    </html>
  );
}
