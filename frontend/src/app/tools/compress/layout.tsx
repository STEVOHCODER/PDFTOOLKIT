import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Compressor - Reduce PDF Size Online | Smart PDF Pro",
  description: "Reduce PDF file size for easier sharing without losing quality. Optimize your documents with our advanced compression engine.",
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
