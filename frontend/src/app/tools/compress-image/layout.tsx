import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor - Optimize JPG & PNG | Smart PDF Pro",
  description: "Ultra-fast optimization for JPG and PNG images. Reduce file size by up to 80% while maintaining visual quality.",
};

export default function CompressImageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
