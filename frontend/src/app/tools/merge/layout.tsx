import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF - Combine PDF Files Online | Smart PDF Pro",
  description: "Seamlessly combine multiple PDF documents into one single file while maintaining formatting. Free online tool for merging PDFs.",
};

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
