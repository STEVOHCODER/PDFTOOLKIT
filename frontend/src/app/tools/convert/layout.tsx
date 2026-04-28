import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF - Convert JPG/PNG to PDF | Smart PDF Pro",
  description: "Convert JPG, PNG, and other image formats into professional, high-quality PDF files instantly.",
};

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
