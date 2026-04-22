import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ... (keep metadata)
  title: "Smart PDF Pro | Free Deep Scan & PDF Utilities",
  description: "Advanced PDF tools: Merge, Split, Image to PDF, and Deep Data Extraction. Extract tables and text from PDFs automatically with our high-speed tool.",
  keywords: "PDF extractor, merge PDF free, split PDF ranges, image to PDF converter, PDF table extraction, pdfplumber online, Stirling-PDF alternative",
  openGraph: {
    title: "Smart PDF Pro",
    description: "The fastest way to manage your PDFs and extract data.",
    type: "website",
    locale: "en_US",
    url: "https://smartpdfpro.app",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#0a0c10]" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-[#0a0c10] text-slate-200 selection:bg-blue-500/30`}>
        {children}
      </body>
    </html>
  );
}
