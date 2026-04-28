import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI PDF Data Extractor - Deep Scan Tables & Text | Smart PDF Pro",
  description: "Use advanced neural scanning to extract structured tables, charts, and text from PDFs into usable datasets.",
};

export default function ExtractLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
