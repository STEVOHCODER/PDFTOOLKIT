import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF - Extract Pages from PDF Online | Smart PDF Pro",
  description: "Extract specific pages or ranges from your PDF into new individual documents. High-speed, secure PDF splitting tool.",
};

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
